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
        Schema::table('churches', function (Blueprint $table) {
            $table->string('mpesa_number', 30)->nullable()->after('service_times');
            $table->string('mpesa_name', 100)->nullable()->after('mpesa_number');
            $table->string('emola_number', 30)->nullable()->after('mpesa_name');
            $table->string('emola_name', 100)->nullable()->after('emola_number');
            $table->string('bank_name', 100)->nullable()->after('emola_name');
            $table->string('bank_account_name', 100)->nullable()->after('bank_name');
            $table->string('bank_nib', 30)->nullable()->after('bank_account_name');
            $table->text('give_instructions')->nullable()->after('bank_nib');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('churches', function (Blueprint $table) {
            $table->dropColumn([
                'mpesa_number', 'mpesa_name',
                'emola_number', 'emola_name',
                'bank_name', 'bank_account_name', 'bank_nib',
                'give_instructions',
            ]);
        });
    }
};
