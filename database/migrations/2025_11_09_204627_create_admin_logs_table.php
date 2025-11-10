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
        Schema::create('admin_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            $table->string('action'); // 'created', 'updated', 'deleted', 'approved', 'rejected', 'banned', 'verified'
            $table->string('resource_type'); // Model class name
            $table->unsignedBigInteger('resource_id');
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes for efficient querying
            $table->index('admin_id');
            $table->index('resource_type');
            $table->index('action');
            $table->index('created_at');
            $table->index(['resource_type', 'resource_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_logs');
    }
};
