<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class PortfolioController extends Controller
{
    /**
     * Display a listing of portfolios.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Portfolio::withFullData();
        
        // Pagination parameters
        $perPage = $request->get('per_page', 15);
        $perPage = min($perPage, 100); // Max 100 items per page
        
        $portfolios = $query->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $portfolios
        ]);
    }

    /**
     * Store a newly created portfolio.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'email' => 'required|email|unique:portfolios,email',
            'phone' => 'required|string|max:20',
            'location' => 'required|string|max:255',
            'bio' => 'required|string',
            'profile_image' => 'nullable|string',
            'social_links' => 'nullable|array',
            'social_links.linkedin' => 'nullable|url',
            'social_links.github' => 'nullable|url',
            'social_links.website' => 'nullable|url',
            'social_links.twitter' => 'nullable|url',
            'social_links.instagram' => 'nullable|url',
        ]);

        $portfolio = Portfolio::create($validated);
        $portfolio->load(['skills', 'experiences', 'projects', 'education']);

        return response()->json([
            'success' => true,
            'data' => $portfolio,
            'message' => 'Portfolio created successfully'
        ], 201);
    }

    /**
     * Display the specified portfolio.
     */
    public function show(string $id): JsonResponse
    {
        $portfolio = Portfolio::withFullData()->find($id);

        if (!$portfolio) {
            return response()->json([
                'success' => false,
                'message' => 'Portfolio not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $portfolio
        ]);
    }

    /**
     * Update the specified portfolio.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $portfolio = Portfolio::find($id);

        if (!$portfolio) {
            return response()->json([
                'success' => false,
                'message' => 'Portfolio not found'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'title' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('portfolios')->ignore($portfolio->id)
            ],
            'phone' => 'sometimes|string|max:20',
            'location' => 'sometimes|string|max:255',
            'bio' => 'sometimes|string',
            'profile_image' => 'nullable|string',
            'social_links' => 'nullable|array',
            'social_links.linkedin' => 'nullable|url',
            'social_links.github' => 'nullable|url',
            'social_links.website' => 'nullable|url',
            'social_links.twitter' => 'nullable|url',
            'social_links.instagram' => 'nullable|url',
        ]);

        $portfolio->update($validated);
        $portfolio->load(['skills', 'experiences', 'projects', 'education']);

        return response()->json([
            'success' => true,
            'data' => $portfolio,
            'message' => 'Portfolio updated successfully'
        ]);
    }

    /**
     * Remove the specified portfolio.
     */
    public function destroy(string $id): JsonResponse
    {
        $portfolio = Portfolio::find($id);

        if (!$portfolio) {
            return response()->json([
                'success' => false,
                'message' => 'Portfolio not found'
            ], 404);
        }

        $portfolio->delete();

        return response()->json([
            'success' => true,
            'message' => 'Portfolio deleted successfully'
        ]);
    }

    /**
     * Search portfolios.
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:1|max:255'
        ]);

        $query = $request->get('q');
        $perPage = $request->get('per_page', 15);
        
        $portfolios = Portfolio::withFullData()
            ->search($query)
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $portfolios
        ]);
    }

    /**
     * Filter portfolios by skill.
     */
    public function filter(Request $request): JsonResponse
    {
        $request->validate([
            'skill' => 'required|string|min:1|max:255'
        ]);

        $skill = $request->get('skill');
        $perPage = $request->get('per_page', 15);
        
        $portfolios = Portfolio::withFullData()
            ->withSkill($skill)
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $portfolios
        ]);
    }

    /**
     * Get portfolio statistics.
     */
    public function stats(): JsonResponse
    {
        $total = Portfolio::count();
        
        // Get top skills
        $skillStats = Portfolio::withFullData()
            ->get()
            ->pluck('skills')
            ->flatten()
            ->groupBy('name')
            ->map->count()
            ->sortDesc()
            ->take(10);

        // Get location distribution
        $locationStats = Portfolio::select('location')
            ->get()
            ->groupBy('location')
            ->map->count()
            ->sortDesc();

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $total,
                'bySkill' => $skillStats,
                'byLocation' => $locationStats
            ]
        ]);
    }
}