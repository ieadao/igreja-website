<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_impacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('social_projects')->cascadeOnDelete();
            $table->string('metric_name', 150);
            $table->integer('metric_value');
            $table->date('recorded_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_impacts');
    }
};
