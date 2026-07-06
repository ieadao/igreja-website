<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->boolean('registrations_open')->default(true)->after('registration_required');
            $table->boolean('is_paid')->default(false)->after('registrations_open');
        });

        Schema::table('event_registrations', function (Blueprint $table) {
            $table->string('payment_proof', 500)->nullable()->after('phone');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['registrations_open', 'is_paid']);
        });

        Schema::table('event_registrations', function (Blueprint $table) {
            $table->dropColumn('payment_proof');
        });
    }
};
