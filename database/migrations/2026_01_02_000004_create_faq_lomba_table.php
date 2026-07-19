<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faq_lomba', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lomba_id')->constrained('lomba')->cascadeOnDelete();
            $table->text('pertanyaan');
            $table->text('jawaban');
            $table->unsignedInteger('urutan')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faq_lomba');
    }
};
