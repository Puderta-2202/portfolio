<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'title',
        'email',
        'phone',
        'location',
        'bio',
        'profile_image',
        'social_links',
    ];

    protected $casts = [
        'social_links' => 'array',
    ];

    protected $appends = [
        'profile_image_url',
    ];

    /**
     * Get the skills for the portfolio.
     */
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'portfolio_skills')
                    ->withPivot('proficiency_level')
                    ->withTimestamps();
    }

    /**
     * Get the experiences for the portfolio.
     */
    public function experiences(): HasMany
    {
        return $this->hasMany(Experience::class)->orderBy('start_date', 'desc');
    }

    /**
     * Get the projects for the portfolio.
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class)->orderBy('featured', 'desc')->orderBy('sort_order');
    }

    /**
     * Get the education records for the portfolio.
     */
    public function education(): HasMany
    {
        return $this->hasMany(Education::class)->orderBy('start_date', 'desc');
    }

    /**
     * Get the full URL for the profile image.
     */
    public function getProfileImageUrlAttribute(): ?string
    {
        if (!$this->profile_image) {
            return null;
        }

        if (str_starts_with($this->profile_image, 'http')) {
            return $this->profile_image;
        }

        return asset('storage/' . $this->profile_image);
    }

    /**
     * Scope a query to search portfolios.
     */
    public function scopeSearch($query, $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name', 'LIKE', "%{$term}%")
              ->orWhere('title', 'LIKE', "%{$term}%")
              ->orWhere('bio', 'LIKE', "%{$term}%")
              ->orWhere('location', 'LIKE', "%{$term}%")
              ->orWhereHas('skills', function ($skillQuery) use ($term) {
                  $skillQuery->where('name', 'LIKE', "%{$term}%");
              });
        });
    }

    /**
     * Scope a query to filter by skill.
     */
    public function scopeWithSkill($query, $skillName)
    {
        return $query->whereHas('skills', function ($skillQuery) use ($skillName) {
            $skillQuery->where('name', 'LIKE', "%{$skillName}%");
        });
    }

    /**
     * Get portfolios with all relationships loaded.
     */
    public function scopeWithFullData($query)
    {
        return $query->with([
            'skills',
            'experiences',
            'projects',
            'education'
        ]);
    }
}