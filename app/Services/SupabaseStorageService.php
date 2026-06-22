<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SupabaseStorageService
{
    protected string $url;
    protected string $key;

    public function __construct()
    {
        $this->url = rtrim(env('SUPABASE_URL', 'https://placeholder.supabase.co'), '/');
        $this->key = env('SUPABASE_SERVICE_KEY', 'placeholder');
    }

    /**
     * Upload a file to Supabase Storage and return its public read URL.
     *
     * @param string $bucket
     * @param string $path
     * @param \Illuminate\Http\UploadedFile $file
     * @return string
     * @throws \Exception
     */
    public function upload(string $bucket, string $path, UploadedFile $file): string
    {
        $ext      = $file->getClientOriginalExtension();
        $filename = time() . '_' . Str::random(8) . '.' . $ext;
        $fullPath = ltrim($path . '/' . $filename, '/');

        // Fallback to local storage if key is not a valid JWT JWT always starts with 'eyJ'
        if (!str_starts_with($this->key, 'eyJ')) {
            Log::warning('Supabase key is not a valid JWT. Falling back to local storage.', [
                'key' => $this->key
            ]);
            return $this->uploadLocal($path, $filename, $file);
        }

        $endpoint = "{$this->url}/storage/v1/object/{$bucket}/{$fullPath}";

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->key}",
                'Content-Type'  => $file->getMimeType(),
            ])->withBody(
                file_get_contents($file->getRealPath()),
                $file->getMimeType()
            )->post($endpoint);

            if (!$response->successful()) {
                Log::warning('Supabase Storage Upload Gagal, falling back to local storage', [
                    'endpoint' => $endpoint,
                    'status'   => $response->status(),
                    'body'     => $response->body(),
                ]);
                return $this->uploadLocal($path, $filename, $file);
            }
        } catch (\Exception $e) {
            Log::warning('Supabase connection failed, falling back to local storage', [
                'message' => $e->getMessage()
            ]);
            return $this->uploadLocal($path, $filename, $file);
        }

        // Return the public read URL
        return "{$this->url}/storage/v1/object/public/{$bucket}/{$fullPath}";
    }

    /**
     * Upload fallback to local public directory.
     */
    protected function uploadLocal(string $path, string $filename, UploadedFile $file): string
    {
        $destFolder = public_path("uploads/berkas/{$path}");
        if (!file_exists($destFolder)) {
            mkdir($destFolder, 0777, true);
        }

        copy($file->getRealPath(), $destFolder . '/' . $filename);

        return asset("uploads/berkas/{$path}/{$filename}");
    }

    /**
     * Delete a file from Supabase Storage or Local Storage.
     *
     * @param string $bucket
     * @param string $path
     * @return bool
     */
    public function delete(string $bucket, string $path): bool
    {
        if (empty($path)) {
            return true;
        }

        // If it's a local public asset URL, delete from public uploads folder
        $localPrefix = asset("uploads/berkas/");
        if (str_starts_with($path, $localPrefix)) {
            $relativePath = substr($path, strlen($localPrefix));
            $fullLocalPath = public_path("uploads/berkas/" . $relativePath);
            if (file_exists($fullLocalPath)) {
                @unlink($fullLocalPath);
            }
            return true;
        }

        // If the path is a full public URL, extract the relative path
        $relativePath = $path;
        $publicPrefix = "{$this->url}/storage/v1/object/public/{$bucket}/";
        
        if (str_starts_with($path, $publicPrefix)) {
            $relativePath = substr($path, strlen($publicPrefix));
        }

        $endpoint = "{$this->url}/storage/v1/object/{$bucket}/{$relativePath}";

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->key}",
            ])->delete($endpoint);

            if (!$response->successful()) {
                Log::error('Supabase Storage Delete Gagal', [
                    'endpoint' => $endpoint,
                    'status'   => $response->status(),
                    'body'     => $response->body(),
                ]);
                return false;
            }
        } catch (\Exception $e) {
            Log::error('Supabase delete failed', ['message' => $e->getMessage()]);
            return false;
        }

        return true;
    }
}
