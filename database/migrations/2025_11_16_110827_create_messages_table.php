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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->onDelete('cascade');
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $table->enum('sender_type', ['user', 'provider', 'admin', 'system']);
            $table->enum('message_type', ['text', 'file', 'system_notification', 'booking_request'])->default('text');
            $table->text('content');
            $table->text('formatted_content')->nullable();
            $table->json('metadata')->nullable(); // For buttons, file info, system message data
            $table->timestamp('read_by_user_at')->nullable();
            $table->timestamp('read_by_provider_at')->nullable();
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->string('file_type')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->foreignId('parent_message_id')->nullable()->constrained('messages')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance
            $table->index('conversation_id');
            $table->index('sender_id');
            $table->index('sender_type');
            $table->index('read_by_user_at');
            $table->index('read_by_provider_at');
            $table->index('created_at'); // For pagination
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
