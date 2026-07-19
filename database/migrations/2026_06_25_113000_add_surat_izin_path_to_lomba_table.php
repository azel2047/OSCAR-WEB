<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lomba', function (Blueprint $table) {
            $table->string('surat_izin_path')->nullable()->after('banner_path');
        });
    }

    public function down(): void
    {
        Schema::table('lomba', function (Blueprint $table) {
            $table->dropColumn('surat_izin_path');
        });
    }
};
