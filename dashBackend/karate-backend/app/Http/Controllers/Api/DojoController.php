<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dojo;

class DojoController extends Controller
{
    public function index()
    {
        return response()->json(Dojo::all());
    }
    public function show($id)
    {
        return Dojo::findOrFail($id);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'instructor' => 'required|string',
            'phone' => 'required|string',
            'students' => 'integer',
            'status' => 'string',
            // Optional fields don't need 'required'
            'image' => 'nullable|url', 
            'address' => 'nullable|string',
            'location_url' => 'nullable|url'
        ]);

        $dojo = Dojo::create($validated);
        return response()->json($dojo, 201);
    }
    public function update(Request $request, $id)
    {
        $dojo = Dojo::findOrFail($id);
        $dojo->update($request->all()); // Simple update for now
        return response()->json($dojo);
    }
    public function destroy($id)
    {
        Dojo::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
