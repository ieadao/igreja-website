<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_locks', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_active')->default(false);
            $table->string('scope')->default('global'); // 'global' | 'paths'
            $table->json('locked_paths')->nullable();
            $table->string('gate_title')->default('Acesso Restrito');
            $table->text('gate_message')->nullable();
            $table->timestamps();
        });

        DB::table('site_locks')->insert([
            'is_active'   => false,
            'scope'       => 'global',
            'gate_title'  => 'Acesso Restrito',
            'gate_message' => null,
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('site_locks');
    }
};
