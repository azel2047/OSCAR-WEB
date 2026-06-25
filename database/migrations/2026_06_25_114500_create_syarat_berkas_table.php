<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('syarat_berkas', function (Blueprint $table) {
            $table->id();
            $table->string('key', 50)->unique(); // sosmed, sosmed_hima, twibbon, dll.
            $table->string('nama', 150);
            $table->string('deskripsi')->nullable();
            $table->string('url_target')->nullable();
            $table->boolean('is_required')->default(true);
            $table->string('status')->default('aktif'); // aktif, nonaktif
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('syarat_berkas');
    }
};
