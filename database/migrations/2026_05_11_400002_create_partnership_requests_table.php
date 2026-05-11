<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('partnership_requests', function (Blueprint $table) {
            $table->id();
            $table->string('org_name', 150);
            $table->string('contact_name', 100);
            $table->string('email', 100);
            $table->string('phone', 30)->nullable();
            $table->enum('type', ['institutional', 'business', 'media', 'theological', 'other']);
            $table->text('proposal');
            $table->enum('status', ['new', 'reviewing', 'approved', 'rejected'])->default('new');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partnership_requests');
    }
};
