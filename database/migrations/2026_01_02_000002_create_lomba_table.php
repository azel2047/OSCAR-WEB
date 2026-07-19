<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lomba', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 80);
            $table->string('slug', 100)->unique();
            $table->string('kategori')->comment('siswa, mahasiswa');
            $table->longText('deskripsi')->nullable();
            $table->longText('persyaratan')->nullable();
            $table->longText('ketentuan')->nullable();
            $table->string('hadiah_1')->nullable();
            $table->string('hadiah_2')->nullable();
            $table->string('hadiah_3')->nullable();
            $table->text('benefit')->nullable();
            $table->dateTime('deadline');
            $table->unsignedInteger('kuota')->default(0);
            $table->string('status')->default('draft')->comment('draft, buka, tutup');
            $table->string('booklet_path')->nullable();
            $table->string('banner_path')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lomba');
    }
};
