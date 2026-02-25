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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            // Campos de relación (pueden ser nulos para evitar errores si no hay datos previos)
            $table->foreignId('user_id')->nullable(); 
            $table->foreignId('space_id')->nullable();
            
            // Campos de tiempo requeridos por el controlador
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};