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
        Schema::create('portfolios', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('title');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('location');
            $table->text('bio');
            $table->string('profile_image')->nullable();
            $table->json('social_links')->nullable();
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['name', 'title']);
            $table->index('location');
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolios');
    }
};