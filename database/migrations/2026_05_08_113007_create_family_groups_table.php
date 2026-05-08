<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('family_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('church_id')->constrained()->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('zone', 100)->nullable();
            $table->string('leader_name', 100);
            $table->string('leader_phone', 30)->nullable();
            $table->enum('meeting_day', ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])->nullable();
            $table->time('meeting_time')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('family_groups');
    }
};
