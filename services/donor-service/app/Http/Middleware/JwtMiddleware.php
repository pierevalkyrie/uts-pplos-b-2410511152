<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Unauthorized: Token tidak diberikan'], 401);
        }

        try {
            $secretKey = env('JWT_SECRET');
            // Decode token menggunakan Firebase JWT
            $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
            
            // Simpan data user ke dalam atribut request agar bisa diakses controller
            $request->attributes->add(['user' => $decoded]);
            
        } catch (Exception $e) {
            return response()->json(['message' => 'Forbidden: Token tidak valid atau kadaluarsa'], 403);
        }

        return $next($request);
    }
}