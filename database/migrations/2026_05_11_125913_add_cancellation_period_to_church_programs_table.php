<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('church_programs', function (Blueprint $table) {
            $table->date('cancelled_from')->nullable()->after('status');
            $table->date('cancelled_until')->nullable()->after('cancelled_from');
        });
    }

    public function down(): void
    {
        Schema::table('church_programs', function (Blueprint $table) {
            $table->dropColumn(['cancelled_from', 'cancelled_until']);
        });
    }
};
