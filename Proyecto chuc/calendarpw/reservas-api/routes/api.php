<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ReservationController;

Route::get('/reservas', [ReservationController::class, 'index']);
Route::post('/reservas', [ReservationController::class, 'store']);
Route::get('/spaces', [App\Http\Controllers\SpaceController::class, 'index']);
// Añade aquí cualquier otra ruta que use tu calendario