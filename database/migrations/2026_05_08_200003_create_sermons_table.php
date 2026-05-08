<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sermons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('scope_type', 20)->default('province');
            $table->unsignedBigInteger('scope_id')->nullable();
            $table->string('title', 200);
            $table->string('series', 150)->nullable();
            $table->text('description')->nullable();
            $table->string('video_url', 500)->nullable();
            $table->string('audio_url', 500)->nullable();
            $table->string('pdf_url', 500)->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->date('preached_at');
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sermons');
    }
};
