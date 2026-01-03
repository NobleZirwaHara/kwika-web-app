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
        // Create booking_items table
        Schema::create('booking_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('service_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('service_package_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('item_type', ['service', 'package', 'custom'])->default('service');
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 10, 2)->default(0);
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('booking_id');
            $table->index('service_id');
            $table->index('service_package_id');
            $table->index('item_type');
        });

        // Modify bookings table
        Schema::table('bookings', function (Blueprint $table) {
            $table->enum('booking_type', ['single_service', 'package', 'custom'])
                ->default('single_service')
                ->after('service_provider_id');
            $table->foreignId('service_package_id')
                ->nullable()
                ->after('service_id')
                ->constrained()
                ->onDelete('set null');
            $table->decimal('subtotal', 10, 2)->nullable()->after('total_amount');
            $table->decimal('discount_amount', 10, 2)->default(0)->after('subtotal');
        });

        // Make service_id nullable (for package bookings)
        Schema::table('bookings', function (Blueprint $table) {
            $table->unsignedBigInteger('service_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert bookings modifications
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['service_package_id']);
            $table->dropColumn(['booking_type', 'service_package_id', 'subtotal', 'discount_amount']);
        });

        // Drop booking_items table
        Schema::dropIfExists('booking_items');
    }
};
