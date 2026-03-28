<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dojo;

class DojoController extends Controller
{
    public function index()
    {
        // 1. Eager load 'instructors' (plural) instead of 'instructor'
        $dojos = Dojo::with('instructors')->withCount('students')->get();

        $mappedDojos = $dojos->map(function($dojo) {
            
            // 2. Pluck the names of all assigned instructors and join them
            $instructorNames = $dojo->instructors->pluck('name')->join(', ');

            return [
                'id'             => $dojo->id,
                'name'           => $dojo->name,
                'instructor'     => $instructorNames ?: 'Unassigned',
                // Send back an array of IDs just in case React needs them for a multi-select
                'instructor_ids' => $dojo->instructors->pluck('id')->toArray(),
                'phone'          => $dojo->phone,
                'status'         => $dojo->status,
                'address'        => $dojo->address,
                'location_url'   => $dojo->location_url,
                'image'          => $dojo->image,
                'created_at'     => $dojo->created_at,
                'students'       => $dojo->students_count 
            ];
        });

        return response()->json($mappedDojos);
    }

    public function show($id)
    {
        // Eager load instructors so React gets the assigned data when editing
        $dojo = Dojo::with('instructors')->findOrFail($id);
        return response()->json($dojo, 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name'           => 'required|string|max:255',
            'phone'          => 'required|string',
            'status'         => 'required|string',
            'address'        => 'nullable|string',
            'location_url'   => 'nullable|url',
            'image'          => 'nullable|url',
            // Changed from instructor_id to instructor_ids array
            'instructor_ids' => 'array|nullable' 
        ]);

        // Create the Dojo (Laravel will ignore instructor_ids because it's not in the $fillable array natively)
        $dojo = Dojo::create($validatedData);

        // Safely attach the instructors using the pivot table
        if ($request->has('instructor_ids')) {
            $dojo->instructors()->sync($request->instructor_ids);
        }

        return response()->json($dojo, 201);
    }

    public function update(Request $request, $id)
    {
        $dojo = Dojo::findOrFail($id);
        
        $validatedData = $request->validate([
            'name'           => 'sometimes|required|string|max:255',
            'phone'          => 'sometimes|required|string',
            'status'         => 'sometimes|required|string',
            'address'        => 'nullable|string',
            'location_url'   => 'nullable|url',
            'image'          => 'nullable|url',
            // Changed from instructor_id to instructor_ids array
            'instructor_ids' => 'array|nullable'
        ]);

        $dojo->update($validatedData);

        // Sync Instructors safely
        if ($request->has('instructor_ids')) {
            $dojo->instructors()->sync($request->instructor_ids);
        }

        return response()->json($dojo);
    }

    public function destroy($id)
    {
        $dojo = Dojo::findOrFail($id);
        
        // Detach all instructors before deleting to prevent orphaned data
        $dojo->instructors()->detach();
        
        $dojo->delete();
        
        return response()->json(['message' => 'Deleted']);
    }
}