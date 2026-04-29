<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BloodStock extends Model
{
    use HasFactory;

    protected $table = 'blood_stocks';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'blood_group', 'rhesus', 'volume_ml'
    ];

    // Otomatis assign UUID saat create
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }
}