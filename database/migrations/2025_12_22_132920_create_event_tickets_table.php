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
        Schema::create('event_tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->foreignId('ticket_package_id')->constrained('ticket_packages')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('order_id')->nullable()->constrained('ticket_orders')->onDelete('cascade');
            $table->string('attendee_name');
            $table->string('attendee_email');
            $table->string('attendee_phone')->nullable();
            $table->text('qr_code');
            $table->enum('status', ['valid', 'used', 'cancelled', 'refunded'])->default('valid');
            $table->timestamp('checked_in_at')->nullable();
            $table->foreignId('checked_in_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('seat_id')->nullable()->constrained('seats')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_tickets');
    }
};
