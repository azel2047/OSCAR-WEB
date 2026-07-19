<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seasons', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 50);
            $table->string('slug', 60)->unique();
            $table->string('tema', 100);
            $table->year('tahun');
            $table->text('deskripsi')->nullable();
            $table->text('cerita')->nullable();
            $table->string('foto_utama')->nullable();
            $table->string('video_url')->nullable();
            $table->unsignedInteger('jml_peserta')->default(0);
            $table->unsignedInteger('jml_lomba')->default(0);
            $table->unsignedInteger('jml_mitra')->default(0);
            $table->unsignedInteger('urutan')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seasons');
    }
};
