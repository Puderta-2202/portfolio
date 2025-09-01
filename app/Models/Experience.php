<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Experience extends Model
{
    use HasFactory;

    protected $fillable = [
        'portfolio_id',
        'company',
        'position',
        'start_date',
        'end_date',
        'description',
        'is_current_role',
        'sort_order',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current_role' => 'boolean',
    ];

    /**
     * Get the portfolio that owns the experience.
     */
    public function portfolio(): BelongsTo
    {
        return $this->belongsTo(Portfolio::class);
    }

    /**
     * Scope a query to only include current roles.
     */
    public function scopeCurrent($query)
    {
        return $query->where('is_current_role', true);
    }

    /**
     * Get the duration of the experience in a human-readable format.
     */
    public function getDurationAttribute(): string
    {
        $start = $this->start_date;
        $end = $this->end_date ?? now();
        
        $diff = $start->diff($end);
        
        $years = $diff->y;
        $months = $diff->m;
        
        $duration = [];
        
        if ($years > 0) {
            $duration[] = $years . ' tahun';
        }
        
        if ($months > 0) {
            $duration[] = $months . ' bulan';
        }
        
        return implode(' ', $duration) ?: '< 1 bulan';
    }
}