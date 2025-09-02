<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Education;
use Illuminate\Http\Request;

class AdminEducationController extends Controller
{
    public function index()
    {
        return Education::with('portfolio:id,name')->latest('id')->paginate(20);
    }

    public function store(Request $req)
    {
        $data = $req->validate([
            'portfolio_id' => ['required', 'integer', 'exists:portfolios,id'],
            'institution' => ['required', 'string', 'max:255'],
            'degree'      => ['required', 'string', 'max:255'],
            'field'       => ['required', 'string', 'max:255'],
            'start_date'  => ['required', 'date'],
            'end_date'    => ['nullable', 'date'],
            'gpa'         => ['nullable', 'string', 'max:10'],
            'sort_order'  => ['nullable', 'integer'],
        ]);
        $data['sort_order'] = (int)($data['sort_order'] ?? 0);

        return Education::create($data);
    }

    public function update(Request $req, $id)
    {
        $e = Education::findOrFail($id);
        $data = $req->validate([
            'portfolio_id' => ['sometimes', 'required', 'integer', 'exists:portfolios,id'],
            'institution' => ['sometimes', 'required', 'string', 'max:255'],
            'degree'      => ['sometimes', 'required', 'string', 'max:255'],
            'field'       => ['sometimes', 'required', 'string', 'max:255'],
            'start_date'  => ['sometimes', 'required', 'date'],
            'end_date'    => ['nullable', 'date'],
            'gpa'         => ['nullable', 'string', 'max:10'],
            'sort_order'  => ['nullable', 'integer'],
        ]);

        $e->update($data);
        return $e;
    }

    public function destroy($id)
    {
        $e = Education::findOrFail($id);
        $e->delete();
        return response()->json(['deleted' => true]);
    }
}
