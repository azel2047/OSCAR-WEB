<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lomba_mitra', function (Blueprint $table) {
            $table->foreignId('lomba_id')->constrained('lomba')->cascadeOnDelete();
            $table->foreignId('mitra_id')->constrained('mitra')->cascadeOnDelete();
            $table->primary(['lomba_id', 'mitra_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lomba_mitra');
    }
};
