<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BloodStockController;
use App\Http\Controllers\DonorController;

// Health Check
Route::get('/health', function () {
    return response()->json(['status' => 'Donor Service berjalan normal']);
});

// Endpoint Publik (Tidak butuh token)
Route::get('/stocks', [BloodStockController::class, 'index']);

// Endpoint Terproteksi (Wajib menggunakan Token JWT)
Route::middleware(['jwt'])->group(function () {
    Route::post('/donors/schedule', [DonorController::class, 'schedule']);
});