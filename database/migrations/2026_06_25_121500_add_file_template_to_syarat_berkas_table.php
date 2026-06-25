<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('syarat_berkas', function (Blueprint $table) {
            $table->string('file_template')->nullable()->after('url_target');
        });
    }

    public function down(): void
    {
        Schema::table('syarat_berkas', function (Blueprint $table) {
            $table->dropColumn('file_template');
        });
    }
};
