<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('scope_type', 20)->default('province');
            $table->unsignedBigInteger('scope_id')->nullable();
            $table->string('title', 200);
            $table->string('slug', 220)->unique();
            $table->text('description')->nullable();
            $table->enum('type', ['conference', 'retreat', 'service', 'youth', 'social', 'other']);
            $table->datetime('starts_at');
            $table->datetime('ends_at')->nullable();
            $table->string('location', 255)->nullable();
            $table->boolean('is_online')->default(false);
            $table->string('stream_url', 500)->nullable();
            $table->integer('max_capacity')->nullable();
            $table->boolean('registration_required')->default(false);
            $table->enum('status', ['draft', 'published', 'cancelled', 'completed'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
