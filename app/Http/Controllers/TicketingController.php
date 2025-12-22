<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketingController extends Controller
{
    public function index()
    {
        // In the future, this will fetch real events from database
        // For now, let the component use its default data by not passing these props

        return Inertia::render('Ticketing/Index', [
            'location' => 'Lilongwe, MW',
        ]);
    }
}
