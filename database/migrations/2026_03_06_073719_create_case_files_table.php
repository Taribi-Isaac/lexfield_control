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
        Schema::create('case_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lead_lawyer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->string('suit_number')->nullable()->unique();
            $table->string('court')->nullable();
            $table->date('filing_date')->nullable();
            $table->string('opposing_party')->nullable();
            $table->string('opposing_counsel')->nullable();
            $table->string('status')->default('Open');
            $table->text('summary')->nullable();
            $table->timestamps();

            $table->index(['status', 'filing_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_files');
    }
};
