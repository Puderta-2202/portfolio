<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;

class AdminSkillController extends Controller
{
    public function index()
    {
        return Skill::orderBy('name')->paginate(50);
    }

    public function store(Request $req)
    {
        $data = $req->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'is_popular' => ['nullable', 'boolean'],
        ]);
        $data['is_popular'] = (bool)($data['is_popular'] ?? false);
        return Skill::create($data);
    }

    public function update(Request $req, $id)
    {
        $s = Skill::findOrFail($id);
        $data = $req->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'is_popular' => ['nullable', 'boolean'],
        ]);
        $s->update($data);
        return $s;
    }

    public function destroy($id)
    {
        $s = Skill::findOrFail($id);
        $s->delete();
        return response()->json(['deleted' => true]);
    }
}
