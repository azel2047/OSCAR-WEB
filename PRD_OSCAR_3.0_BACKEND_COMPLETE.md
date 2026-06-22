# TECHNICAL SPECIFICATION — BACKEND
## OSCAR 3.0 — SEASON RAINFOREST
### Laravel 11 API Server

---

| Atribut | Detail |
|---------|--------|
| **Nama Proyek** | Backend OSCAR 3.0 — Season Rainforest |
| **Versi Dokumen** | 1.1 |
| **Tanggal** | Mei 2026 |
| **Status** | Final — Complete |
| **Scope** | Backend API (Laravel 11) |
| **Tech Stack** | Laravel 11, MySQL 8, Laravel Sanctum, Laravel Queue, Mailtrap/SMTP |
| **Pasangan** | PRD Frontend OSCAR 3.0 v2.0 |

---

## DAFTAR ISI

```
1.   Arsitektur Sistem
2.   Database Schema & ERD
3.   Laravel Migrations
4.   Models & Eloquent Relationships
5.   Authentication (Sanctum)
6.   API Routes
7.   Controllers & Business Logic
     7.1  LombaController (Public)
     7.2  PendaftaranController (Peserta)
     7.3  AdminPendaftaranController
     7.4  AdminPesertaController (Export CSV)
     7.5  AdminDashboardController
     7.6  StatistikController (Peta Sebaran)
     7.7  AdminLombaController (CRUD Lengkap + Upload)
     7.8  AdminRoadmapController (Season CRUD)
     7.9  AdminPengumumanController + Broadcast Email
     7.10 AdminConfigController
     7.11 AdminTimelineController
     7.12 NotifikasiController
8.   Form Request Validation
9.   File Storage
10.  Email Notifications
11.  Queue & Jobs
12.  Middleware & Role Authorization
13.  API Resources
14.  Seeders & Factories
15.  Struktur Folder Laravel
16.  Environment & Config
17.  Deployment Notes
```

---

# 1. ARSITEKTUR SISTEM

## 1.1 Overview

```
[React SPA]
    |
    | HTTP (JSON)
    v
[Laravel 11 API]
    |
    +-- [MySQL 8 Database]
    +-- [Laravel Sanctum] (token auth)
    +-- [Laravel Queue] (email, notif)
    +-- [Storage / S3] (file upload)
    +-- [SMTP / Mailtrap] (email)
```

## 1.2 Request Lifecycle

```
Request
  |
[CORS Middleware]
  |
[Sanctum Auth Middleware] (jika route protected)
  |
[Role Middleware] (admin/peserta)
  |
[Form Request Validation]
  |
[Controller]
  |
[Service / Model]
  |
[Response JSON]
```

## 1.3 Response Format Standar

```json
// SUCCESS
{
  "success": true,
  "message": "Berhasil",
  "data": {},
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 234,
    "last_page": 16
  }
}

// ERROR
{
  "success": false,
  "message": "Pesan error yang human-readable",
  "errors": {
    "email": ["Email sudah digunakan."],
    "password": ["Password minimal 8 karakter."]
  }
}
```

```php
// app/Traits/ApiResponse.php
trait ApiResponse
{
    protected function success($data = null, string $message = 'Berhasil', int $code = 200, array $meta = [])
    {
        $response = ['success' => true, 'message' => $message];
        if ($data !== null) $response['data'] = $data;
        if (!empty($meta))  $response['meta'] = $meta;
        return response()->json($response, $code);
    }

    protected function error(string $message, int $code = 400, array $errors = [])
    {
        $response = ['success' => false, 'message' => $message];
        if (!empty($errors)) $response['errors'] = $errors;
        return response()->json($response, $code);
    }

    protected function paginated($paginator, $message = 'Berhasil')
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
```

---

# 2. DATABASE SCHEMA & ERD

## 2.1 ERD (Entity Relationship)

```
users
  |
  +--< pendaftaran
  |       |
  |       +--- lomba
  |       |
  |       +--< berkas_pendaftaran
  |       |
  |       +--< status_history
  |
lomba
  |
  +--< lomba_mitra >-- mitra
  |
  +--- timeline_lomba
  |
  +--< faq_lomba

season
  |
  +--< galeri_season
  |
  +--< pemenang_season

timeline (global OSCAR)

pengumuman
  |
  +--- lomba (nullable, target per lomba)

notifikasi
  |
  +--- users
```

## 2.2 Tabel Lengkap

### users
```sql
CREATE TABLE users (
    id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama              VARCHAR(100) NOT NULL,
    email             VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password          VARCHAR(255) NOT NULL,
    role              ENUM('peserta', 'admin') NOT NULL DEFAULT 'peserta',
    kategori          ENUM('siswa', 'mahasiswa') NULL,
    remember_token    VARCHAR(100) NULL,
    created_at        TIMESTAMP NULL,
    updated_at        TIMESTAMP NULL
);
```

### lomba
```sql
CREATE TABLE lomba (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama         VARCHAR(80) NOT NULL,
    slug         VARCHAR(100) NOT NULL UNIQUE,
    kategori     ENUM('siswa', 'mahasiswa') NOT NULL,
    deskripsi    LONGTEXT NULL,
    persyaratan  LONGTEXT NULL,
    ketentuan    LONGTEXT NULL,
    hadiah_1     VARCHAR(255) NULL,
    hadiah_2     VARCHAR(255) NULL,
    hadiah_3     VARCHAR(255) NULL,
    benefit      TEXT NULL,
    deadline     DATETIME NOT NULL,
    kuota        INT UNSIGNED NOT NULL DEFAULT 0,
    status       ENUM('draft', 'buka', 'tutup') NOT NULL DEFAULT 'draft',
    booklet_path VARCHAR(255) NULL,
    banner_path  VARCHAR(255) NULL,
    created_at   TIMESTAMP NULL,
    updated_at   TIMESTAMP NULL
);
```

### mitra
```sql
CREATE TABLE mitra (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama        VARCHAR(100) NOT NULL,
    logo_path   VARCHAR(255) NOT NULL,
    website_url VARCHAR(255) NULL,
    urutan      INT UNSIGNED NOT NULL DEFAULT 0,
    created_at  TIMESTAMP NULL,
    updated_at  TIMESTAMP NULL
);
```

### lomba_mitra (pivot)
```sql
CREATE TABLE lomba_mitra (
    lomba_id BIGINT UNSIGNED NOT NULL,
    mitra_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (lomba_id, mitra_id),
    FOREIGN KEY (lomba_id) REFERENCES lomba(id) ON DELETE CASCADE,
    FOREIGN KEY (mitra_id) REFERENCES mitra(id) ON DELETE CASCADE
);
```

### faq_lomba
```sql
CREATE TABLE faq_lomba (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    lomba_id   BIGINT UNSIGNED NOT NULL,
    pertanyaan TEXT NOT NULL,
    jawaban    TEXT NOT NULL,
    urutan     INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (lomba_id) REFERENCES lomba(id) ON DELETE CASCADE
);
```

### timeline (global OSCAR)
```sql
CREATE TABLE timeline (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama       VARCHAR(100) NOT NULL,
    tanggal    DATE NOT NULL,
    waktu      TIME NULL,
    keterangan TEXT NULL,
    is_active  BOOLEAN NOT NULL DEFAULT FALSE,
    urutan     INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### timeline_lomba
```sql
CREATE TABLE timeline_lomba (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    lomba_id   BIGINT UNSIGNED NOT NULL,
    stage      VARCHAR(100) NOT NULL,
    tanggal    DATE NOT NULL,
    keterangan TEXT NULL,
    urutan     INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (lomba_id) REFERENCES lomba(id) ON DELETE CASCADE
);
```

### pendaftaran
```sql
CREATE TABLE pendaftaran (
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nomor          VARCHAR(20) NOT NULL UNIQUE,
    user_id        BIGINT UNSIGNED NOT NULL,
    lomba_id       BIGINT UNSIGNED NOT NULL,
    status         ENUM('pending', 'diverifikasi', 'ditolak') NOT NULL DEFAULT 'pending',
    catatan_admin  TEXT NULL,
    data_peserta   JSON NOT NULL,
    submitted_at   TIMESTAMP NULL,
    verified_at    TIMESTAMP NULL,
    verified_by    BIGINT UNSIGNED NULL,
    created_at     TIMESTAMP NULL,
    updated_at     TIMESTAMP NULL,
    FOREIGN KEY (user_id)     REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lomba_id)    REFERENCES lomba(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_lomba (user_id, lomba_id)
);
```

### berkas_pendaftaran
```sql
CREATE TABLE berkas_pendaftaran (
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pendaftaran_id BIGINT UNSIGNED NOT NULL,
    jenis          ENUM('transfer', 'sosmed') NOT NULL,
    path           VARCHAR(255) NOT NULL,
    nama_asli      VARCHAR(255) NOT NULL,
    mime_type      VARCHAR(100) NOT NULL,
    ukuran         INT UNSIGNED NOT NULL,
    created_at     TIMESTAMP NULL,
    updated_at     TIMESTAMP NULL,
    FOREIGN KEY (pendaftaran_id) REFERENCES pendaftaran(id) ON DELETE CASCADE
);
```

### status_history
```sql
CREATE TABLE status_history (
    id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pendaftaran_id BIGINT UNSIGNED NOT NULL,
    status         ENUM('pending', 'diverifikasi', 'ditolak') NOT NULL,
    keterangan     TEXT NULL,
    changed_by     BIGINT UNSIGNED NULL,
    created_at     TIMESTAMP NULL,
    FOREIGN KEY (pendaftaran_id) REFERENCES pendaftaran(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by)     REFERENCES users(id) ON DELETE SET NULL
);
```

### season
```sql
CREATE TABLE season (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nama        VARCHAR(50) NOT NULL,
    slug        VARCHAR(60) NOT NULL UNIQUE,
    tema        VARCHAR(100) NOT NULL,
    tahun       YEAR NOT NULL,
    deskripsi   LONGTEXT NULL,
    cerita      LONGTEXT NULL,
    foto_utama  VARCHAR(255) NULL,
    video_url   VARCHAR(255) NULL,
    jml_peserta INT UNSIGNED NOT NULL DEFAULT 0,
    jml_lomba   INT UNSIGNED NOT NULL DEFAULT 0,
    jml_mitra   INT UNSIGNED NOT NULL DEFAULT 0,
    urutan      INT UNSIGNED NOT NULL DEFAULT 0,
    created_at  TIMESTAMP NULL,
    updated_at  TIMESTAMP NULL
);
```

### galeri_season
```sql
CREATE TABLE galeri_season (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    season_id  BIGINT UNSIGNED NOT NULL,
    path       VARCHAR(255) NOT NULL,
    caption    VARCHAR(255) NULL,
    urutan     INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (season_id) REFERENCES season(id) ON DELETE CASCADE
);
```

### pemenang_season
```sql
CREATE TABLE pemenang_season (
    id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    season_id  BIGINT UNSIGNED NOT NULL,
    nama_lomba VARCHAR(80) NOT NULL,
    juara_1    VARCHAR(150) NOT NULL,
    juara_2    VARCHAR(150) NULL,
    juara_3    VARCHAR(150) NULL,
    urutan     INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (season_id) REFERENCES season(id) ON DELETE CASCADE
);
```

### pengumuman
```sql
CREATE TABLE pengumuman (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    judul       VARCHAR(255) NOT NULL,
    isi         LONGTEXT NOT NULL,
    target      ENUM('semua', 'per_lomba') NOT NULL DEFAULT 'semua',
    lomba_id    BIGINT UNSIGNED NULL,
    publish_at  TIMESTAMP NULL,
    kirim_email BOOLEAN NOT NULL DEFAULT FALSE,
    email_sent  BOOLEAN NOT NULL DEFAULT FALSE,
    created_by  BIGINT UNSIGNED NULL,
    created_at  TIMESTAMP NULL,
    updated_at  TIMESTAMP NULL,
    FOREIGN KEY (lomba_id)   REFERENCES lomba(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
```

### notifikasi
```sql
CREATE TABLE notifikasi (
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT UNSIGNED NOT NULL,
    judul        VARCHAR(255) NOT NULL,
    pesan        TEXT NOT NULL,
    tipe         VARCHAR(50) NOT NULL DEFAULT 'info',
    is_read      BOOLEAN NOT NULL DEFAULT FALSE,
    related_type VARCHAR(100) NULL,
    related_id   BIGINT UNSIGNED NULL,
    created_at   TIMESTAMP NULL,
    updated_at   TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### config
```sql
CREATE TABLE config (
    key        VARCHAR(100) PRIMARY KEY,
    value      TEXT NULL,
    keterangan VARCHAR(255) NULL,
    updated_at TIMESTAMP NULL
);
-- Contoh rows:
-- 'booklet_url'  | 'https://...'         | 'URL booklet utama'
-- 'wa_humas'     | '+6281234567890'       | 'Nomor WA humas'
-- 'ig_handle'    | '@oscar_official'      | 'Handle Instagram'
-- 'email_admin'  | 'admin@oscar.id'       | 'Email kontak admin'
-- 'pendaftaran_open' | '1'               | '1=buka, 0=tutup global'
```

---

# 3. LARAVEL MIGRATIONS

```
database/migrations/
+-- 2026_01_01_000001_create_users_table.php
+-- 2026_01_01_000002_create_password_reset_tokens_table.php
+-- 2026_01_01_000003_create_personal_access_tokens_table.php
+-- 2026_01_02_000001_create_mitra_table.php
+-- 2026_01_02_000002_create_lomba_table.php
+-- 2026_01_02_000003_create_lomba_mitra_table.php
+-- 2026_01_02_000004_create_faq_lomba_table.php
+-- 2026_01_02_000005_create_timeline_table.php
+-- 2026_01_02_000006_create_timeline_lomba_table.php
+-- 2026_01_03_000001_create_pendaftaran_table.php
+-- 2026_01_03_000002_create_berkas_pendaftaran_table.php
+-- 2026_01_03_000003_create_status_history_table.php
+-- 2026_01_04_000001_create_season_table.php
+-- 2026_01_04_000002_create_galeri_season_table.php
+-- 2026_01_04_000003_create_pemenang_season_table.php
+-- 2026_01_05_000001_create_pengumuman_table.php
+-- 2026_01_05_000002_create_notifikasi_table.php
+-- 2026_01_05_000003_create_config_table.php
```

```php
// create_pendaftaran_table.php
public function up(): void
{
    Schema::create('pendaftaran', function (Blueprint $table) {
        $table->id();
        $table->string('nomor', 20)->unique();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->foreignId('lomba_id')->constrained()->cascadeOnDelete();
        $table->enum('status', ['pending', 'diverifikasi', 'ditolak'])->default('pending');
        $table->text('catatan_admin')->nullable();
        $table->json('data_peserta');
        $table->timestamp('submitted_at')->nullable();
        $table->timestamp('verified_at')->nullable();
        $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
        $table->timestamps();
        $table->unique(['user_id', 'lomba_id']);
    });
}

// create_config_table.php
public function up(): void
{
    Schema::create('config', function (Blueprint $table) {
        $table->string('key', 100)->primary();
        $table->text('value')->nullable();
        $table->string('keterangan', 255)->nullable();
        $table->timestamp('updated_at')->nullable();
    });
}

// create_notifikasi_table.php
public function up(): void
{
    Schema::create('notifikasi', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->string('judul');
        $table->text('pesan');
        $table->string('tipe', 50)->default('info');
        $table->boolean('is_read')->default(false);
        $table->string('related_type', 100)->nullable();
        $table->unsignedBigInteger('related_id')->nullable();
        $table->timestamps();
        $table->index(['user_id', 'is_read']);
    });
}
```

---

# 4. MODELS & ELOQUENT RELATIONSHIPS

## 4.1 User Model

```php
// app/Models/User.php
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['nama', 'email', 'password', 'role', 'kategori'];
    protected $hidden   = ['password', 'remember_token'];
    protected $casts    = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
    ];

    public function pendaftaran(): HasMany
    {
        return $this->hasMany(Pendaftaran::class);
    }

    public function notifikasi(): HasMany
    {
        return $this->hasMany(Notifikasi::class);
    }

    public function scopePeserta($query) { return $query->where('role', 'peserta'); }
    public function scopeAdmin($query)   { return $query->where('role', 'admin'); }
    public function isAdmin(): bool      { return $this->role === 'admin'; }
    public function isPeserta(): bool    { return $this->role === 'peserta'; }

    public function unreadNotifCount(): int
    {
        return $this->notifikasi()->where('is_read', false)->count();
    }
}
```

## 4.2 Lomba Model

```php
// app/Models/Lomba.php
class Lomba extends Model
{
    protected $fillable = [
        'nama', 'slug', 'kategori', 'deskripsi', 'persyaratan',
        'ketentuan', 'hadiah_1', 'hadiah_2', 'hadiah_3', 'benefit',
        'deadline', 'kuota', 'status', 'booklet_path', 'banner_path'
    ];

    protected $casts    = ['deadline' => 'datetime'];
    protected $appends  = ['terdaftar', 'booklet_url', 'banner_url'];

    public function mitra(): BelongsToMany
    {
        return $this->belongsToMany(Mitra::class, 'lomba_mitra');
    }

    public function faq(): HasMany
    {
        return $this->hasMany(FaqLomba::class)->orderBy('urutan');
    }

    public function timelineLomba(): HasMany
    {
        return $this->hasMany(TimelineLomba::class)->orderBy('urutan');
    }

    public function pendaftaran(): HasMany
    {
        return $this->hasMany(Pendaftaran::class);
    }

    public function getTerdaftarAttribute(): int
    {
        return $this->pendaftaran()->whereIn('status', ['pending', 'diverifikasi'])->count();
    }

    public function getBookletUrlAttribute(): ?string
    {
        return $this->booklet_path ? Storage::url($this->booklet_path) : null;
    }

    public function getBannerUrlAttribute(): ?string
    {
        return $this->banner_path ? Storage::url($this->banner_path) : null;
    }

    public function isKuotaPenuh(): bool
    {
        return $this->kuota > 0 && $this->terdaftar >= $this->kuota;
    }

    public function isDeadlineLewat(): bool
    {
        return now()->isAfter($this->deadline);
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->nama);
            }
        });
    }
}
```

## 4.3 Pendaftaran Model

```php
// app/Models/Pendaftaran.php
class Pendaftaran extends Model
{
    protected $fillable = [
        'nomor', 'user_id', 'lomba_id', 'status',
        'catatan_admin', 'data_peserta', 'submitted_at',
        'verified_at', 'verified_by'
    ];

    protected $casts = [
        'data_peserta' => 'array',
        'submitted_at' => 'datetime',
        'verified_at'  => 'datetime',
    ];

    public function user(): BelongsTo        { return $this->belongsTo(User::class); }
    public function lomba(): BelongsTo       { return $this->belongsTo(Lomba::class); }
    public function verifiedBy(): BelongsTo  { return $this->belongsTo(User::class, 'verified_by'); }

    public function berkas(): HasMany
    {
        return $this->hasMany(BerkasPendaftaran::class);
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(StatusHistory::class)->orderBy('created_at');
    }

    public function berkasTransfer(): ?BerkasPendaftaran
    {
        return $this->berkas()->where('jenis', 'transfer')->latest()->first();
    }

    public function berkasSosmed(): ?BerkasPendaftaran
    {
        return $this->berkas()->where('jenis', 'sosmed')->latest()->first();
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->nomor)) {
                $model->nomor = static::generateNomor();
            }
        });
    }

    protected static function generateNomor(): string
    {
        $tahun  = now()->year;
        $lastId = static::whereYear('created_at', $tahun)->max('id') ?? 0;
        return sprintf('OSC-%d-%04d', $tahun, $lastId + 1);
    }
}
```

## 4.4 Season Model

```php
// app/Models/Season.php
class Season extends Model
{
    protected $fillable = [
        'nama', 'slug', 'tema', 'tahun', 'deskripsi',
        'cerita', 'foto_utama', 'video_url',
        'jml_peserta', 'jml_lomba', 'jml_mitra', 'urutan'
    ];

    protected $appends = ['foto_utama_url'];

    public function galeri(): HasMany
    {
        return $this->hasMany(GaleriSeason::class)->orderBy('urutan');
    }

    public function pemenang(): HasMany
    {
        return $this->hasMany(PemenangSeason::class)->orderBy('urutan');
    }

    public function getFotoUtamaUrlAttribute(): ?string
    {
        return $this->foto_utama ? Storage::url($this->foto_utama) : null;
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->nama);
            }
        });
    }
}
```

## 4.5 Model Lainnya

```php
// app/Models/Timeline.php
class Timeline extends Model
{
    protected $fillable = ['nama', 'tanggal', 'waktu', 'keterangan', 'is_active', 'urutan'];
    protected $casts    = ['tanggal' => 'date', 'is_active' => 'boolean'];
}

// app/Models/Notifikasi.php
class Notifikasi extends Model
{
    protected $fillable = [
        'user_id', 'judul', 'pesan', 'tipe', 'is_read', 'related_type', 'related_id'
    ];
    protected $casts = ['is_read' => 'boolean'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

// app/Models/Pengumuman.php
class Pengumuman extends Model
{
    protected $fillable = [
        'judul', 'isi', 'target', 'lomba_id',
        'publish_at', 'kirim_email', 'email_sent', 'created_by'
    ];

    protected $casts = [
        'publish_at'  => 'datetime',
        'kirim_email' => 'boolean',
        'email_sent'  => 'boolean',
    ];

    public function lomba(): BelongsTo
    {
        return $this->belongsTo(Lomba::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isPublished(): bool
    {
        return is_null($this->publish_at) || $this->publish_at->isPast();
    }
}

// app/Models/Config.php
class Config extends Model
{
    protected $primaryKey = 'key';
    protected $keyType    = 'string';
    public $incrementing  = false;
    public $timestamps    = false;

    protected $fillable = ['key', 'value', 'keterangan'];

    // Helper statis
    public static function get(string $key, mixed $default = null): mixed
    {
        return static::find($key)?->value ?? $default;
    }

    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'updated_at' => now()]
        );
    }
}

// app/Models/Mitra.php
class Mitra extends Model
{
    protected $fillable = ['nama', 'logo_path', 'website_url', 'urutan'];
    protected $appends  = ['logo_url'];

    public function getLogo_urlAttribute(): ?string
    {
        return $this->logo_path ? Storage::url($this->logo_path) : null;
    }

    public function lomba(): BelongsToMany
    {
        return $this->belongsToMany(Lomba::class, 'lomba_mitra');
    }
}

// app/Models/GaleriSeason.php
class GaleriSeason extends Model
{
    protected $fillable = ['season_id', 'path', 'caption', 'urutan'];
    protected $appends  = ['url'];

    public function getUrlAttribute(): string
    {
        return Storage::url($this->path);
    }
}

// app/Models/StatusHistory.php
class StatusHistory extends Model
{
    public $timestamps = false;
    protected $fillable = ['pendaftaran_id', 'status', 'keterangan', 'changed_by'];
    protected $casts    = ['created_at' => 'datetime'];

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
```

---

# 5. AUTHENTICATION (SANCTUM)

## 5.1 Setup

```bash
php artisan install:api
```

## 5.2 AuthController

```php
// app/Http/Controllers/Api/AuthController.php
class AuthController extends Controller
{
    use ApiResponse;

    public function register(RegisterRequest $request)
    {
        $user  = User::create([
            'nama'     => $request->nama,
            'email'    => $request->email,
            'password' => $request->password,
            'role'     => 'peserta',
            'kategori' => $request->kategori,
        ]);
        $token = $user->createToken('oscar-token')->plainTextToken;

        Mail::to($user->email)->queue(new WelcomeEmail($user));

        return $this->success([
            'user'  => new UserResource($user),
            'token' => $token,
        ], 'Akun berhasil dibuat', 201);
    }

    public function login(LoginRequest $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return $this->error('Email atau password salah', 401);
        }

        $user  = Auth::user();
        $expiry = $request->boolean('remember')
            ? now()->addDays(30)
            : now()->addDays(1);

        $token = $user->createToken('oscar-token', ['*'], $expiry)->plainTextToken;

        return $this->success([
            'user'  => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->success(null, 'Berhasil logout');
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('notifikasi');
        return $this->success(new UserResource($user));
    }

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        Password::sendResetLink($request->only('email'));
        return $this->success(null, 'Jika email terdaftar, link reset akan dikirim');
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill(['password' => $password])->save();
                $user->tokens()->delete();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return $this->success(null, 'Password berhasil direset');
        }

        return $this->error(match($status) {
            Password::INVALID_TOKEN => 'Link sudah kedaluwarsa atau sudah digunakan',
            Password::INVALID_USER  => 'Email tidak ditemukan',
            default                 => 'Gagal mereset password',
        }, 400);
    }
}
```

---

# 6. API ROUTES

```php
// routes/api.php
<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    AuthController, LombaController, TimelineController,
    RoadmapController, MitraController, ConfigController,
    PendaftaranController, NotifikasiController,
    PengumumanController, StatistikController
};
use App\Http\Controllers\Api\Admin\{
    AdminDashboardController, AdminLombaController,
    AdminPendaftaranController, AdminPesertaController,
    AdminTimelineController, AdminRoadmapController,
    AdminPengumumanController, AdminLaporanController,
    AdminMitraController, AdminConfigController
};

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

    Route::get('pengumuman',                 [PengumumanController::class, 'indexPeserta']);
    Route::get('pengumuman/{id}',            [PengumumanController::class, 'showPeserta']);
});

// ============================================================
// ADMIN
// ============================================================
Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {

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

    // Mitra
    Route::apiResource('mitra', AdminMitraController::class);

    // Config
    Route::get('config',                [AdminConfigController::class, 'index']);
    Route::put('config/{key}',          [AdminConfigController::class, 'update']);

    // Laporan
    Route::get('laporan/ringkasan',     [AdminLaporanController::class, 'ringkasan']);
});
```

---

# 7. CONTROLLERS & BUSINESS LOGIC

## 7.1 LombaController (Public)

```php
// app/Http/Controllers/Api/LombaController.php
class LombaController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Lomba::with(['mitra'])
            ->where('status', '!=', 'draft')
            ->when($request->kategori, fn($q, $v) => $q->where('kategori', $v))
            ->when($request->status,   fn($q, $v) => $q->where('status', $v))
            ->when($request->search,   fn($q, $v) => $q->where('nama', 'like', "%$v%"));

        $query = match($request->sort) {
            'deadline' => $query->orderBy('deadline', 'asc'),
            default    => $query->latest(),
        };

        return $this->success(LombaResource::collection($query->get()));
    }

    public function show(string $slug)
    {
        $lomba = Lomba::with(['mitra', 'faq', 'timelineLomba'])
            ->where('slug', $slug)
            ->where('status', '!=', 'draft')
            ->firstOrFail();

        return $this->success(new LombaDetailResource($lomba));
    }

    public function faq(string $slug)
    {
        $lomba = Lomba::where('slug', $slug)->firstOrFail();
        return $this->success(FaqResource::collection($lomba->faq));
    }
}
```

## 7.2 PendaftaranController (Peserta)

```php
// app/Http/Controllers/Api/PendaftaranController.php
class PendaftaranController extends Controller
{
    use ApiResponse;

    public function saya(Request $request)
    {
        $data = $request->user()->pendaftaran()
            ->with(['lomba', 'berkas', 'statusHistory'])
            ->latest()->get();
        return $this->success(PendaftaranResource::collection($data));
    }

    public function detail(Request $request, int $id)
    {
        $pendaftaran = $request->user()->pendaftaran()
            ->with(['lomba', 'berkas', 'statusHistory.changedBy'])
            ->findOrFail($id);
        return $this->success(new PendaftaranResource($pendaftaran));
    }

    public function store(StorePendaftaranRequest $request)
    {
        $user  = $request->user();
        $lomba = Lomba::findOrFail($request->lomba_id);

        if ($lomba->status !== 'buka')           return $this->error('Pendaftaran lomba ini sudah ditutup', 422);
        if ($lomba->isDeadlineLewat())            return $this->error('Deadline pendaftaran sudah lewat', 422);
        if ($lomba->isKuotaPenuh())               return $this->error('Kuota pendaftaran sudah penuh', 422);
        if ($user->pendaftaran()->where('lomba_id', $lomba->id)->exists())
            return $this->error('Anda sudah mendaftar lomba ini', 409);

        $pendaftaran = null;
        DB::transaction(function () use ($request, $user, $lomba, &$pendaftaran) {
            $pendaftaran = Pendaftaran::create([
                'user_id'      => $user->id,
                'lomba_id'     => $lomba->id,
                'status'       => 'pending',
                'data_peserta' => $request->getData(),
                'submitted_at' => now(),
            ]);

            foreach (['transfer', 'sosmed'] as $jenis) {
                $key = $jenis === 'transfer' ? 'bukti_transfer' : 'bukti_sosmed';
                if ($request->hasFile($key)) {
                    $file = $request->file($key);
                    $path = $file->store("berkas/{$pendaftaran->id}", 'public');
                    BerkasPendaftaran::create([
                        'pendaftaran_id' => $pendaftaran->id,
                        'jenis'          => $jenis,
                        'path'           => $path,
                        'nama_asli'      => $file->getClientOriginalName(),
                        'mime_type'      => $file->getMimeType(),
                        'ukuran'         => $file->getSize(),
                    ]);
                }
            }

            StatusHistory::create([
                'pendaftaran_id' => $pendaftaran->id,
                'status'         => 'pending',
                'keterangan'     => 'Pendaftaran dikirim oleh peserta',
                'changed_by'     => null,
            ]);

            Notifikasi::create([
                'user_id'      => $user->id,
                'judul'        => 'Pendaftaran Berhasil Dikirim',
                'pesan'        => "Pendaftaran Anda untuk lomba {$lomba->nama} dengan nomor {$pendaftaran->nomor} sedang diproses.",
                'tipe'         => 'info',
                'related_type' => 'pendaftaran',
                'related_id'   => $pendaftaran->id,
            ]);
        });

        Mail::to($user->email)->queue(new PendaftaranKonfirmasiEmail($pendaftaran));

        return $this->success(
            new PendaftaranResource($pendaftaran->load(['lomba', 'berkas'])),
            'Pendaftaran berhasil dikirim', 201
        );
    }

    public function revisi(Request $request, int $id)
    {
        $pendaftaran = $request->user()->pendaftaran()
            ->where('id', $id)->where('status', 'ditolak')->firstOrFail();

        $request->validate([
            'bukti_transfer' => 'sometimes|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'bukti_sosmed'   => 'sometimes|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        DB::transaction(function () use ($request, $pendaftaran) {
            foreach (['transfer', 'sosmed'] as $jenis) {
                $key = $jenis === 'transfer' ? 'bukti_transfer' : 'bukti_sosmed';
                if ($request->hasFile($key)) {
                    $old = $pendaftaran->berkas()->where('jenis', $jenis)->latest()->first();
                    if ($old) Storage::delete($old->path);

                    $file = $request->file($key);
                    $path = $file->store("berkas/{$pendaftaran->id}", 'public');
                    BerkasPendaftaran::create([
                        'pendaftaran_id' => $pendaftaran->id,
                        'jenis'          => $jenis,
                        'path'           => $path,
                        'nama_asli'      => $file->getClientOriginalName(),
                        'mime_type'      => $file->getMimeType(),
                        'ukuran'         => $file->getSize(),
                    ]);
                }
            }

            $pendaftaran->update(['status' => 'pending', 'catatan_admin' => null]);

            StatusHistory::create([
                'pendaftaran_id' => $pendaftaran->id,
                'status'         => 'pending',
                'keterangan'     => 'Revisi dikirim oleh peserta',
                'changed_by'     => $request->user()->id,
            ]);
        });

        return $this->success(
            new PendaftaranResource($pendaftaran->fresh()->load(['lomba', 'berkas'])),
            'Revisi berhasil dikirim'
        );
    }
}
```

## 7.3 AdminPendaftaranController

```php
// app/Http/Controllers/Api/Admin/AdminPendaftaranController.php
class AdminPendaftaranController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Pendaftaran::with(['user', 'lomba', 'berkas'])
            ->when($request->status,        fn($q, $v) => $q->where('status', $v))
            ->when($request->lomba_id,      fn($q, $v) => $q->where('lomba_id', $v))
            ->when($request->tanggal_mulai, fn($q, $v) => $q->whereDate('created_at', '>=', $v))
            ->when($request->tanggal_akhir, fn($q, $v) => $q->whereDate('created_at', '<=', $v))
            ->when($request->search, fn($q, $v) =>
                $q->where('nomor', 'like', "%$v%")
                  ->orWhereHas('user', fn($u) => $u->where('nama', 'like', "%$v%"))
            )
            ->latest();

        return $this->paginated($query->paginate(20));
    }

    public function show(int $id)
    {
        $p = Pendaftaran::with(['user', 'lomba', 'berkas', 'statusHistory.changedBy'])->findOrFail($id);
        return $this->success(new AdminPendaftaranDetailResource($p));
    }

    public function verifikasi(VerifikasiRequest $request, int $id)
    {
        $pendaftaran = Pendaftaran::with(['user', 'lomba'])->findOrFail($id);

        if ($pendaftaran->status !== 'pending') {
            return $this->error('Hanya pendaftaran berstatus pending yang bisa diverifikasi', 422);
        }

        $action  = $request->action;
        $catatan = $request->catatan;
        $status  = $action === 'terima' ? 'diverifikasi' : 'ditolak';

        DB::transaction(function () use ($pendaftaran, $action, $catatan, $status, $request) {
            $pendaftaran->update([
                'status'        => $status,
                'catatan_admin' => $catatan,
                'verified_at'   => now(),
                'verified_by'   => $request->user()->id,
            ]);

            StatusHistory::create([
                'pendaftaran_id' => $pendaftaran->id,
                'status'         => $status,
                'keterangan'     => $catatan ?? ($action === 'terima' ? 'Diverifikasi oleh admin' : null),
                'changed_by'     => $request->user()->id,
            ]);

            Notifikasi::create([
                'user_id'      => $pendaftaran->user_id,
                'judul'        => $action === 'terima' ? 'Pendaftaran Diverifikasi' : 'Pendaftaran Ditolak',
                'pesan'        => $action === 'terima'
                    ? "Selamat! Pendaftaran Anda untuk {$pendaftaran->lomba->nama} telah diverifikasi."
                    : "Pendaftaran Anda untuk {$pendaftaran->lomba->nama} ditolak. Alasan: {$catatan}",
                'tipe'         => $action === 'terima' ? 'success' : 'error',
                'related_type' => 'pendaftaran',
                'related_id'   => $pendaftaran->id,
            ]);
        });

        $emailClass = $action === 'terima'
            ? PendaftaranDiverifikasiEmail::class
            : PendaftaranDitolakEmail::class;
        Mail::to($pendaftaran->user->email)->queue(new $emailClass($pendaftaran));

        return $this->success(
            new AdminPendaftaranDetailResource(
                $pendaftaran->fresh()->load(['user', 'lomba', 'statusHistory'])
            ),
            $action === 'terima' ? 'Pendaftaran diverifikasi' : 'Pendaftaran ditolak'
        );
    }
}
```

## 7.4 AdminPesertaController (Export CSV)

```php
// app/Http/Controllers/Api/Admin/AdminPesertaController.php
class AdminPesertaController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Pendaftaran::with(['user', 'lomba'])
            ->when($request->lomba_id, fn($q, $v) => $q->where('lomba_id', $v))
            ->when($request->status,   fn($q, $v) => $q->where('status', $v))
            ->when($request->search,   fn($q, $v) =>
                $q->where('nomor', 'like', "%$v%")
                  ->orWhereJsonContains('data_peserta->nama_peserta_1', $v)
            )
            ->latest();

        return $this->paginated($query->paginate(50));
    }

    public function export(Request $request)
    {
        $request->validate(['lomba_id' => 'required|exists:lomba,id']);
        $lomba = Lomba::findOrFail($request->lomba_id);

        $pendaftaran = Pendaftaran::with(['user'])
            ->where('lomba_id', $lomba->id)
            ->where('status', 'diverifikasi')
            ->get();

        $filename = "peserta_{$lomba->slug}_" . now()->format('Ymd') . ".csv";
        $headers  = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($pendaftaran, $lomba) {
            $file = fopen('php://output', 'w');
            fputs($file, "\xEF\xBB\xBF"); // BOM for Excel

            $header = $lomba->kategori === 'siswa'
                ? ['No','Nomor','Peserta 1','Peserta 2','Pendamping','Sekolah','No WA','Email','Tema','Tanggal Daftar']
                : ['No','Nomor','Peserta 1','Peserta 2','Peserta 3','Universitas','No WA','Email','Tema','Tanggal Daftar'];
            fputcsv($file, $header);

            foreach ($pendaftaran as $i => $p) {
                $d   = $p->data_peserta;
                $row = $lomba->kategori === 'siswa'
                    ? [$i+1, $p->nomor, $d['nama_peserta_1']??'', $d['nama_peserta_2']??'',
                       $d['nama_pendamping']??'', $d['asal_sekolah']??'',
                       $d['no_wa']??'', $d['email']??'', $d['tema']??'',
                       $p->created_at->format('d/m/Y H:i')]
                    : [$i+1, $p->nomor, $d['nama_peserta_1']??'', $d['nama_peserta_2']??'',
                       $d['nama_peserta_3']??'', $d['asal_universitas']??'',
                       $d['no_wa']??'', $d['email']??'', $d['tema']??'',
                       $p->created_at->format('d/m/Y H:i')];
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
```

## 7.5 AdminDashboardController

```php
// app/Http/Controllers/Api/Admin/AdminDashboardController.php
class AdminDashboardController extends Controller
{
    use ApiResponse;

    public function overview()
    {
        return $this->success([
            'total_peserta'      => Pendaftaran::whereIn('status', ['pending','diverifikasi'])->count(),
            'pending_verif'      => Pendaftaran::where('status', 'pending')->count(),
            'lomba_aktif'        => Lomba::where('status', 'buka')->count(),
            'daftar_hari_ini'    => Pendaftaran::whereDate('created_at', today())->count(),
            'delta_kemarin'      => $this->deltaKemarin(),
            'peserta_per_lomba'  => Lomba::withCount([
                'pendaftaran as total' => fn($q) =>
                    $q->whereIn('status', ['pending','diverifikasi'])
            ])->get()->map(fn($l) => ['nama' => $l->nama, 'total' => $l->total]),
            'distribusi_kategori' => [
                'siswa'     => Pendaftaran::whereHas('lomba', fn($q) => $q->where('kategori','siswa'))->count(),
                'mahasiswa' => Pendaftaran::whereHas('lomba', fn($q) => $q->where('kategori','mahasiswa'))->count(),
            ],
            'pendaftaran_terbaru' => Pendaftaran::with(['user','lomba'])->latest()->limit(10)->get(),
        ]);
    }

    public function pertumbuhan(Request $request)
    {
        $days = min((int)($request->days ?? 7), 30);

        $data = Pendaftaran::selectRaw('DATE(created_at) as tanggal, COUNT(*) as total')
            ->where('created_at', '>=', now()->subDays($days))
            ->groupBy('tanggal')
            ->orderBy('tanggal')
            ->get()
            ->keyBy('tanggal');

        $result = collect();
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $result->push(['tanggal' => $date, 'total' => $data->get($date)?->total ?? 0]);
        }

        return $this->success($result);
    }

    private function deltaKemarin(): array
    {
        $today     = Pendaftaran::whereDate('created_at', today())->count();
        $yesterday = Pendaftaran::whereDate('created_at', today()->subDay())->count();
        return ['today' => $today, 'yesterday' => $yesterday, 'delta' => $today - $yesterday];
    }
}
```


## 7.6 StatistikController (Peta Sebaran)

```php
// app/Http/Controllers/Api/StatistikController.php
class StatistikController extends Controller
{
    use ApiResponse;

    /**
     * Peta sebaran peserta per provinsi/kota.
     * Mengambil dari kolom data_peserta JSON (field asal_sekolah / asal_universitas).
     * Mapping ke provinsi dilakukan via helper sederhana berbasis keyword.
     */
    public function peta(Request $request)
    {
        $lombaId = $request->lomba_id;

        $query = Pendaftaran::whereIn('status', ['pending', 'diverifikasi'])
            ->when($lombaId, fn($q, $v) => $q->where('lomba_id', $v));

        $pendaftaran = $query->get(['data_peserta', 'lomba_id']);

        // Kelompokkan berdasarkan provinsi
        $sebaran = [];
        foreach ($pendaftaran as $p) {
            $asal     = $p->data_peserta['asal_sekolah']
                     ?? $p->data_peserta['asal_universitas']
                     ?? '';
            $provinsi = $this->resolveProvinsi($asal);

            if (!isset($sebaran[$provinsi])) {
                $sebaran[$provinsi] = ['provinsi' => $provinsi, 'total' => 0];
            }
            $sebaran[$provinsi]['total']++;
        }

        $result = collect(array_values($sebaran))->sortByDesc('total')->values();

        return $this->success([
            'total'   => $pendaftaran->count(),
            'sebaran' => $result,
        ]);
    }

    /**
     * Resolusi nama provinsi dari string asal sekolah/universitas.
     * Extend mapping sesuai kebutuhan data aktual.
     */
    private function resolveProvinsi(string $asal): string
    {
        $asal = strtolower($asal);

        $mapping = [
            'Jawa Timur'       => ['surabaya','malang','sidoarjo','gresik','mojokerto','kediri','blitar','madiun','jember','banyuwangi','pasuruan','probolinggo','lumajang','jombang','nganjuk','tuban','lamongan','bojonegoro'],
            'Jawa Barat'       => ['bandung','bekasi','depok','bogor','cimahi','tasikmalaya','cirebon','sukabumi','karawang','purwakarta','cianjur','garut','subang','indramayu','majalengka','sumedang','kuningan'],
            'Jawa Tengah'      => ['semarang','solo','surakarta','yogyakarta','magelang','salatiga','klaten','boyolali','kudus','jepara','demak','kendal','batang','pekalongan','tegal','brebes','purwokerto','cilacap','purworejo'],
            'DKI Jakarta'      => ['jakarta','tangerang','kepulauan seribu'],
            'Banten'           => ['serang','cilegon','pandeglang','lebak'],
            'Sumatera Utara'   => ['medan','binjai','tebing tinggi','pematangsiantar','sibolga','tanjungbalai','padangsidempuan','gunungsitoli','deli serdang','langkat'],
            'Sumatera Barat'   => ['padang','bukittinggi','payakumbuh','pariaman','sawahlunto','solok'],
            'Sumatera Selatan' => ['palembang','prabumulih','pagar alam','lubuklinggau'],
            'Riau'             => ['pekanbaru','dumai','bengkalis','siak','kampar'],
            'Kepulauan Riau'   => ['batam','tanjungpinang','bintan','karimun'],
            'Lampung'          => ['bandar lampung','metro','lampung'],
            'Kalimantan Timur' => ['samarinda','balikpapan','bontang','kutai'],
            'Kalimantan Selatan'=> ['banjarmasin','banjarbaru','martapura'],
            'Kalimantan Barat' => ['pontianak','singkawang'],
            'Sulawesi Selatan' => ['makassar','parepare','palopo','gowa','maros','bone'],
            'Sulawesi Utara'   => ['manado','bitung','tomohon','kotamobagu'],
            'Bali'             => ['denpasar','badung','gianyar','tabanan','singaraja','klungkung'],
            'Nusa Tenggara Barat' => ['mataram','bima','sumbawa','lombok'],
            'Papua'            => ['jayapura','sorong','manokwari','timika'],
            'Maluku'           => ['ambon','ternate','tidore'],
            'Aceh'             => ['banda aceh','lhokseumawe','langsa','sabang','aceh'],
            'Bengkulu'         => ['bengkulu'],
            'Jambi'            => ['jambi'],
            'Bangka Belitung'  => ['pangkalpinang','bangka','belitung'],
            'Gorontalo'        => ['gorontalo'],
            'Sulawesi Tengah'  => ['palu','poso','luwuk'],
            'Sulawesi Tenggara'=> ['kendari','baubau'],
            'Sulawesi Barat'   => ['mamuju'],
            'Nusa Tenggara Timur' => ['kupang','ende','flores','ntt'],
            'Kalimantan Tengah'=> ['palangkaraya','sampit'],
            'Kalimantan Utara' => ['tarakan','nunukan','tanjung selor'],
            'DI Yogyakarta'    => ['yogyakarta','sleman','bantul','kulonprogo','gunungkidul','jogja'],
        ];

        foreach ($mapping as $provinsi => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($asal, $keyword)) {
                    return $provinsi;
                }
            }
        }

        return 'Lainnya';
    }
}
```

---

## 7.7 AdminLombaController (CRUD Lengkap + Upload)

```php
// app/Http/Controllers/Api/Admin/AdminLombaController.php
class AdminLombaController extends Controller
{
    use ApiResponse;

    public function __construct(private FileUploadService $uploader) {}

    public function index(Request $request)
    {
        $query = Lomba::withCount([
            'pendaftaran as total_daftar',
            'pendaftaran as pending_count' => fn($q) => $q->where('status', 'pending'),
        ])
            ->when($request->status,   fn($q, $v) => $q->where('status', $v))
            ->when($request->kategori, fn($q, $v) => $q->where('kategori', $v))
            ->when($request->search,   fn($q, $v) => $q->where('nama', 'like', "%$v%"))
            ->latest();

        return $this->paginated($query->paginate(15));
    }

    public function show(int $id)
    {
        $lomba = Lomba::with(['mitra', 'faq', 'timelineLomba'])->findOrFail($id);
        return $this->success(new LombaDetailResource($lomba));
    }

    public function store(StoreLombaRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('banner')) {
            $data['banner_path'] = $this->uploader->upload(
                $request->file('banner'), 'lomba/banner'
            );
        }
        if ($request->hasFile('booklet')) {
            $data['booklet_path'] = $this->uploader->upload(
                $request->file('booklet'), 'lomba/booklet'
            );
        }

        $lomba = Lomba::create($data);

        // Sync mitra jika ada
        if ($request->has('mitra_ids')) {
            $lomba->mitra()->sync($request->mitra_ids);
        }

        // Simpan FAQ awal jika dikirim
        if ($request->has('faq')) {
            foreach ($request->faq as $i => $f) {
                FaqLomba::create([
                    'lomba_id'   => $lomba->id,
                    'pertanyaan' => $f['pertanyaan'],
                    'jawaban'    => $f['jawaban'],
                    'urutan'     => $i + 1,
                ]);
            }
        }

        // Simpan timeline per lomba jika dikirim
        if ($request->has('timeline')) {
            foreach ($request->timeline as $i => $t) {
                TimelineLomba::create([
                    'lomba_id'   => $lomba->id,
                    'stage'      => $t['stage'],
                    'tanggal'    => $t['tanggal'],
                    'keterangan' => $t['keterangan'] ?? null,
                    'urutan'     => $i + 1,
                ]);
            }
        }

        return $this->success(
            new LombaDetailResource($lomba->load(['mitra', 'faq', 'timelineLomba'])),
            'Lomba berhasil dibuat', 201
        );
    }

    /**
     * Update menggunakan POST (bukan PUT) karena multipart/form-data.
     * Frontend harus mengirim _method: 'PUT' atau gunakan POST langsung.
     */
    public function update(StoreLombaRequest $request, int $id)
    {
        $lomba = Lomba::findOrFail($id);
        $data  = $request->validated();

        if ($request->hasFile('banner')) {
            $this->uploader->delete($lomba->banner_path);
            $data['banner_path'] = $this->uploader->upload(
                $request->file('banner'), 'lomba/banner'
            );
        }

        if ($request->hasFile('booklet')) {
            $this->uploader->delete($lomba->booklet_path);
            $data['booklet_path'] = $this->uploader->upload(
                $request->file('booklet'), 'lomba/booklet'
            );
        }

        $lomba->update($data);

        if ($request->has('mitra_ids')) {
            $lomba->mitra()->sync($request->mitra_ids);
        }

        return $this->success(
            new LombaDetailResource($lomba->fresh()->load(['mitra', 'faq', 'timelineLomba'])),
            'Lomba berhasil diupdate'
        );
    }

    public function destroy(int $id)
    {
        $lomba = Lomba::findOrFail($id);

        if ($lomba->pendaftaran()->exists()) {
            return $this->error('Lomba tidak bisa dihapus karena sudah ada pendaftaran masuk', 422);
        }

        $this->uploader->delete($lomba->banner_path);
        $this->uploader->delete($lomba->booklet_path);
        $lomba->delete();

        return $this->success(null, 'Lomba berhasil dihapus');
    }

    public function toggleStatus(Request $request, int $id)
    {
        $request->validate(['status' => 'required|in:draft,buka,tutup']);
        $lomba = Lomba::findOrFail($id);
        $lomba->update(['status' => $request->status]);

        return $this->success(
            ['status' => $lomba->status],
            'Status lomba diupdate'
        );
    }

    // ── FAQ ──────────────────────────────────────────────────────

    public function storeFaq(Request $request, int $id)
    {
        $lomba = Lomba::findOrFail($id);
        $request->validate([
            'pertanyaan' => 'required|string',
            'jawaban'    => 'required|string',
            'urutan'     => 'nullable|integer',
        ]);

        $faq = FaqLomba::create([
            'lomba_id'   => $lomba->id,
            'pertanyaan' => $request->pertanyaan,
            'jawaban'    => $request->jawaban,
            'urutan'     => $request->urutan ?? ($lomba->faq()->max('urutan') + 1),
        ]);

        return $this->success($faq, 'FAQ berhasil ditambahkan', 201);
    }

    public function updateFaq(Request $request, int $id, int $faqId)
    {
        $faq = FaqLomba::where('lomba_id', $id)->findOrFail($faqId);
        $request->validate([
            'pertanyaan' => 'sometimes|string',
            'jawaban'    => 'sometimes|string',
            'urutan'     => 'nullable|integer',
        ]);
        $faq->update($request->only('pertanyaan', 'jawaban', 'urutan'));
        return $this->success($faq, 'FAQ berhasil diupdate');
    }

    public function destroyFaq(int $id, int $faqId)
    {
        FaqLomba::where('lomba_id', $id)->findOrFail($faqId)->delete();
        return $this->success(null, 'FAQ berhasil dihapus');
    }

    // ── Timeline per Lomba ───────────────────────────────────────

    public function storeTimeline(Request $request, int $id)
    {
        $lomba = Lomba::findOrFail($id);
        $request->validate([
            'stage'      => 'required|string|max:100',
            'tanggal'    => 'required|date',
            'keterangan' => 'nullable|string',
            'urutan'     => 'nullable|integer',
        ]);

        $tl = TimelineLomba::create([
            'lomba_id'   => $lomba->id,
            'stage'      => $request->stage,
            'tanggal'    => $request->tanggal,
            'keterangan' => $request->keterangan,
            'urutan'     => $request->urutan ?? ($lomba->timelineLomba()->max('urutan') + 1),
        ]);

        return $this->success($tl, 'Timeline berhasil ditambahkan', 201);
    }

    public function updateTimeline(Request $request, int $id, int $tlId)
    {
        $tl = TimelineLomba::where('lomba_id', $id)->findOrFail($tlId);
        $request->validate([
            'stage'      => 'sometimes|string|max:100',
            'tanggal'    => 'sometimes|date',
            'keterangan' => 'nullable|string',
            'urutan'     => 'nullable|integer',
        ]);
        $tl->update($request->only('stage', 'tanggal', 'keterangan', 'urutan'));
        return $this->success($tl, 'Timeline berhasil diupdate');
    }

    public function destroyTimeline(int $id, int $tlId)
    {
        TimelineLomba::where('lomba_id', $id)->findOrFail($tlId)->delete();
        return $this->success(null, 'Timeline berhasil dihapus');
    }
}
```

---

## 7.8 AdminRoadmapController (Season CRUD)

```php
// app/Http/Controllers/Api/Admin/AdminRoadmapController.php
class AdminRoadmapController extends Controller
{
    use ApiResponse;

    public function __construct(private FileUploadService $uploader) {}

    public function index()
    {
        $seasons = Season::with(['galeri', 'pemenang'])->orderBy('urutan')->get();
        return $this->success(SeasonResource::collection($seasons));
    }

    public function show(int $id)
    {
        $season = Season::with(['galeri', 'pemenang'])->findOrFail($id);
        return $this->success(new SeasonResource($season));
    }

    public function store(StoreSeasonRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('foto_utama')) {
            $data['foto_utama'] = $this->uploader->upload(
                $request->file('foto_utama'), 'season/foto_utama'
            );
        }

        $season = Season::create($data);

        // Simpan foto galeri awal jika ada (array file)
        if ($request->hasFile('galeri')) {
            foreach ($request->file('galeri') as $i => $foto) {
                $path = $this->uploader->upload($foto, "season/galeri/{$season->id}");
                GaleriSeason::create([
                    'season_id' => $season->id,
                    'path'      => $path,
                    'caption'   => $request->galeri_caption[$i] ?? null,
                    'urutan'    => $i + 1,
                ]);
            }
        }

        // Simpan pemenang awal jika ada
        if ($request->has('pemenang')) {
            foreach ($request->pemenang as $i => $p) {
                PemenangSeason::create([
                    'season_id' => $season->id,
                    'nama_lomba'=> $p['nama_lomba'],
                    'juara_1'   => $p['juara_1'],
                    'juara_2'   => $p['juara_2'] ?? null,
                    'juara_3'   => $p['juara_3'] ?? null,
                    'urutan'    => $i + 1,
                ]);
            }
        }

        return $this->success(
            new SeasonResource($season->load(['galeri', 'pemenang'])),
            'Season berhasil dibuat', 201
        );
    }

    public function update(StoreSeasonRequest $request, int $id)
    {
        $season = Season::findOrFail($id);
        $data   = $request->validated();

        if ($request->hasFile('foto_utama')) {
            $this->uploader->delete($season->foto_utama);
            $data['foto_utama'] = $this->uploader->upload(
                $request->file('foto_utama'), 'season/foto_utama'
            );
        }

        $season->update($data);

        return $this->success(
            new SeasonResource($season->fresh()->load(['galeri', 'pemenang'])),
            'Season berhasil diupdate'
        );
    }

    public function destroy(int $id)
    {
        $season = Season::with('galeri')->findOrFail($id);

        // Hapus semua foto galeri dari storage
        foreach ($season->galeri as $g) {
            $this->uploader->delete($g->path);
        }
        $this->uploader->delete($season->foto_utama);
        $season->delete();

        return $this->success(null, 'Season berhasil dihapus');
    }

    // ── Galeri ──────────────────────────────────────────────────

    public function addGaleri(Request $request, int $id)
    {
        $season = Season::findOrFail($id);
        $request->validate([
            'foto'    => 'required|array|min:1',
            'foto.*'  => 'file|mimes:jpg,jpeg,png,webp|max:3072',
            'caption' => 'nullable|array',
        ]);

        $added = [];
        foreach ($request->file('foto') as $i => $foto) {
            $path = $this->uploader->upload($foto, "season/galeri/{$season->id}");
            $g    = GaleriSeason::create([
                'season_id' => $season->id,
                'path'      => $path,
                'caption'   => $request->caption[$i] ?? null,
                'urutan'    => $season->galeri()->max('urutan') + $i + 1,
            ]);
            $added[] = ['id' => $g->id, 'url' => $g->url, 'caption' => $g->caption];
        }

        return $this->success($added, count($added) . ' foto berhasil ditambahkan', 201);
    }

    public function deleteGaleri(int $id, int $galeriId)
    {
        $galeri = GaleriSeason::where('season_id', $id)->findOrFail($galeriId);
        $this->uploader->delete($galeri->path);
        $galeri->delete();
        return $this->success(null, 'Foto galeri berhasil dihapus');
    }

    // ── Pemenang ────────────────────────────────────────────────

    public function storePemenang(Request $request, int $id)
    {
        $season = Season::findOrFail($id);
        $request->validate([
            'nama_lomba' => 'required|string|max:80',
            'juara_1'    => 'required|string|max:150',
            'juara_2'    => 'nullable|string|max:150',
            'juara_3'    => 'nullable|string|max:150',
            'urutan'     => 'nullable|integer',
        ]);

        $pemenang = PemenangSeason::create([
            'season_id'  => $season->id,
            'nama_lomba' => $request->nama_lomba,
            'juara_1'    => $request->juara_1,
            'juara_2'    => $request->juara_2,
            'juara_3'    => $request->juara_3,
            'urutan'     => $request->urutan ?? ($season->pemenang()->max('urutan') + 1),
        ]);

        return $this->success($pemenang, 'Data pemenang berhasil ditambahkan', 201);
    }

    public function updatePemenang(Request $request, int $id, int $pId)
    {
        $pemenang = PemenangSeason::where('season_id', $id)->findOrFail($pId);
        $request->validate([
            'nama_lomba' => 'sometimes|string|max:80',
            'juara_1'    => 'sometimes|string|max:150',
            'juara_2'    => 'nullable|string|max:150',
            'juara_3'    => 'nullable|string|max:150',
            'urutan'     => 'nullable|integer',
        ]);
        $pemenang->update($request->only('nama_lomba', 'juara_1', 'juara_2', 'juara_3', 'urutan'));
        return $this->success($pemenang, 'Data pemenang berhasil diupdate');
    }

    public function destroyPemenang(int $id, int $pId)
    {
        PemenangSeason::where('season_id', $id)->findOrFail($pId)->delete();
        return $this->success(null, 'Data pemenang berhasil dihapus');
    }
}
```

---

## 7.9 AdminPengumumanController + Broadcast Email

```php
// app/Http/Controllers/Api/Admin/AdminPengumumanController.php
class AdminPengumumanController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Pengumuman::with(['lomba', 'createdBy'])
            ->when($request->target,   fn($q, $v) => $q->where('target', $v))
            ->when($request->lomba_id, fn($q, $v) => $q->where('lomba_id', $v))
            ->when($request->search,   fn($q, $v) => $q->where('judul', 'like', "%$v%"))
            ->latest();

        return $this->paginated($query->paginate(15));
    }

    public function show(int $id)
    {
        $p = Pengumuman::with(['lomba', 'createdBy'])->findOrFail($id);
        return $this->success($p);
    }

    public function store(StorePengumumanRequest $request)
    {
        $pengumuman = Pengumuman::create([
            'judul'       => $request->judul,
            'isi'         => $request->isi,
            'target'      => $request->target,
            'lomba_id'    => $request->target === 'per_lomba' ? $request->lomba_id : null,
            'publish_at'  => $request->publish_at ?? null,
            'kirim_email' => $request->boolean('kirim_email'),
            'created_by'  => $request->user()->id,
        ]);

        // Jika jadwal sudah lewat atau tidak ada, publish & broadcast sekarang
        if ($request->boolean('kirim_email') && $pengumuman->isPublished()) {
            SendPengumumanEmail::dispatch($pengumuman);
        }

        // Buat notifikasi in-app untuk semua peserta yang relevan
        $this->broadcastNotifikasi($pengumuman);

        return $this->success($pengumuman->load('lomba'), 'Pengumuman berhasil dibuat', 201);
    }

    public function update(StorePengumumanRequest $request, int $id)
    {
        $pengumuman = Pengumuman::findOrFail($id);

        if ($pengumuman->email_sent) {
            return $this->error('Pengumuman yang sudah dikirim email tidak bisa diedit', 422);
        }

        $pengumuman->update([
            'judul'       => $request->judul,
            'isi'         => $request->isi,
            'target'      => $request->target,
            'lomba_id'    => $request->target === 'per_lomba' ? $request->lomba_id : null,
            'publish_at'  => $request->publish_at ?? null,
            'kirim_email' => $request->boolean('kirim_email'),
        ]);

        return $this->success($pengumuman->fresh()->load('lomba'), 'Pengumuman berhasil diupdate');
    }

    public function destroy(int $id)
    {
        $pengumuman = Pengumuman::findOrFail($id);
        $pengumuman->delete();
        return $this->success(null, 'Pengumuman berhasil dihapus');
    }

    /**
     * Manual trigger: kirim email blast sekarang untuk pengumuman ini.
     */
    public function kirimEmail(int $id)
    {
        $pengumuman = Pengumuman::findOrFail($id);

        if ($pengumuman->email_sent) {
            return $this->error('Email untuk pengumuman ini sudah pernah dikirim', 422);
        }

        if (!$pengumuman->isPublished()) {
            return $this->error('Pengumuman belum dipublikasikan (publish_at belum tercapai)', 422);
        }

        SendPengumumanEmail::dispatch($pengumuman);

        return $this->success(null, 'Email sedang diproses dan akan dikirim ke semua peserta');
    }

    /**
     * Broadcast notifikasi in-app ke semua peserta yang relevan.
     */
    private function broadcastNotifikasi(Pengumuman $pengumuman): void
    {
        $query = User::where('role', 'peserta');

        if ($pengumuman->target === 'per_lomba') {
            $query->whereHas('pendaftaran', fn($q) =>
                $q->where('lomba_id', $pengumuman->lomba_id)
                  ->where('status', 'diverifikasi')
            );
        }

        $users = $query->pluck('id');

        $notifikasi = $users->map(fn($uid) => [
            'user_id'      => $uid,
            'judul'        => '[Pengumuman] ' . $pengumuman->judul,
            'pesan'        => strip_tags($pengumuman->isi),
            'tipe'         => 'info',
            'related_type' => 'pengumuman',
            'related_id'   => $pengumuman->id,
            'created_at'   => now(),
            'updated_at'   => now(),
        ])->toArray();

        // Batch insert untuk efisiensi
        foreach (array_chunk($notifikasi, 500) as $chunk) {
            Notifikasi::insert($chunk);
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// PengumumanController (Public/Peserta)
// ─────────────────────────────────────────────────────────────────────────────

// app/Http/Controllers/Api/PengumumanController.php
class PengumumanController extends Controller
{
    use ApiResponse;

    public function indexPeserta(Request $request)
    {
        $user = $request->user();

        // Ambil semua pengumuman yang relevan untuk peserta ini
        $lombaIds = $user->pendaftaran()
            ->where('status', 'diverifikasi')
            ->pluck('lomba_id');

        $query = Pengumuman::where(function ($q) use ($lombaIds) {
            $q->where('target', 'semua')
              ->orWhere(fn($sub) =>
                $sub->where('target', 'per_lomba')
                    ->whereIn('lomba_id', $lombaIds)
              );
        })
        ->where(fn($q) =>
            $q->whereNull('publish_at')->orWhere('publish_at', '<=', now())
        )
        ->with('lomba')
        ->latest();

        return $this->paginated($query->paginate(10));
    }

    public function showPeserta(Request $request, int $id)
    {
        $user  = $request->user();
        $lombaIds = $user->pendaftaran()->where('status', 'diverifikasi')->pluck('lomba_id');

        $pengumuman = Pengumuman::where(function ($q) use ($lombaIds) {
            $q->where('target', 'semua')
              ->orWhere(fn($sub) =>
                $sub->where('target', 'per_lomba')->whereIn('lomba_id', $lombaIds)
              );
        })
        ->where(fn($q) => $q->whereNull('publish_at')->orWhere('publish_at', '<=', now()))
        ->findOrFail($id);

        return $this->success($pengumuman->load('lomba'));
    }
}
```

---

## 7.10 AdminConfigController

```php
// app/Http/Controllers/Api/Admin/AdminConfigController.php
class AdminConfigController extends Controller
{
    use ApiResponse;

    /**
     * Daftar key yang boleh diakses/diubah via API.
     * Key di luar whitelist ini tidak bisa diubah.
     */
    private array $allowedKeys = [
        'booklet_url',
        'wa_humas',
        'ig_handle',
        'email_kontak',
        'pendaftaran_open',
        'pengumuman_banner',
        'hero_tagline',
        'hero_subtagline',
        'hero_bg_url',
        'sponsor_text',
    ];

    public function index()
    {
        $configs = ConfigModel::whereIn('key', $this->allowedKeys)
            ->orderBy('key')
            ->get(['key', 'value', 'keterangan', 'updated_at']);

        return $this->success($configs);
    }

    public function update(Request $request, string $key)
    {
        if (!in_array($key, $this->allowedKeys)) {
            return $this->error('Config key tidak diizinkan untuk diubah', 403);
        }

        $request->validate([
            'value'     => 'nullable|string|max:1000',
            'keterangan'=> 'nullable|string|max:255',
        ]);

        ConfigModel::updateOrCreate(
            ['key' => $key],
            [
                'value'      => $request->value,
                'keterangan' => $request->keterangan,
                'updated_at' => now(),
            ]
        );

        return $this->success(
            ConfigModel::find($key),
            "Config '{$key}' berhasil diupdate"
        );
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// ConfigController (Public — single key)
// ─────────────────────────────────────────────────────────────────────────────

// app/Http/Controllers/Api/ConfigController.php
class ConfigController extends Controller
{
    use ApiResponse;

    private array $publicKeys = [
        'booklet_url',
        'wa_humas',
        'ig_handle',
        'email_kontak',
        'pendaftaran_open',
        'hero_tagline',
        'hero_subtagline',
        'sponsor_text',
    ];

    public function show(string $key)
    {
        if (!in_array($key, $this->publicKeys)) {
            return $this->error('Config tidak tersedia', 404);
        }

        $config = ConfigModel::find($key);
        return $this->success([
            'key'   => $key,
            'value' => $config?->value ?? null,
        ]);
    }
}
```

---

## 7.11 AdminTimelineController

```php
// app/Http/Controllers/Api/Admin/AdminTimelineController.php
class AdminTimelineController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $timeline = Timeline::orderBy('urutan')->get();
        return $this->success(TimelineResource::collection($timeline));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama'       => 'required|string|max:100',
            'tanggal'    => 'required|date',
            'waktu'      => 'nullable|date_format:H:i',
            'keterangan' => 'nullable|string',
            'urutan'     => 'nullable|integer',
        ]);

        $tl = Timeline::create([
            'nama'       => $request->nama,
            'tanggal'    => $request->tanggal,
            'waktu'      => $request->waktu,
            'keterangan' => $request->keterangan,
            'is_active'  => false,
            'urutan'     => $request->urutan ?? (Timeline::max('urutan') + 1),
        ]);

        return $this->success(new TimelineResource($tl), 'Timeline berhasil ditambahkan', 201);
    }

    public function update(Request $request, int $id)
    {
        $tl = Timeline::findOrFail($id);
        $request->validate([
            'nama'       => 'sometimes|string|max:100',
            'tanggal'    => 'sometimes|date',
            'waktu'      => 'nullable|date_format:H:i',
            'keterangan' => 'nullable|string',
            'urutan'     => 'nullable|integer',
        ]);
        $tl->update($request->only('nama', 'tanggal', 'waktu', 'keterangan', 'urutan'));
        return $this->success(new TimelineResource($tl), 'Timeline berhasil diupdate');
    }

    public function destroy(int $id)
    {
        Timeline::findOrFail($id)->delete();
        return $this->success(null, 'Timeline berhasil dihapus');
    }

    /**
     * Set satu item sebagai aktif (highlight), nonaktifkan yang lain.
     */
    public function setAktif(int $id)
    {
        Timeline::query()->update(['is_active' => false]);
        Timeline::findOrFail($id)->update(['is_active' => true]);
        return $this->success(null, 'Stage aktif berhasil diupdate');
    }

    /**
     * Reorder: terima array [{id, urutan}] dan update sekaligus.
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'items'         => 'required|array',
            'items.*.id'    => 'required|exists:timeline,id',
            'items.*.urutan'=> 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($request) {
            foreach ($request->items as $item) {
                Timeline::where('id', $item['id'])->update(['urutan' => $item['urutan']]);
            }
        });

        return $this->success(null, 'Urutan timeline berhasil disimpan');
    }
}
```

---

## 7.12 NotifikasiController

```php
// app/Http/Controllers/Api/NotifikasiController.php
class NotifikasiController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $user = $request->user();

        $query = $user->notifikasi()
            ->when($request->unread_only, fn($q) => $q->where('is_read', false))
            ->latest();

        $paginated   = $query->paginate(20);
        $unreadCount = $user->notifikasi()->where('is_read', false)->count();

        return response()->json([
            'success'      => true,
            'message'      => 'Berhasil',
            'data'         => NotifikasiResource::collection($paginated->items()),
            'unread_count' => $unreadCount,
            'meta'         => [
                'current_page' => $paginated->currentPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
                'last_page'    => $paginated->lastPage(),
            ],
        ]);
    }

    public function markRead(Request $request, int $id)
    {
        $notif = $request->user()->notifikasi()->findOrFail($id);
        $notif->update(['is_read' => true]);
        return $this->success(null, 'Notifikasi ditandai sudah dibaca');
    }

    public function markAllRead(Request $request)
    {
        $request->user()->notifikasi()->where('is_read', false)->update(['is_read' => true]);
        return $this->success(null, 'Semua notifikasi ditandai sudah dibaca');
    }
}
```

---

# 8. FORM REQUEST VALIDATION

```php
// app/Http/Requests/RegisterRequest.php
class RegisterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'nama'     => 'required|string|min:3|max:100',
            'email'    => 'required|email|unique:users,email',
            'password' => ['required', 'min:8', 'confirmed', Password::min(8)->letters()->numbers()],
            'kategori' => 'required|in:siswa,mahasiswa',
        ];
    }

    public function messages(): array
    {
        return [
            'nama.required'     => 'Nama lengkap wajib diisi.',
            'email.unique'      => 'Email sudah terdaftar.',
            'password.min'      => 'Password minimal 8 karakter.',
            'password.confirmed'=> 'Konfirmasi password tidak cocok.',
            'kategori.required' => 'Pilih kategori peserta.',
        ];
    }
}

// app/Http/Requests/LoginRequest.php
class LoginRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'email'    => 'required|email',
            'password' => 'required|string',
            'remember' => 'boolean',
        ];
    }
}

// app/Http/Requests/ForgotPasswordRequest.php
class ForgotPasswordRequest extends FormRequest
{
    public function rules(): array
    {
        return ['email' => 'required|email'];
    }
}

// app/Http/Requests/ResetPasswordRequest.php
class ResetPasswordRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'token'                 => 'required|string',
            'email'                 => 'required|email',
            'password'              => ['required', 'min:8', 'confirmed', Password::min(8)->letters()->numbers()],
            'password_confirmation' => 'required',
        ];
    }
}

// app/Http/Requests/StorePendaftaranRequest.php
class StorePendaftaranRequest extends FormRequest
{
    public function rules(): array
    {
        $rules = [
            'lomba_id'       => 'required|exists:lomba,id',
            'no_wa'          => ['required', 'regex:/^(\+62|62|0)8[0-9]{8,11}$/'],
            'email'          => 'required|email',
            'tema'           => 'required|string|max:100',
            'bukti_transfer' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'bukti_sosmed'   => 'required|file|mimes:jpg,jpeg,png|max:2048',
        ];

        $lomba = Lomba::find($this->lomba_id);
        if ($lomba) {
            if (in_array($lomba->slug, ['web-development'])) {
                $rules['asal_sekolah']     = 'required|string|min:3|max:150';
                $rules['nama_peserta_1']   = 'required|string|min:3|max:100';
                $rules['nama_peserta_2']   = 'required|string|min:3|max:100';
                $rules['nama_pendamping']  = 'required|string|min:3|max:100';
            } elseif (in_array($lomba->slug, ['desain-poster', 'desain-infografis'])) {
                $rules['asal_sekolah']     = 'required|string|min:3|max:150';
                $rules['nama_peserta_1']   = 'required|string|min:3|max:100';
            } elseif ($lomba->slug === 'ctf') {
                $rules['asal_universitas'] = 'required|string|min:3|max:150';
                $rules['nama_peserta_1']   = 'required|string|min:3|max:100';
                $rules['nama_peserta_2']   = 'nullable|string|max:100';
                $rules['nama_peserta_3']   = 'nullable|string|max:100';
            }
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'no_wa.regex'           => 'Format nomor WhatsApp tidak valid. Gunakan format 08xx atau +628xx.',
            'bukti_transfer.mimes'  => 'File bukti transfer harus berformat JPG, PNG, atau PDF.',
            'bukti_sosmed.mimes'    => 'File bukti sosmed harus berformat JPG atau PNG.',
            'bukti_transfer.max'    => 'Ukuran file bukti transfer maksimal 2MB.',
        ];
    }

    public function getData(): array
    {
        return $this->only([
            'nama_peserta_1', 'nama_peserta_2', 'nama_peserta_3',
            'nama_pendamping', 'asal_sekolah', 'asal_universitas',
            'no_wa', 'email', 'tema'
        ]);
    }
}

// app/Http/Requests/VerifikasiRequest.php
class VerifikasiRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'action'  => 'required|in:terima,tolak',
            'catatan' => 'required_if:action,tolak|nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'catatan.required_if' => 'Catatan alasan wajib diisi saat menolak pendaftaran.',
        ];
    }
}

// app/Http/Requests/StoreLombaRequest.php
class StoreLombaRequest extends FormRequest
{
    public function rules(): array
    {
        $id      = $this->route('id');
        $slugRule = $id
            ? "nullable|string|max:100|unique:lomba,slug,{$id}"
            : 'nullable|string|max:100|unique:lomba,slug';

        return [
            'nama'        => 'required|string|max:80',
            'slug'        => $slugRule,
            'kategori'    => 'required|in:siswa,mahasiswa',
            'deskripsi'   => 'nullable|string',
            'persyaratan' => 'nullable|string',
            'ketentuan'   => 'nullable|string',
            'hadiah_1'    => 'nullable|string|max:255',
            'hadiah_2'    => 'nullable|string|max:255',
            'hadiah_3'    => 'nullable|string|max:255',
            'benefit'     => 'nullable|string',
            'deadline'    => 'required|date|after:today',
            'kuota'       => 'required|integer|min:0',
            'status'      => 'required|in:draft,buka,tutup',
            'banner'      => 'nullable|file|mimes:jpg,jpeg,png,webp|max:3072',
            'booklet'     => 'nullable|file|mimes:pdf|max:10240',
            'mitra_ids'   => 'nullable|array',
            'mitra_ids.*' => 'exists:mitra,id',
        ];
    }
}

// app/Http/Requests/StoreSeasonRequest.php
class StoreSeasonRequest extends FormRequest
{
    public function rules(): array
    {
        $id       = $this->route('id');
        $slugRule = $id
            ? "nullable|string|max:60|unique:season,slug,{$id}"
            : 'nullable|string|max:60|unique:season,slug';

        return [
            'nama'        => 'required|string|max:50',
            'slug'        => $slugRule,
            'tema'        => 'required|string|max:100',
            'tahun'       => 'required|integer|min:2020|max:2099',
            'deskripsi'   => 'nullable|string',
            'cerita'      => 'nullable|string',
            'foto_utama'  => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120',
            'video_url'   => 'nullable|url|max:255',
            'jml_peserta' => 'nullable|integer|min:0',
            'jml_lomba'   => 'nullable|integer|min:0',
            'jml_mitra'   => 'nullable|integer|min:0',
            'urutan'      => 'nullable|integer|min:0',
            'galeri'      => 'nullable|array',
            'galeri.*'    => 'file|mimes:jpg,jpeg,png,webp|max:3072',
            'galeri_caption'   => 'nullable|array',
            'galeri_caption.*' => 'nullable|string|max:255',
        ];
    }
}

// app/Http/Requests/StorePengumumanRequest.php
class StorePengumumanRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'judul'       => 'required|string|max:255',
            'isi'         => 'required|string',
            'target'      => 'required|in:semua,per_lomba',
            'lomba_id'    => 'required_if:target,per_lomba|nullable|exists:lomba,id',
            'publish_at'  => 'nullable|date|after:now',
            'kirim_email' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'lomba_id.required_if' => 'Pilih lomba tujuan jika target adalah per lomba.',
            'publish_at.after'     => 'Waktu publish harus di masa depan.',
        ];
    }
}
```

---

# 9. FILE STORAGE

## 9.1 FileUploadService

```php
// app/Services/FileUploadService.php
class FileUploadService
{
    public function upload(UploadedFile $file, string $folder, string $disk = 'public'): string
    {
        $ext      = $file->getClientOriginalExtension();
        $filename = time() . '_' . Str::random(8) . '.' . $ext;
        return $file->storeAs($folder, $filename, $disk);
    }

    public function delete(?string $path, string $disk = 'public'): void
    {
        if ($path && Storage::disk($disk)->exists($path)) {
            Storage::disk($disk)->delete($path);
        }
    }

    public function url(string $path, string $disk = 'public'): string
    {
        return Storage::disk($disk)->url($path);
    }
}
```

## 9.2 Struktur Folder Storage

```
storage/app/public/
├── berkas/
│   └── {pendaftaran_id}/
│       ├── transfer_1234567890_abcd1234.jpg
│       └── sosmed_1234567890_efgh5678.png
├── lomba/
│   ├── banner/
│   └── booklet/
├── mitra/
│   └── logo/
└── season/
    ├── foto_utama/
    └── galeri/
        └── {season_id}/
```

## 9.3 Setup

```bash
php artisan storage:link
# Pastikan APP_URL di .env benar agar URL file terbentuk dengan tepat
```

---

# 10. EMAIL NOTIFICATIONS

## 10.1 Daftar Email

| Event | Kelas Mailable | Penerima |
|-------|---------------|---------|
| Register | WelcomeEmail | Peserta |
| Pendaftaran dikirim | PendaftaranKonfirmasiEmail | Peserta |
| Pendaftaran diverifikasi | PendaftaranDiverifikasiEmail | Peserta |
| Pendaftaran ditolak | PendaftaranDitolakEmail | Peserta |
| Reset password | Bawaan Laravel | User |
| Pengumuman blast | PengumumanEmail | Peserta relevan |

## 10.2 Mailable Classes

```php
// app/Mail/PendaftaranDiverifikasiEmail.php
class PendaftaranDiverifikasiEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Pendaftaran $pendaftaran) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: '[OSCAR 3.0] Pendaftaran Anda Telah Diverifikasi!');
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.pendaftaran.diverifikasi',
            with: [
                'pendaftaran' => $this->pendaftaran,
                'lomba'       => $this->pendaftaran->lomba,
                'user'        => $this->pendaftaran->user,
            ]
        );
    }
}

// app/Mail/PendaftaranDitolakEmail.php
class PendaftaranDitolakEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Pendaftaran $pendaftaran) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: '[OSCAR 3.0] Update Status Pendaftaran Anda');
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.pendaftaran.ditolak',
            with: [
                'pendaftaran' => $this->pendaftaran,
                'lomba'       => $this->pendaftaran->lomba,
                'user'        => $this->pendaftaran->user,
                'catatan'     => $this->pendaftaran->catatan_admin,
            ]
        );
    }
}

// app/Mail/PengumumanEmail.php
class PengumumanEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Pengumuman $pengumuman,
        public User $user
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: '[OSCAR 3.0] ' . $this->pengumuman->judul);
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.pengumuman.broadcast',
            with: [
                'pengumuman' => $this->pengumuman,
                'user'       => $this->user,
            ]
        );
    }
}
```

## 10.3 Email Templates (Blade)

```blade
{{-- resources/views/emails/pendaftaran/diverifikasi.blade.php --}}
<x-mail::message>
# Selamat, Pendaftaran Anda Diterima! 🎉

Halo **{{ $user->nama }}**,

Pendaftaran Anda untuk lomba **{{ $lomba->nama }}** pada **OSCAR 3.0 — Season Rainforest** telah **diverifikasi**.

**Detail Pendaftaran:**

| Field | Info |
|-------|------|
| Nomor | {{ $pendaftaran->nomor }} |
| Lomba | {{ $lomba->nama }} |
| Status | ✅ Diverifikasi |
| Tanggal | {{ $pendaftaran->verified_at->format('d M Y H:i') }} |

Pantau informasi selanjutnya melalui dashboard Anda.

<x-mail::button :url="config('app.frontend_url') . '/status'">
Lihat Dashboard
</x-mail::button>

Sampai jumpa di OSCAR 3.0!

Salam,
Tim OSCAR 3.0
</x-mail::message>
```

```blade
{{-- resources/views/emails/pendaftaran/ditolak.blade.php --}}
<x-mail::message>
# Update Status Pendaftaran

Halo **{{ $user->nama }}**,

Mohon maaf, pendaftaran Anda untuk lomba **{{ $lomba->nama }}** belum dapat kami terima saat ini.

**Nomor Pendaftaran:** {{ $pendaftaran->nomor }}

**Alasan:**
{{ $catatan }}

Anda dapat mengunggah ulang berkas yang diperlukan dan mengirimkan revisi melalui dashboard.

<x-mail::button :url="config('app.frontend_url') . '/status'">
Kirim Revisi
</x-mail::button>

Jika ada pertanyaan, hubungi kami melalui WhatsApp atau Instagram.

Salam,
Tim OSCAR 3.0
</x-mail::message>
```

```blade
{{-- resources/views/emails/pengumuman/broadcast.blade.php --}}
<x-mail::message>
# {{ $pengumuman->judul }}

Halo **{{ $user->nama }}**,

{!! nl2br(e($pengumuman->isi)) !!}

<x-mail::button :url="config('app.frontend_url') . '/pengumuman'">
Lihat Selengkapnya
</x-mail::button>

Salam,
Tim OSCAR 3.0
</x-mail::message>
```

---

# 11. QUEUE & JOBS

## 11.1 Setup

```bash
# Buat tabel queue
php artisan queue:table
php artisan migrate

# .env
QUEUE_CONNECTION=database
```

## 11.2 SendPengumumanEmail Job

```php
// app/Jobs/SendPengumumanEmail.php
class SendPengumumanEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries   = 3;
    public int $timeout = 120;

    public function __construct(public Pengumuman $pengumuman) {}

    public function handle(): void
    {
        $query = User::where('role', 'peserta');

        if ($this->pengumuman->target === 'per_lomba') {
            $query->whereHas('pendaftaran', fn($q) =>
                $q->where('lomba_id', $this->pengumuman->lomba_id)
                  ->where('status', 'diverifikasi')
            );
        }

        $query->chunk(100, function ($users) {
            foreach ($users as $user) {
                Mail::to($user->email)
                    ->queue(new PengumumanEmail($this->pengumuman, $user));
            }
        });

        $this->pengumuman->update(['email_sent' => true]);
    }

    public function failed(\Throwable $exception): void
    {
        // Log kegagalan — jangan tandai email_sent = true
        \Log::error("SendPengumumanEmail gagal: " . $exception->getMessage(), [
            'pengumuman_id' => $this->pengumuman->id,
        ]);
    }
}
```

## 11.3 Supervisor Config (Production)

```ini
; /etc/supervisor/conf.d/oscar-worker.conf
[program:oscar-queue]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/oscar/artisan queue:work database --queue=emails,default --tries=3 --sleep=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/oscar/storage/logs/worker.log
stopwaitsecs=3600
```

---

# 12. MIDDLEWARE & ROLE AUTHORIZATION

## 12.1 RoleMiddleware

```php
// app/Http/Middleware/RoleMiddleware.php
class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user() || $request->user()->role !== $role) {
            return response()->json([
                'success' => false,
                'message' => 'Akses tidak diizinkan',
            ], 403);
        }
        return $next($request);
    }
}

// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias(['role' => RoleMiddleware::class]);
})
```

## 12.2 CORS

```php
// config/cors.php
return [
    'paths'                => ['api/*'],
    'allowed_methods'      => ['*'],
    'allowed_origins'      => [env('FRONTEND_URL', 'http://localhost:5173')],
    'allowed_headers'      => ['*'],
    'exposed_headers'      => [],
    'max_age'              => 0,
    'supports_credentials' => true,
];
```

## 12.3 Exception Handler (Global JSON Error)

```php
// app/Exceptions/Handler.php
public function render($request, Throwable $e)
{
    if ($request->expectsJson()) {
        return match(true) {
            $e instanceof ModelNotFoundException
                => response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404),
            $e instanceof AuthenticationException
                => response()->json(['success' => false, 'message' => 'Tidak terautentikasi'], 401),
            $e instanceof AuthorizationException
                => response()->json(['success' => false, 'message' => 'Akses tidak diizinkan'], 403),
            $e instanceof ValidationException
                => response()->json(['success' => false, 'message' => 'Data tidak valid', 'errors' => $e->errors()], 422),
            $e instanceof ThrottleRequestsException
                => response()->json(['success' => false, 'message' => 'Terlalu banyak permintaan. Coba lagi nanti.'], 429),
            default
                => response()->json(['success' => false, 'message' => app()->isProduction() ? 'Terjadi kesalahan server' : $e->getMessage()], 500),
        };
    }
    return parent::render($request, $e);
}
```

---

# 13. API RESOURCES

```php
// app/Http/Resources/LombaResource.php
class LombaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'nama'        => $this->nama,
            'slug'        => $this->slug,
            'kategori'    => $this->kategori,
            'deskripsi'   => $this->deskripsi,
            'persyaratan' => $this->persyaratan,
            'ketentuan'   => $this->ketentuan,
            'hadiah_1'    => $this->hadiah_1,
            'hadiah_2'    => $this->hadiah_2,
            'hadiah_3'    => $this->hadiah_3,
            'benefit'     => $this->benefit,
            'deadline'    => $this->deadline?->toISOString(),
            'kuota'       => $this->kuota,
            'terdaftar'   => $this->terdaftar,
            'status'      => $this->status,
            'booklet_url' => $this->booklet_url,
            'banner_url'  => $this->banner_url,
            'mitra'       => MitraResource::collection($this->whenLoaded('mitra')),
        ];
    }
}

// app/Http/Resources/LombaDetailResource.php
class LombaDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return array_merge((new LombaResource($this->resource))->toArray($request), [
            'faq'      => FaqResource::collection($this->whenLoaded('faq')),
            'timeline' => TimelineLombaResource::collection($this->whenLoaded('timelineLomba')),
        ]);
    }
}

// app/Http/Resources/PendaftaranResource.php
class PendaftaranResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'nomor'         => $this->nomor,
            'lomba'         => new LombaResource($this->whenLoaded('lomba')),
            'status'        => $this->status,
            'catatan_admin' => $this->catatan_admin,
            'data_peserta'  => $this->data_peserta,
            'berkas'        => [
                'transfer' => $this->berkasTransfer()
                    ? Storage::url($this->berkasTransfer()->path) : null,
                'sosmed'   => $this->berkasSosmed()
                    ? Storage::url($this->berkasSosmed()->path) : null,
            ],
            'status_history'=> StatusHistoryResource::collection($this->whenLoaded('statusHistory')),
            'submitted_at'  => $this->submitted_at?->toISOString(),
            'verified_at'   => $this->verified_at?->toISOString(),
            'created_at'    => $this->created_at?->toISOString(),
        ];
    }
}

// app/Http/Resources/AdminPendaftaranDetailResource.php
class AdminPendaftaranDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'nomor'         => $this->nomor,
            'user'          => new UserResource($this->whenLoaded('user')),
            'lomba'         => new LombaResource($this->whenLoaded('lomba')),
            'status'        => $this->status,
            'catatan_admin' => $this->catatan_admin,
            'data_peserta'  => $this->data_peserta,
            'berkas'        => BerkasResource::collection($this->whenLoaded('berkas')),
            'status_history'=> StatusHistoryResource::collection($this->whenLoaded('statusHistory')),
            'verified_by'   => new UserResource($this->whenLoaded('verifiedBy')),
            'submitted_at'  => $this->submitted_at?->toISOString(),
            'verified_at'   => $this->verified_at?->toISOString(),
            'created_at'    => $this->created_at?->toISOString(),
        ];
    }
}

// app/Http/Resources/UserResource.php
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'nama'           => $this->nama,
            'email'          => $this->email,
            'role'           => $this->role,
            'kategori'       => $this->kategori,
            'unread_notif'   => $this->when(
                $request->routeIs('auth.me'),
                fn() => $this->unreadNotifCount()
            ),
        ];
    }
}

// app/Http/Resources/SeasonResource.php
class SeasonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'nama'          => $this->nama,
            'slug'          => $this->slug,
            'tema'          => $this->tema,
            'tahun'         => $this->tahun,
            'deskripsi'     => $this->deskripsi,
            'cerita'        => $this->cerita,
            'foto_utama_url'=> $this->foto_utama_url,
            'video_url'     => $this->video_url,
            'jml_peserta'   => $this->jml_peserta,
            'jml_lomba'     => $this->jml_lomba,
            'jml_mitra'     => $this->jml_mitra,
            'galeri'        => GaleriResource::collection($this->whenLoaded('galeri')),
            'pemenang'      => PemenangResource::collection($this->whenLoaded('pemenang')),
        ];
    }
}

// app/Http/Resources/NotifikasiResource.php
class NotifikasiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'judul'        => $this->judul,
            'pesan'        => $this->pesan,
            'tipe'         => $this->tipe,
            'is_read'      => $this->is_read,
            'related_type' => $this->related_type,
            'related_id'   => $this->related_id,
            'created_at'   => $this->created_at?->toISOString(),
        ];
    }
}

// app/Http/Resources/StatusHistoryResource.php
class StatusHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'status'     => $this->status,
            'keterangan' => $this->keterangan,
            'changed_by' => $this->changedBy?->nama ?? 'Sistem',
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}

// app/Http/Resources/TimelineResource.php
class TimelineResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'nama'       => $this->nama,
            'tanggal'    => $this->tanggal?->format('Y-m-d'),
            'waktu'      => $this->waktu,
            'keterangan' => $this->keterangan,
            'is_active'  => $this->is_active,
            'urutan'     => $this->urutan,
        ];
    }
}

// app/Http/Resources/MitraResource.php
class MitraResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'nama'        => $this->nama,
            'logo_url'    => $this->logo_url,
            'website_url' => $this->website_url,
            'urutan'      => $this->urutan,
        ];
    }
}
```

---

# 14. SEEDERS & FACTORIES

## 14.1 DatabaseSeeder

```php
public function run(): void
{
    $this->call([
        AdminSeeder::class,
        MitraSeeder::class,
        LombaSeeder::class,
        TimelineSeeder::class,
        SeasonSeeder::class,
        ConfigSeeder::class,
    ]);

    if (app()->isLocal()) {
        $this->call([UserSeeder::class, PendaftaranSeeder::class]);
    }
}
```

## 14.2 AdminSeeder

```php
class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(['email' => 'admin@oscar.id'], [
            'nama'     => 'Admin OSCAR',
            'password' => bcrypt(env('ADMIN_PASSWORD', 'Admin@oscar3')),
            'role'     => 'admin',
            'kategori' => null,
        ]);
    }
}
```

## 14.3 LombaSeeder

```php
class LombaSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['nama'=>'Web Development',    'slug'=>'web-development',    'kategori'=>'siswa',      'kuota'=>50,  'hadiah_1'=>'Rp 1.500.000 + Piala + Sertifikat', 'hadiah_2'=>'Rp 1.000.000 + Sertifikat', 'hadiah_3'=>'Rp 750.000 + Sertifikat'],
            ['nama'=>'Desain Poster',      'slug'=>'desain-poster',      'kategori'=>'siswa',      'kuota'=>100, 'hadiah_1'=>'Rp 1.000.000 + Piala + Sertifikat', 'hadiah_2'=>'Rp 750.000 + Sertifikat',   'hadiah_3'=>'Rp 500.000 + Sertifikat'],
            ['nama'=>'Desain Infografis',  'slug'=>'desain-infografis',  'kategori'=>'siswa',      'kuota'=>100, 'hadiah_1'=>'Rp 1.000.000 + Piala + Sertifikat', 'hadiah_2'=>'Rp 750.000 + Sertifikat',   'hadiah_3'=>'Rp 500.000 + Sertifikat'],
            ['nama'=>'Capture The Flag',   'slug'=>'ctf',                'kategori'=>'mahasiswa',  'kuota'=>30,  'hadiah_1'=>'Rp 2.000.000 + Piala + Sertifikat', 'hadiah_2'=>'Rp 1.500.000 + Sertifikat', 'hadiah_3'=>'Rp 1.000.000 + Sertifikat'],
        ];

        foreach ($items as $item) {
            Lomba::updateOrCreate(['slug' => $item['slug']], array_merge($item, [
                'status'   => 'buka',
                'deadline' => now()->addDays(45),
            ]));
        }
    }
}
```

## 14.4 TimelineSeeder

```php
class TimelineSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['nama'=>'Pendaftaran Dibuka',    'tanggal'=>'2026-05-01', 'urutan'=>1, 'is_active'=>false],
            ['nama'=>'Batas Pendaftaran',     'tanggal'=>'2026-06-30', 'urutan'=>2, 'is_active'=>true],
            ['nama'=>'Verifikasi Berkas',     'tanggal'=>'2026-07-05', 'urutan'=>3, 'is_active'=>false],
            ['nama'=>'Pengumuman Peserta',    'tanggal'=>'2026-07-10', 'urutan'=>4, 'is_active'=>false],
            ['nama'=>'Pelaksanaan Lomba',     'tanggal'=>'2026-07-20', 'urutan'=>5, 'is_active'=>false],
            ['nama'=>'Pengumuman Pemenang',   'tanggal'=>'2026-07-25', 'urutan'=>6, 'is_active'=>false],
            ['nama'=>'Awarding Ceremony',     'tanggal'=>'2026-08-01', 'urutan'=>7, 'is_active'=>false],
        ];

        foreach ($items as $item) {
            Timeline::updateOrCreate(['nama' => $item['nama']], $item);
        }
    }
}
```

## 14.5 ConfigSeeder

```php
class ConfigSeeder extends Seeder
{
    public function run(): void
    {
        $configs = [
            ['key'=>'booklet_url',       'value'=>'',                      'keterangan'=>'URL download booklet utama'],
            ['key'=>'wa_humas',          'value'=>'+6281234567890',         'keterangan'=>'Nomor WhatsApp humas'],
            ['key'=>'ig_handle',         'value'=>'@oscar_official',        'keterangan'=>'Handle Instagram OSCAR'],
            ['key'=>'email_kontak',      'value'=>'info@oscar.id',          'keterangan'=>'Email kontak panitia'],
            ['key'=>'pendaftaran_open',  'value'=>'1',                      'keterangan'=>'Global toggle pendaftaran (1=buka, 0=tutup)'],
            ['key'=>'hero_tagline',      'value'=>'Explore. Create. Excel.','keterangan'=>'Tagline hero section'],
            ['key'=>'hero_subtagline',   'value'=>'Olimpiade Sains Camputer dan Rekayasa — Season Rainforest', 'keterangan'=>'Sub tagline hero'],
            ['key'=>'sponsor_text',      'value'=>'Didukung oleh',          'keterangan'=>'Label section sponsor'],
        ];

        foreach ($configs as $c) {
            ConfigModel::updateOrCreate(['key' => $c['key']], $c);
        }
    }
}
```

## 14.6 SeasonSeeder

```php
class SeasonSeeder extends Seeder
{
    public function run(): void
    {
        $seasons = [
            [
                'nama'        => 'OSCAR 1.0',
                'slug'        => 'oscar-1-0',
                'tema'        => 'Digital Revolution',
                'tahun'       => 2022,
                'deskripsi'   => 'Season perdana OSCAR yang menjadi cikal bakal kompetisi tahunan.',
                'jml_peserta' => 150,
                'jml_lomba'   => 3,
                'jml_mitra'   => 5,
                'urutan'      => 1,
            ],
            [
                'nama'        => 'OSCAR 2.0',
                'slug'        => 'oscar-2-0',
                'tema'        => 'Future Technology',
                'tahun'       => 2024,
                'deskripsi'   => 'Season kedua dengan peserta lebih dari dua kali lipat season pertama.',
                'jml_peserta' => 320,
                'jml_lomba'   => 4,
                'jml_mitra'   => 8,
                'urutan'      => 2,
            ],
            [
                'nama'        => 'OSCAR 3.0',
                'slug'        => 'oscar-3-0',
                'tema'        => 'Rainforest',
                'tahun'       => 2026,
                'deskripsi'   => 'Season terbaru dengan tema alam dan teknologi berkelanjutan.',
                'jml_peserta' => 0,
                'jml_lomba'   => 4,
                'jml_mitra'   => 0,
                'urutan'      => 3,
            ],
        ];

        foreach ($seasons as $s) {
            Season::updateOrCreate(['slug' => $s['slug']], $s);
        }
    }
}
```

## 14.7 UserFactory & PendaftaranFactory

```php
// database/factories/UserFactory.php
class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nama'      => $this->faker->name(),
            'email'     => $this->faker->unique()->safeEmail(),
            'password'  => bcrypt('password'),
            'role'      => 'peserta',
            'kategori'  => $this->faker->randomElement(['siswa', 'mahasiswa']),
        ];
    }
}

// database/factories/PendaftaranFactory.php
class PendaftaranFactory extends Factory
{
    public function definition(): array
    {
        $lomba    = Lomba::inRandomOrder()->first();
        $kategori = $lomba?->kategori ?? 'siswa';

        $dataPeserta = $kategori === 'siswa'
            ? [
                'nama_peserta_1' => $this->faker->name(),
                'nama_peserta_2' => $this->faker->name(),
                'nama_pendamping'=> 'Bapak/Ibu ' . $this->faker->lastName(),
                'asal_sekolah'   => 'SMA ' . $this->faker->company() . ' ' . $this->faker->city(),
                'no_wa'          => '0812' . $this->faker->numerify('########'),
                'email'          => $this->faker->safeEmail(),
                'tema'           => $this->faker->sentence(4),
            ]
            : [
                'nama_peserta_1'  => $this->faker->name(),
                'nama_peserta_2'  => $this->faker->name(),
                'nama_peserta_3'  => $this->faker->optional()->name(),
                'asal_universitas'=> 'Universitas ' . $this->faker->company(),
                'no_wa'           => '0812' . $this->faker->numerify('########'),
                'email'           => $this->faker->safeEmail(),
                'tema'            => $this->faker->sentence(4),
            ];

        return [
            'user_id'      => User::factory(),
            'lomba_id'     => $lomba?->id ?? 1,
            'status'       => $this->faker->randomElement(['pending', 'diverifikasi', 'ditolak']),
            'data_peserta' => $dataPeserta,
            'submitted_at' => now()->subDays($this->faker->numberBetween(1, 30)),
        ];
    }
}

// database/seeders/UserSeeder.php (hanya local/dev)
class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::factory(50)->create(); // 50 peserta dummy
    }
}

// database/seeders/PendaftaranSeeder.php (hanya local/dev)
class PendaftaranSeeder extends Seeder
{
    public function run(): void
    {
        // Buat pendaftaran dummy untuk setiap user dengan lomba berbeda
        $users = User::where('role', 'peserta')->get();
        $lombas = Lomba::all();

        foreach ($users->take(40) as $user) {
            $lomba = $lombas->where('kategori', $user->kategori)->random();
            if (!Pendaftaran::where('user_id', $user->id)->where('lomba_id', $lomba->id)->exists()) {
                Pendaftaran::factory()->create([
                    'user_id'  => $user->id,
                    'lomba_id' => $lomba->id,
                ]);
            }
        }
    }
}
```

---

# 15. STRUKTUR FOLDER LARAVEL

```
laravel-oscar/
├── app/
│   ├── Exceptions/
│   │   └── Handler.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── AuthController.php
│   │   │       ├── LombaController.php
│   │   │       ├── TimelineController.php
│   │   │       ├── RoadmapController.php
│   │   │       ├── MitraController.php
│   │   │       ├── ConfigController.php
│   │   │       ├── PendaftaranController.php
│   │   │       ├── NotifikasiController.php
│   │   │       ├── PengumumanController.php
│   │   │       ├── StatistikController.php
│   │   │       └── Admin/
│   │   │           ├── AdminDashboardController.php
│   │   │           ├── AdminLombaController.php
│   │   │           ├── AdminPendaftaranController.php
│   │   │           ├── AdminPesertaController.php
│   │   │           ├── AdminTimelineController.php
│   │   │           ├── AdminRoadmapController.php
│   │   │           ├── AdminPengumumanController.php
│   │   │           ├── AdminMitraController.php
│   │   │           ├── AdminConfigController.php
│   │   │           └── AdminLaporanController.php
│   │   ├── Middleware/
│   │   │   └── RoleMiddleware.php
│   │   └── Requests/
│   │       ├── RegisterRequest.php
│   │       ├── LoginRequest.php
│   │       ├── ForgotPasswordRequest.php
│   │       ├── ResetPasswordRequest.php
│   │       ├── StorePendaftaranRequest.php
│   │       ├── VerifikasiRequest.php
│   │       ├── StoreLombaRequest.php
│   │       ├── StoreSeasonRequest.php
│   │       └── StorePengumumanRequest.php
│   ├── Jobs/
│   │   └── SendPengumumanEmail.php
│   ├── Mail/
│   │   ├── WelcomeEmail.php
│   │   ├── PendaftaranKonfirmasiEmail.php
│   │   ├── PendaftaranDiverifikasiEmail.php
│   │   ├── PendaftaranDitolakEmail.php
│   │   └── PengumumanEmail.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Lomba.php
│   │   ├── Mitra.php
│   │   ├── FaqLomba.php
│   │   ├── Timeline.php
│   │   ├── TimelineLomba.php
│   │   ├── Pendaftaran.php
│   │   ├── BerkasPendaftaran.php
│   │   ├── StatusHistory.php
│   │   ├── Season.php
│   │   ├── GaleriSeason.php
│   │   ├── PemenangSeason.php
│   │   ├── Pengumuman.php
│   │   ├── Notifikasi.php
│   │   └── Config.php
│   ├── Http/Resources/
│   │   ├── UserResource.php
│   │   ├── LombaResource.php
│   │   ├── LombaDetailResource.php
│   │   ├── PendaftaranResource.php
│   │   ├── AdminPendaftaranDetailResource.php
│   │   ├── BerkasResource.php
│   │   ├── TimelineResource.php
│   │   ├── TimelineLombaResource.php
│   │   ├── FaqResource.php
│   │   ├── SeasonResource.php
│   │   ├── GaleriResource.php
│   │   ├── PemenangResource.php
│   │   ├── MitraResource.php
│   │   ├── NotifikasiResource.php
│   │   └── StatusHistoryResource.php
│   ├── Services/
│   │   ├── FileUploadService.php
│   │   └── StatistikService.php
│   └── Traits/
│       └── ApiResponse.php
├── database/
│   ├── factories/
│   │   ├── UserFactory.php
│   │   └── PendaftaranFactory.php
│   ├── migrations/           (19 file — lihat section 3)
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── AdminSeeder.php
│       ├── LombaSeeder.php
│       ├── MitraSeeder.php
│       ├── TimelineSeeder.php
│       ├── SeasonSeeder.php
│       ├── ConfigSeeder.php
│       ├── UserSeeder.php         ← hanya local
│       └── PendaftaranSeeder.php  ← hanya local
├── resources/
│   └── views/
│       └── emails/
│           ├── pendaftaran/
│           │   ├── konfirmasi.blade.php
│           │   ├── diverifikasi.blade.php
│           │   └── ditolak.blade.php
│           └── pengumuman/
│               └── broadcast.blade.php
├── routes/
│   ├── api.php
│   └── web.php
└── storage/app/public/   (lihat section 9)
```

---

# 16. ENVIRONMENT & CONFIG

## 16.1 .env.example

```env
APP_NAME="OSCAR 3.0"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

LOG_CHANNEL=stack
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=oscar_db
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=public
QUEUE_CONNECTION=database
SESSION_DRIVER=file

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@oscar.id"
MAIL_FROM_NAME="OSCAR 3.0"

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost

# Admin credential default (ubah setelah setup!)
ADMIN_PASSWORD=Admin@oscar3

# Storage Production (S3 / compatible)
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# AWS_DEFAULT_REGION=
# AWS_BUCKET=
# AWS_URL=
# AWS_ENDPOINT=
```

## 16.2 web.php (SPA catch-all)

```php
// routes/web.php
Route::get('/{any}', function () {
    return view('app'); // Entry point React SPA
})->where('any', '.*');
```

---

# 17. DEPLOYMENT NOTES

## 17.1 Checklist Pre-deployment

```
SERVER SETUP:
[ ] PHP 8.2+, MySQL 8+, Nginx/Apache
[ ] Composer 2.x, Node 20+

LARAVEL SETUP:
[ ] composer install --no-dev --optimize-autoloader
[ ] cp .env.example .env
[ ] php artisan key:generate
[ ] Isi semua variabel .env (DB, MAIL, APP_URL, FRONTEND_URL)
[ ] php artisan migrate --force
[ ] php artisan db:seed --class=AdminSeeder
[ ] php artisan db:seed --class=LombaSeeder
[ ] php artisan db:seed --class=TimelineSeeder
[ ] php artisan db:seed --class=SeasonSeeder
[ ] php artisan db:seed --class=ConfigSeeder
[ ] php artisan db:seed --class=MitraSeeder
[ ] php artisan storage:link
[ ] php artisan config:cache
[ ] php artisan route:cache
[ ] php artisan view:cache

PERMISSIONS:
[ ] chmod -R 775 storage bootstrap/cache
[ ] chown -R www-data:www-data storage bootstrap/cache

QUEUE WORKER:
[ ] Setup Supervisor (lihat config section 11.3)
[ ] supervisorctl reread && supervisorctl update
[ ] supervisorctl start oscar-queue:*
```

## 17.2 Artisan Commands Berguna

```bash
# Lihat semua API routes
php artisan route:list --path=api

# Clear semua cache
php artisan optimize:clear

# Jalankan queue worker (dev)
php artisan queue:work --queue=emails,default --tries=3

# Lihat failed jobs
php artisan queue:failed

# Retry semua failed jobs
php artisan queue:retry all

# Reset & seed ulang (HATI-HATI di production!)
php artisan migrate:fresh --seed
```

## 17.3 Nginx Config (Contoh)

```nginx
server {
    listen 80;
    server_name api.oscar.id;
    root /var/www/oscar/public;
    index index.php;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    client_max_body_size 15M;   # sesuaikan dengan max upload

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

*Dokumen ini adalah spesifikasi teknis backend OSCAR 3.0 versi lengkap.*
*Dibaca bersama PRD Frontend OSCAR 3.0 v2.0 untuk gambaran sistem yang utuh.*

**Tech Versions:**
Laravel 11.x | PHP 8.2+ | MySQL 8.0+ | Laravel Sanctum 4.x | Queue: Database Driver
