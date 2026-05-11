<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('scope_type', ['national', 'province', 'region', 'zone', 'church'])
                ->nullable()
                ->after('church_id');
            $table->unsignedBigInteger('scope_id')->nullable()->after('scope_type');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['scope_type', 'scope_id']);
        });
    }
};
