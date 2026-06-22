<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengumuman', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->longText('isi');
            $table->string('target')->default('semua')->comment('semua, per_lomba');
            $table->foreignId('lomba_id')->nullable()->constrained('lomba')->nullOnDelete();
            $table->timestamp('publish_at')->nullable();
            $table->boolean('kirim_email')->default(false);
            $table->boolean('email_sent')->default(false);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengumuman');
    }
};
