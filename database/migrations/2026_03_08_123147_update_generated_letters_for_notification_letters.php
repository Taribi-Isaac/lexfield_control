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
        if (Schema::hasTable('generated_letters')) {
            Schema::table('generated_letters', function (Blueprint $table) {
                $table->dropConstrainedForeignId('letter_template_id');
                $table->dropColumn('variables');
            });
        }

        Schema::dropIfExists('letter_templates');
        Schema::dropIfExists('letters');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('letter_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->nullable();
            $table->text('description')->nullable();
            $table->longText('body');
            $table->json('variables')->nullable();
            $table->foreignId('created_by_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('letters', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });

        if (Schema::hasTable('generated_letters')) {
            Schema::table('generated_letters', function (Blueprint $table) {
                $table->foreignId('letter_template_id')->nullable()->constrained()->nullOnDelete();
                $table->json('variables')->nullable();
            });
        }
    }
};
