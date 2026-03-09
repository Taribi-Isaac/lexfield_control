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
        Schema::create('cause_list_entries', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('court');
            $table->string('suit_number')->nullable();
            $table->string('case_title');
            $table->foreignId('assigned_lawyer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('created_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('business_of_day')->nullable();
            $table->time('time')->nullable();
            $table->string('status')->default('Scheduled');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['date', 'court']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cause_list_entries');
    }
};
