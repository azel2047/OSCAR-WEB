<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'no_hp')) {
                $table->string('no_hp', 20)->nullable()->after('kategori');
            }
            if (!Schema::hasColumn('users', 'institusi')) {
                $table->string('institusi', 150)->nullable()->after('provinsi');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columnsToDrop = [];
            if (Schema::hasColumn('users', 'no_hp')) {
                $columnsToDrop[] = 'no_hp';
            }
            if (Schema::hasColumn('users', 'institusi')) {
                $columnsToDrop[] = 'institusi';
            }
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
