<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DonorController extends Controller
{
    public function schedule(Request $request)
    {
        // Mengambil data user dari JWT yang sudah di-decode oleh Middleware
        $user = $request->attributes->get('user');

        return response()->json([
            'message' => 'Jadwal donor berhasil dibuat (Placeholder)',
            'user_id' => $user->id,
            'email' => $user->email
        ], 201);
    }
}