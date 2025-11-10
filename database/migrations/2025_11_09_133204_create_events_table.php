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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_provider_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('type', ['public', 'private', 'hybrid'])->default('public');
            $table->enum('category', ['conference', 'workshop', 'concert', 'festival', 'sports', 'exhibition', 'networking', 'other'])->default('other');

            // Venue details
            $table->string('venue_name')->nullable();
            $table->text('venue_address')->nullable();
            $table->string('venue_city')->nullable();
            $table->string('venue_country')->default('Malawi');
            $table->decimal('venue_latitude', 10, 7)->nullable();
            $table->decimal('venue_longitude', 10, 7)->nullable();
            $table->string('venue_map_url')->nullable();
            $table->boolean('is_online')->default(false);
            $table->string('online_meeting_url')->nullable();

            // Date & Time
            $table->dateTime('start_datetime');
            $table->dateTime('end_datetime');
            $table->string('timezone')->default('Africa/Blantyre');
            $table->dateTime('registration_start')->nullable();
            $table->dateTime('registration_end')->nullable();

            // Capacity
            $table->integer('max_attendees')->nullable(); // null = unlimited
            $table->integer('registered_count')->default(0);
            $table->integer('checked_in_count')->default(0);

            // Status & Visibility
            $table->enum('status', ['draft', 'published', 'cancelled', 'postponed', 'completed'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->boolean('requires_approval')->default(false); // Manual approval for registrations

            // Media
            $table->string('cover_image')->nullable();
            $table->json('gallery_images')->nullable();

            // Additional Info
            $table->text('terms_conditions')->nullable();
            $table->text('agenda')->nullable(); // Event schedule/program
            $table->json('speakers')->nullable(); // Speaker information
            $table->json('sponsors')->nullable(); // Sponsor information
            $table->json('tags')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('start_datetime');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
