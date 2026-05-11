<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('financial_supports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('province_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name', 100)->nullable();
            $table->enum('type', ['tithe', 'offering', 'mission', 'social', 'other']);
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('MZN');
            $table->enum('payment_method', ['mpesa', 'mpago', 'bank', 'cash', 'other']);
            $table->string('destination', 200)->nullable();
            $table->string('reference', 100)->nullable();
            $table->enum('status', ['pending', 'confirmed', 'failed'])->default('pending');
            $table->timestamp('supported_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('financial_supports');
    }
};
