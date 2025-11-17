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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('service_provider_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('booking_id')->nullable()->constrained()->onDelete('set null');
            $table->unsignedBigInteger('last_message_id')->nullable(); // No foreign key to avoid circular dependency
            $table->timestamp('last_message_at')->nullable();
            $table->unsignedInteger('user_unread_count')->default(0);
            $table->unsignedInteger('provider_unread_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            // Ensure unique conversation per user-provider-booking combination
            $table->unique(['user_id', 'service_provider_id', 'booking_id'], 'unique_conversation');

            // Indexes for performance
            $table->index('user_id');
            $table->index('service_provider_id');
            $table->index('booking_id');
            $table->index('last_message_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
