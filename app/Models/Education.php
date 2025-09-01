<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Education extends Model
{
    use HasFactory;

    protected $fillable = [
        'portfolio_id',
        'institution',
        'degree',
        'field',
        'start_date',
        'end_date',
        'gpa',
        'sort_order',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Get the portfolio that owns the education record.
     */
    public function portfolio(): BelongsTo
    {
        return $this->belongsTo(Portfolio::class);
    }

    /**
     * Get the duration of the education in a human-readable format.
     */
    public function getDurationAttribute(): string
    {
        $start = $this->start_date;
        $end = $this->end_date;
        
        if (!$start || !$end) {
            return '';
        }
        
        $diff = $start->diff($end);
        $years = $diff->y;
        
        return $years > 0 ? $years . ' tahun' : '< 1 tahun';
    }

    /**
     * Scope a query to filter by institution.
     */
    public function scopeByInstitution($query, $institution)
    {
        return $query->where('institution', 'LIKE', "%{$institution}%");
    }

    /**
     * Scope a query to filter by degree.
     */
    public function scopeByDegree($query, $degree)
    {
        return $query->where('degree', 'LIKE', "%{$degree}%");
    }
}