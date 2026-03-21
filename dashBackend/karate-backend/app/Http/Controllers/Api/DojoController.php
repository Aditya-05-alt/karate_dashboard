<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dojo;

class DojoController extends Controller
{
    public function index()
    {
        $dojos = Dojo::with('instructor')->withCount('students')->get();

        $mappedDojos = $dojos->map(function($dojo) {
            return [
                'id'            => $dojo->id,
                'name'          => $dojo->name,
                'instructor'    => $dojo->instructor ? $dojo->instructor->name : 'Unassigned',
                'instructor_id' => $dojo->instructor_id,
                'phone'         => $dojo->phone,
                'status'        => $dojo->status,
                'address'       => $dojo->address, // Removed the trailing spaces you had here
                'location_url'  => $dojo->location_url,
                'image'         => $dojo->image,
                'created_at'    => $dojo->created_at,
                'students'      => $dojo->students_count 
            ];
        });

        return response()->json($mappedDojos);
    }

    public function show($id)
    {
        return Dojo::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name'          => 'required|string|max:255',
            'instructor_id' => 'required|exists:instructors,id',
            'phone'         => 'required|string',
            'status'        => 'required|string',
            'address'       => 'nullable|string',
            'location_url'  => 'nullable|url',
            'image'         => 'nullable|url'
        ]);

        $dojo = Dojo::create($validatedData);
        return response()->json($dojo, 201);
    }

    public function update(Request $request, $id)
    {
        $dojo = Dojo::findOrFail($id);
        
        // FIXED: Now we strictly validate updates too, preventing unknown column errors
        $validatedData = $request->validate([
            'name'          => 'sometimes|required|string|max:255',
            'instructor_id' => 'sometimes|required|exists:instructors,id',
            'phone'         => 'sometimes|required|string',
            'status'        => 'sometimes|required|string',
            'address'       => 'nullable|string',
            'location_url'  => 'nullable|url',
            'image'         => 'nullable|url'
        ]);

        $dojo->update($validatedData);
        return response()->json($dojo);
    }

    public function destroy($id)
    {
        Dojo::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}