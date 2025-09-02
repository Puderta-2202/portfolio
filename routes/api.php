<?php

use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\SkillController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    AdminPortfolioController,
    AdminProjectController,
    AdminExperienceController,
    AdminEducationController,
    AdminSkillController
};

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check route
Route::get('/health', function () {
    return response()->json(['status' => 'OK']);
});

// Portfolio routes
Route::prefix('portfolios')->group(function () {
    Route::get('/', [PortfolioController::class, 'index']);
    Route::post('/', [PortfolioController::class, 'store']);
    Route::get('/search', [PortfolioController::class, 'search']);
    Route::get('/filter', [PortfolioController::class, 'filter']);
    Route::get('/stats', [PortfolioController::class, 'stats']);
    Route::get('/{id}', [PortfolioController::class, 'show']);
    Route::put('/{id}', [PortfolioController::class, 'update']);
    Route::delete('/{id}', [PortfolioController::class, 'destroy']);
});

// Skills routes
Route::prefix('skills')->group(function () {
    Route::get('/', [SkillController::class, 'index']);
    Route::post('/', [SkillController::class, 'store']);
    Route::get('/popular', [SkillController::class, 'popular']);
    Route::get('/category', [SkillController::class, 'byCategory']);
    Route::get('/stats', [SkillController::class, 'stats']);
});

Route::middleware('admin.key')->prefix('admin')->group(function () {
    // portfolios
    Route::get('/portfolios', [AdminPortfolioController::class, 'index']);
    Route::post('/portfolios', [AdminPortfolioController::class, 'store']);
    Route::put('/portfolios/{id}', [AdminPortfolioController::class, 'update']);
    Route::delete('/portfolios/{id}', [AdminPortfolioController::class, 'destroy']);

    // projects
    Route::get('/projects', [AdminProjectController::class, 'index']);
    Route::post('/projects', [AdminProjectController::class, 'store']);
    Route::put('/projects/{id}', [AdminProjectController::class, 'update']);
    Route::delete('/projects/{id}', [AdminProjectController::class, 'destroy']);

    // experiences
    Route::get('/experiences', [AdminExperienceController::class, 'index']);
    Route::post('/experiences', [AdminExperienceController::class, 'store']);
    Route::put('/experiences/{id}', [AdminExperienceController::class, 'update']);
    Route::delete('/experiences/{id}', [AdminExperienceController::class, 'destroy']);

    // education
    Route::get('/education', [AdminEducationController::class, 'index']);
    Route::post('/education', [AdminEducationController::class, 'store']);
    Route::put('/education/{id}', [AdminEducationController::class, 'update']);
    Route::delete('/education/{id}', [AdminEducationController::class, 'destroy']);

    // skills (master + relasi via portfolio_skills)
    Route::get('/skills', [AdminSkillController::class, 'index']);
    Route::post('/skills', [AdminSkillController::class, 'store']);
    Route::put('/skills/{id}', [AdminSkillController::class, 'update']);
    Route::delete('/skills/{id}', [AdminSkillController::class, 'destroy']);

    // attach/detach skill ke portfolio
    Route::post('/portfolios/{id}/skills/sync', [AdminPortfolioController::class, 'syncSkills']);
});
