<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminPortfolioController extends Controller
{
    public function index(Request $req)
    {
        if ($req->boolean('simple')) {
            return Portfolio::orderBy('name')->get(['id', 'name', 'title']);
        }
        return Portfolio::with(['skills:id,name'])
            ->latest('id')->paginate(20);
    }

    public function store(Request $req)
    {
        $data = $req->validate([
            'name' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'social_links' => ['nullable', 'array'],
            'profile_image' => ['nullable', 'image', 'max:3072'],
        ]);

        if ($req->hasFile('profile_image')) {
            $path = $req->file('profile_image')->store('profiles', 'public');
            $data['profile_image'] = Storage::url($path);
        }

        $p = Portfolio::create($data);
        return response()->json($p->load('skills:id,name'), 201);
    }

    public function update(Request $req, $id)
    {
        $p = Portfolio::findOrFail($id);
        $data = $req->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255'],
            'phone' => ['sometimes', 'required', 'string', 'max:255'],
            'location' => ['sometimes', 'required', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'social_links' => ['nullable', 'array'],
            'profile_image' => ['nullable', 'image', 'max:3072'],
        ]);

        if ($req->hasFile('profile_image')) {
            $path = $req->file('profile_image')->store('profiles', 'public');
            $data['profile_image'] = Storage::url($path);
        }

        $p->update($data);
        return $p->load('skills:id,name');
    }

    public function destroy($id)
    {
        $p = Portfolio::findOrFail($id);
        $p->delete();
        return response()->json(['deleted' => true]);
    }

    // sinkronisasi relasi many-to-many Portfolio<->Skill via pivot `portfolio_skills`
    public function syncSkills(Request $req, $id)
    {
        $p = Portfolio::findOrFail($id);
        $data = $req->validate([
            'skill_ids' => ['array'],
            'skill_ids.*' => ['integer', 'exists:skills,id'],
        ]);
        $p->skills()->sync($data['skill_ids'] ?? []);
        return $p->load('skills:id,name');
    }
}
