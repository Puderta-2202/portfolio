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
        Schema::create('education', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_id')->constrained()->onDelete('cascade');
            $table->string('institution');
            $table->string('degree');
            $table->string('field');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('gpa')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->index('portfolio_id');
            $table->index(['start_date', 'end_date']);
            $table->index('institution');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('education');
    }
};