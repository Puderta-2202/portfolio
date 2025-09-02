<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminProjectController extends Controller
{
    public function index()
    {
        return Project::with('portfolio:id,name')->latest('id')->paginate(20);
    }

    public function store(Request $req)
    {
        $data = $req->validate([
            'portfolio_id' => ['required', 'integer', 'exists:portfolios,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'technologies' => ['nullable'],
            'live_url' => ['nullable', 'url'],
            'github_url' => ['nullable', 'url'],
            'featured' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer'],
            'image' => ['nullable', 'image', 'max:4096'],
        ]);

        $tech = $req->input('technologies');
        if (is_string($tech)) {
            $dec = json_decode($tech, true);
            $data['technologies'] = is_array($dec) ? array_values($dec) : [];
        } elseif (is_array($tech)) {
            $data['technologies'] = array_values($tech);
        } else {
            $data['technologies'] = [];
        }

        if ($req->hasFile('image')) {
            $path = $req->file('image')->store('projects', 'public');
            $data['image'] = Storage::url($path);
        }

        $data['featured'] = (bool)($data['featured'] ?? false);
        $data['sort_order'] = (int)($data['sort_order'] ?? 0);

        $p = Project::create($data);
        return response()->json($p->load('portfolio:id,name'), 201);
    }

    public function update(Request $req, $id)
    {
        $p = Project::findOrFail($id);
        $data = $req->validate([
            'portfolio_id' => ['sometimes', 'required', 'integer', 'exists:portfolios,id'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'technologies' => ['nullable'],
            'live_url' => ['nullable', 'url'],
            'github_url' => ['nullable', 'url'],
            'featured' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer'],
            'image' => ['nullable', 'image', 'max:4096'],
        ]);

        if ($req->hasFile('image')) {
            $path = $req->file('image')->store('projects', 'public');
            $data['image'] = Storage::url($path);
        }

        if ($req->has('technologies')) {
            $tech = $req->input('technologies');
            if (is_string($tech)) {
                $dec = json_decode($tech, true);
                $data['technologies'] = is_array($dec) ? array_values($dec) : [];
            } elseif (is_array($tech)) {
                $data['technologies'] = array_values($tech);
            }
        }

        $p->update($data);
        return $p->load('portfolio:id,name');
    }

    public function destroy($id)
    {
        $p = Project::findOrFail($id);
        $p->delete();
        return response()->json(['deleted' => true]);
    }
}
