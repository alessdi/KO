<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SpaceController;
use App\Http\Controllers\Api\ReservationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- RUTAS PÚBLICAS ---
Route::post('/login', [AuthController::class, 'login']);


// --- RUTAS PROTEGIDAS (Requieren Token Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);

    // Espacios (Lectura para todos los usuarios logueados)
    Route::get('/spaces', [SpaceController::class, 'index']);

    // Reservaciones (CRUD básico)
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy']);

    // --- RUTAS DE ADMINISTRADOR ---
    // Solo usuarios con rol admin pueden crear, editar o borrar espacios
    Route::middleware('admin')->group(function () {
        Route::post('/spaces', [SpaceController::class, 'store']);
        Route::put('/spaces/{space}', [SpaceController::class, 'update']);
        Route::delete('/spaces/{space}', [SpaceController::class, 'destroy']);
    });
});