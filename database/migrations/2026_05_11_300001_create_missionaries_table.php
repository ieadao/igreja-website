<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('missionaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('church_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('province_id')->constrained()->cascadeOnDelete();
            $table->string('full_name', 150);
            $table->enum('status', ['active', 'inactive', 'international'])->default('active');
            $table->text('bio')->nullable();
            $table->string('specialization', 150)->nullable();
            $table->string('photo_url', 500)->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('email', 100)->nullable();
            $table->text('needs')->nullable();
            $table->date('started_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('missionaries');
    }
};
