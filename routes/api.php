<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    AuthController, LombaController, TimelineController,
    RoadmapController, MitraController, ConfigController,
    PendaftaranController, NotifikasiController,
    PengumumanController, StatistikController,
    PengumpulanKaryaController, SyaratBerkasController
};
use App\Http\Controllers\Api\Admin\{
    AdminDashboardController, AdminLombaController,
    AdminPendaftaranController, AdminPesertaController,
    AdminTimelineController, AdminRoadmapController,
    AdminPengumumanController, AdminLaporanController,
    AdminMitraController, AdminConfigController
};

// ============================================================
// HEALTH CHECK (Docker & Monitoring)
// ============================================================
Route::get('health', function () {
    return response()->json([
        'status'  => 'ok',
        'app'     => config('app.name'),
        'env'     => config('app.env'),
        'time'    => now()->toISOString(),
    ], 200);
});

Route::get('dev-logs', function () {
    $path = storage_path('logs/laravel.log');
    if (!file_exists($path)) {
        return response()->json(['message' => 'No log file found'], 404);
    }
    $lines = file($path);
    $last_lines = array_slice($lines, -150);
    return response($last_lines, 200, ['Content-Type' => 'text/plain']);
});

Route::get('dev-inspect', function () {
    $seasonsDir = public_path('storage/seasons');
    $files = [];
    if (file_exists($seasonsDir)) {
        foreach (scandir($seasonsDir) as $f) {
            if ($f !== '.' && $f !== '..') {
                $files[] = [
                    'name' => $f,
                    'size' => filesize($seasonsDir . '/' . $f),
                    'time' => date('Y-m-d H:i:s', filemtime($seasonsDir . '/' . $f)),
                ];
            }
        }
    } else {
        $files = 'directory does not exist';
    }
    
    $seasonsDb = App\Models\Season::all()->map(function($s) {
        return [
            'id' => $s->id,
            'nama' => $s->nama,
            'foto_utama' => $s->foto_utama,
            'foto_utama_url' => $s->foto_utama_url,
            'exists_public_path' => !empty($s->foto_utama) && file_exists(public_path('storage/' . $s->foto_utama)),
            'exists_storage_path' => !empty($s->foto_utama) && file_exists(storage_path('app/public/' . $s->foto_utama)),
        ];
    });

    return response()->json([
        'seasons_dir' => $seasonsDir,
        'files' => $files,
        'seasons_db' => $seasonsDb,
        'log_file_time' => file_exists(storage_path('logs/laravel.log')) ? date('Y-m-d H:i:s', filemtime(storage_path('logs/laravel.log'))) : 'no log file',
        'log_file_size' => file_exists(storage_path('logs/laravel.log')) ? filesize(storage_path('logs/laravel.log')) : 0,
    ]);
});

Route::get('dev-log-test', function () {
    try {
        \Log::info('Dev Log Test Message');
        $path = storage_path('logs/laravel.log');
        return response()->json([
            'success' => true,
            'log_writable' => is_writable($path),
            'log_owner' => fileowner($path),
            'current_user' => posix_getpwuid(posix_geteuid())['name'] ?? 'unknown',
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
    }
});

Route::get('dev-debug-logs', function () {
    $path = storage_path('logs/custom_debug.log');
    if (!file_exists($path)) {
        return response()->json(['message' => 'No custom debug log file found'], 404);
    }
    $lines = file($path);
    $last_lines = array_slice($lines, -150);
    return response($last_lines, 200, ['Content-Type' => 'text/plain']);
});

Route::get('dev-debug-logs-clear', function () {
    $path = storage_path('logs/custom_debug.log');
    if (file_exists($path)) {
        unlink($path);
        return response()->json(['message' => 'Logs cleared']);
    }
    return response()->json(['message' => 'No logs to clear']);
});

Route::get('dev-diagnose', function () {
    $logPath = storage_path('logs/custom_debug.log');
    $editSeasonPath = base_path('app/Filament/Resources/SeasonResource/Pages/EditSeason.php');
    
    // Test write
    $testWrite = @file_put_contents($logPath, date('Y-m-d H:i:s') . " - dev-diagnose test write\n", FILE_APPEND);
    
    // Read EditSeason.php to verify content
    $editSeasonContent = file_exists($editSeasonPath) ? file_get_contents($editSeasonPath) : 'FILE NOT FOUND';
    $hasMutateMethod = str_contains($editSeasonContent, 'mutateFormDataBeforeSave');
    $hasAfterSave = str_contains($editSeasonContent, 'afterSave');
    $hasDehydrate = false;
    
    // Check SeasonResource.php for dehydrateStateUsing
    $resourcePath = base_path('app/Filament/Resources/SeasonResource.php');
    if (file_exists($resourcePath)) {
        $resourceContent = file_get_contents($resourcePath);
        $hasDehydrate = str_contains($resourceContent, 'dehydrateStateUsing');
    }
    
    // Check file permissions
    $logExists = file_exists($logPath);
    $logWritable = is_writable($logPath) || is_writable(dirname($logPath));
    
    return response()->json([
        'edit_season_file_exists' => file_exists($editSeasonPath),
        'has_mutateFormDataBeforeSave' => $hasMutateMethod,
        'has_afterSave' => $hasAfterSave,
        'has_dehydrateStateUsing' => $hasDehydrate,
        'edit_season_md5' => file_exists($editSeasonPath) ? md5_file($editSeasonPath) : null,
        'edit_season_content_preview' => file_exists($editSeasonPath) ? substr($editSeasonContent, 0, 2000) : null,
        'log_exists' => $logExists,
        'log_writable' => $logWritable,
        'test_write_result' => $testWrite !== false ? 'SUCCESS (' . $testWrite . ' bytes)' : 'FAILED',
        'current_user' => function_exists('posix_geteuid') ? (posix_getpwuid(posix_geteuid())['name'] ?? 'unknown') : php_sapi_name(),
        'log_dir_writable' => is_writable(storage_path('logs')),
    ]);
});

// Direct DB update for foto_utama (workaround)
Route::get('dev-fix-foto/{seasonId}/{filename}', function ($seasonId, $filename) {
    $season = App\Models\Season::find($seasonId);
    if (!$season) {
        return response()->json(['error' => 'Season not found'], 404);
    }
    $newPath = 'seasons/' . $filename;
    $season->foto_utama = $newPath;
    $season->save();
    return response()->json([
        'success' => true,
        'season_id' => $season->id,
        'new_foto_utama' => $season->foto_utama,
        'file_exists' => file_exists(public_path('storage/' . $newPath)),
    ]);
});




// ============================================================
// AUTH
// ============================================================
Route::prefix('auth')->group(function () {
    Route::post('register',        [AuthController::class, 'register']);
    Route::post('login',           [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password',  [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me',          [AuthController::class, 'me']);
        Route::post('logout',     [AuthController::class, 'logout']);
    });
});

// ============================================================
// PUBLIC
// ============================================================
Route::get('lomba',              [LombaController::class, 'index']);
Route::get('lomba/{slug}',       [LombaController::class, 'show']);
Route::get('lomba/{slug}/faq',   [LombaController::class, 'faq']);
Route::get('timeline',           [TimelineController::class, 'index']);
Route::get('roadmap',            [RoadmapController::class, 'index']);
Route::get('roadmap/{slug}',     [RoadmapController::class, 'show']);
Route::get('mitra',              [MitraController::class, 'index']);
Route::get('config/{key}',       [ConfigController::class, 'show']);
Route::get('statistik/peta',     [StatistikController::class, 'peta']);
Route::get('galeri',             [RoadmapController::class, 'allGaleriPublic']);
Route::get('seasons',            [RoadmapController::class, 'seasonsOnly']);
Route::get('syarat-berkas',      [SyaratBerkasController::class, 'index']);

// ============================================================
// AUTHENTICATED
// ============================================================
Route::middleware('auth:sanctum')->group(function () {
    Route::patch('user/profile', [AuthController::class, 'updateProfile']);
});

// ============================================================
// PESERTA
// ============================================================
Route::middleware(['auth:sanctum', 'role:peserta'])->group(function () {
    Route::get('pendaftaran/saya',         [PendaftaranController::class, 'saya']);
    Route::get('pendaftaran/saya/{id}',    [PendaftaranController::class, 'detail']);
    Route::post('pendaftaran',             [PendaftaranController::class, 'store']);
    Route::post('pendaftaran/{id}/revisi', [PendaftaranController::class, 'revisi']);

    Route::get('notifikasi',                 [NotifikasiController::class, 'index']);
    Route::patch('notifikasi/{id}/baca',     [NotifikasiController::class, 'markRead']);
    Route::patch('notifikasi/baca-semua',    [NotifikasiController::class, 'markAllRead']);

    Route::get('pengumpulan/saya',         [PengumpulanKaryaController::class, 'saya']);
    Route::post('pengumpulan',             [PengumpulanKaryaController::class, 'store']);

    Route::get('pengumuman',                 [PengumumanController::class, 'indexPeserta']);
    Route::get('pengumuman/{id}',            [PengumumanController::class, 'showPeserta']);
});

// ============================================================
// ADMIN
// ============================================================
Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin,po,sc,event,humas,bendahara,sekretaris'])->group(function () {

    // Dashboard & Statistik
    Route::get('statistik/overview',    [AdminDashboardController::class, 'overview']);
    Route::get('statistik/pertumbuhan', [AdminDashboardController::class, 'pertumbuhan']);
    Route::get('statistik/peta',        [AdminDashboardController::class, 'peta']);

    // Lomba
    Route::get('lomba',                 [AdminLombaController::class, 'index']);
    Route::post('lomba',                [AdminLombaController::class, 'store']);
    Route::get('lomba/{id}',            [AdminLombaController::class, 'show']);
    Route::post('lomba/{id}',           [AdminLombaController::class, 'update']); // POST karena multipart
    Route::delete('lomba/{id}',         [AdminLombaController::class, 'destroy']);
    Route::patch('lomba/{id}/status',   [AdminLombaController::class, 'toggleStatus']);

    // FAQ & Timeline per Lomba (nested)
    Route::post('lomba/{id}/faq',            [AdminLombaController::class, 'storeFaq']);
    Route::put('lomba/{id}/faq/{faqId}',     [AdminLombaController::class, 'updateFaq']);
    Route::delete('lomba/{id}/faq/{faqId}',  [AdminLombaController::class, 'destroyFaq']);
    Route::post('lomba/{id}/timeline',             [AdminLombaController::class, 'storeTimeline']);
    Route::put('lomba/{id}/timeline/{tlId}',       [AdminLombaController::class, 'updateTimeline']);
    Route::delete('lomba/{id}/timeline/{tlId}',    [AdminLombaController::class, 'destroyTimeline']);

    // Pendaftaran
    Route::get('pendaftaran',                       [AdminPendaftaranController::class, 'index']);
    Route::get('pendaftaran/{id}',                  [AdminPendaftaranController::class, 'show']);
    Route::put('pendaftaran/{id}/verifikasi',        [AdminPendaftaranController::class, 'verifikasi']);

    // Peserta
    Route::get('peserta',               [AdminPesertaController::class, 'index']);
    Route::get('peserta/export',        [AdminPesertaController::class, 'export']);

    // Timeline Global
    Route::get('timeline',              [AdminTimelineController::class, 'index']);
    Route::post('timeline',             [AdminTimelineController::class, 'store']);
    // update timeline needs to support PUT
    Route::put('timeline/{id}',         [AdminTimelineController::class, 'update']);
    Route::delete('timeline/{id}',      [AdminTimelineController::class, 'destroy']);
    Route::patch('timeline/{id}/aktif', [AdminTimelineController::class, 'setAktif']);
    Route::post('timeline/reorder',     [AdminTimelineController::class, 'reorder']);

    // Season / Roadmap
    Route::get('roadmap',               [AdminRoadmapController::class, 'index']);
    Route::post('roadmap',              [AdminRoadmapController::class, 'store']);
    Route::get('roadmap/{id}',          [AdminRoadmapController::class, 'show']);
    Route::post('roadmap/{id}',         [AdminRoadmapController::class, 'update']); // POST karena multipart
    Route::delete('roadmap/{id}',       [AdminRoadmapController::class, 'destroy']);
    Route::post('roadmap/{id}/galeri',              [AdminRoadmapController::class, 'addGaleri']);
    Route::delete('roadmap/{id}/galeri/{galeriId}', [AdminRoadmapController::class, 'deleteGaleri']);
    Route::post('roadmap/{id}/pemenang',            [AdminRoadmapController::class, 'storePemenang']);
    Route::put('roadmap/{id}/pemenang/{pId}',       [AdminRoadmapController::class, 'updatePemenang']);
    Route::delete('roadmap/{id}/pemenang/{pId}',    [AdminRoadmapController::class, 'destroyPemenang']);

    // Pengumuman
    Route::get('pengumuman',            [AdminPengumumanController::class, 'index']);
    Route::post('pengumuman',           [AdminPengumumanController::class, 'store']);
    Route::get('pengumuman/{id}',       [AdminPengumumanController::class, 'show']);
    Route::put('pengumuman/{id}',       [AdminPengumumanController::class, 'update']);
    Route::delete('pengumuman/{id}',    [AdminPengumumanController::class, 'destroy']);
    Route::post('pengumuman/{id}/kirim-email', [AdminPengumumanController::class, 'kirimEmail']);

    // Galeri Global
    Route::get('galeri',                [AdminRoadmapController::class, 'allGaleri']);
    Route::post('galeri',               [AdminRoadmapController::class, 'addGaleriFromGlobal']);
    Route::delete('galeri/{id}',        [AdminRoadmapController::class, 'deleteGaleriGlobal']);
    Route::get('seasons',               [AdminRoadmapController::class, 'index']);

    // Mitra
    Route::get('mitra',                 [AdminMitraController::class, 'index']);
    Route::post('mitra',                [AdminMitraController::class, 'store']);
    Route::get('mitra/{id}',            [AdminMitraController::class, 'show']);
    Route::post('mitra/{id}',           [AdminMitraController::class, 'update']); // POST karena logo upload
    Route::delete('mitra/{id}',         [AdminMitraController::class, 'destroy']);

    // Config
    Route::get('config',                [AdminConfigController::class, 'index']);
    Route::put('config/{key}',          [AdminConfigController::class, 'update']);

    // Laporan
    Route::get('laporan/ringkasan',     [AdminLaporanController::class, 'ringkasan']);
});

Route::get('test-seasons', function () {
    return response()->json(App\Models\Season::all());
});
