<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SkillController extends Controller
{
    /**
     * Display a listing of all skills.
     */
    public function index(): JsonResponse
    {
        $skills = Skill::orderBy('name')->pluck('name');

        return response()->json([
            'success' => true,
            'data' => $skills
        ]);
    }

    /**
     * Display popular skills.
     */
    public function popular(): JsonResponse
    {
        $skills = Skill::popular()->orderBy('name')->pluck('name');

        return response()->json([
            'success' => true,
            'data' => $skills
        ]);
    }

    /**
     * Store a newly created skill.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:skills,name',
            'category' => 'nullable|string|max:255',
            'is_popular' => 'boolean'
        ]);

        $skill = Skill::create($validated);

        return response()->json([
            'success' => true,
            'data' => $skill,
            'message' => 'Skill created successfully'
        ], 201);
    }

    /**
     * Display skills by category.
     */
    public function byCategory(Request $request): JsonResponse
    {
        $request->validate([
            'category' => 'required|string|max:255'
        ]);

        $category = $request->get('category');
        $skills = Skill::byCategory($category)->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $skills
        ]);
    }

    /**
     * Get skill statistics.
     */
    public function stats(): JsonResponse
    {
        $totalSkills = Skill::count();
        $popularSkills = Skill::popular()->count();
        $categories = Skill::select('category')
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category');

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $totalSkills,
                'popular' => $popularSkills,
                'categories' => $categories
            ]
        ]);
    }
}