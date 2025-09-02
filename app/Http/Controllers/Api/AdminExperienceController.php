<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;

class AdminExperienceController extends Controller
{
    public function index()
    {
        return Experience::with('portfolio:id,name')->latest('id')->paginate(20);
    }

    public function store(Request $req)
    {
        $data = $req->validate([
            'portfolio_id' => ['required', 'integer', 'exists:portfolios,id'],
            'company' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date'  => ['nullable', 'date'],
            'description' => ['nullable', 'string'],
            'is_current_role' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $data['is_current_role'] = (bool)($data['is_current_role'] ?? false);
        $data['sort_order'] = (int)($data['sort_order'] ?? 0);

        return Experience::create($data);
    }

    public function update(Request $req, $id)
    {
        $e = Experience::findOrFail($id);
        $data = $req->validate([
            'portfolio_id' => ['sometimes', 'required', 'integer', 'exists:portfolios,id'],
            'company' => ['sometimes', 'required', 'string', 'max:255'],
            'position' => ['sometimes', 'required', 'string', 'max:255'],
            'start_date' => ['sometimes', 'required', 'date'],
            'end_date'  => ['nullable', 'date'],
            'description' => ['nullable', 'string'],
            'is_current_role' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $e->update($data);
        return $e;
    }

    public function destroy($id)
    {
        $e = Experience::findOrFail($id);
        $e->delete();
        return response()->json(['deleted' => true]);
    }
}
