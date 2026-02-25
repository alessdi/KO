<?php

namespace App\Http\Controllers;

use App\Models\Space;

class SpaceController extends Controller
{
    public function index()
    {
        return Space::all();
    }
}