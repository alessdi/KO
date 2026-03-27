<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Obtener reservas filtradas por rango de fechas.
     */
    public function index(Request $request)
    {
        // 1. Capturamos las fechas que manda el frontend (FullCalendar)
        $start = $request->query('start');
        $end = $request->query('end');

        // 2. Iniciamos la consulta cargando las relaciones de usuario y espacio
        $query = Reservation::with(['user', 'space']);

        // 3. Filtramos por rango si las fechas están presentes
        if ($start && $end) {
            $query->whereBetween('start_time', [$start, $end]);
        }

        // 4. Retornamos la respuesta formateada para el calendario
        return response()->json($query->get()->map(function ($r) {
            return [
                'id' => $r->id,
                // Concatenamos espacio y usuario para el título del evento
                'title' => ($r->space->name ?? 'Sala') . " - " . ($r->user->name ?? 'Usuario'),
                'start' => $r->start_time,
                'end' => $r->end_time,
                'space_name' => $r->space->name ?? '',
                'user_name' => $r->user->name ?? '',
            ];
        }));
    }

    /**
     * Store y otros métodos (si ya los tenías, mantenlos debajo)
     */
}