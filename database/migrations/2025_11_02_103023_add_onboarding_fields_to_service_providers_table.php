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
        Schema::table('service_providers', function (Blueprint $table) {
            $table->integer('onboarding_step')->default(1)->after('verification_status');
            $table->boolean('onboarding_completed')->default(false)->after('onboarding_step');
            $table->json('onboarding_data')->nullable()->after('onboarding_completed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_providers', function (Blueprint $table) {
            $table->dropColumn(['onboarding_step', 'onboarding_completed', 'onboarding_data']);
        });
    }
};
