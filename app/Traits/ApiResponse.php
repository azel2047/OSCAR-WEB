<?php

namespace App\Traits;

trait ApiResponse
{
    protected function success($data = null, string $message = 'Berhasil', int $code = 200, array $meta = [])
    {
        $response = ['success' => true, 'message' => $message];
        if ($data !== null) {
            $response['data'] = $data;
        }
        if (!empty($meta)) {
            $response['meta'] = $meta;
        }
        return response()->json($response, $code);
    }

    protected function error(string $message, int $code = 400, array $errors = [])
    {
        $response = ['success' => false, 'message' => $message];
        if (!empty($errors)) {
            $response['errors'] = $errors;
        }
        return response()->json($response, $code);
    }

    protected function paginated($paginator, string $message = 'Berhasil')
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $paginator->items(),
            'meta'    => [
                'current_page' => $paginator->currentPage(),
                'per_page'     => $paginator->perPage(),
                'total'        => $paginator->total(),
                'last_page'    => $paginator->lastPage(),
            ]
        ]);
    }
}
