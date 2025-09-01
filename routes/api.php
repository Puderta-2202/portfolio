<?php

use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\SkillController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

// Example protected routes (uncomment when authentication is implemented)
/*
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/portfolios', [PortfolioController::class, 'store']);
    Route::put('/portfolios/{id}', [PortfolioController::class, 'update']);
    Route::delete('/portfolios/{id}', [PortfolioController::class, 'destroy']);
    Route::post('/skills', [SkillController::class, 'store']);
});
*/