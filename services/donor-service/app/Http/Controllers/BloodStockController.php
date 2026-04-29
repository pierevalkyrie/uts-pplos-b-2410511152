<?php

namespace App\Http\Controllers;

use App\Models\BloodStock;
use Illuminate\Http\Request;

class BloodStockController extends Controller
{
    public function index(Request $request)
    {
        // 1. Parameter Pagination (Default 10)
        $perPage = $request->query('per_page', 10);
        
        // 2. Parameter Filter Golongan Darah
        $bloodGroup = $request->query('blood_group');

        $query = BloodStock::query();

        if ($bloodGroup) {
            $query->where('blood_group', strtoupper($bloodGroup));
        }

        // Eksekusi Paginasi
        $stocks = $query->paginate($perPage);

        return response()->json([
            'message' => 'Berhasil mengambil data stok darah',
            'data' => $stocks
        ], 200);
    }
}