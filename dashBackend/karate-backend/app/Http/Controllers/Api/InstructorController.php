<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use App\Models\Dojo;
use Illuminate\Http\Request;

class InstructorController extends Controller
{
    // GET /api/instructors
    public function index()
    {
        // 1. Eager load 'dojos' (to get their names) AND count the relationships
        $instructors = Instructor::with('dojos')->withCount(['students', 'dojos'])->get();

        // 2. Map the data
        $mappedInstructors = $instructors->map(function($instructor) {
            
            // Pluck the names of all assigned dojos and join them with a comma
            // If the instructor has no dojos, it returns an empty string
            $dojoNames = $instructor->dojos->pluck('name')->join(', ');

            return [
                'id'       => $instructor->id,
                'name'     => $instructor->name,
                'rank'     => $instructor->rank,
                'age'      => $instructor->age,
                'email'    => $instructor->email,
                'phone'    => $instructor->phone,
                'status'   => $instructor->status,
                'image'    => $instructor->image,
                'dob'      => $instructor->dob,
                
                // LIVE COUNTS
                'students' => $instructor->students_count,
                'dojos'    => $instructor->dojos_count,
                
                // THE NEW DOJO NAME FIELD (Used in the table and modal)
                'dojo'     => $dojoNames ?: 'Unassigned',
            ];
        });

        return response()->json($mappedInstructors, 200);
    }

    // POST /api/instructors
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'rank'     => 'required|string|max:255',
            'age'      => 'required|integer|min:18',
            'email'    => 'required|email|unique:instructors,email',
            'phone'    => 'required|string|max:20',
            'status'   => 'required|string',
            'image'    => 'required|url',
            'dob'      => 'required|date',
            'dojo_ids' => 'array|nullable' // Accept the array from React
        ]);

        $instructor = Instructor::create($validated);

        // Assign the Dojos to this new instructor
        if ($request->has('dojo_ids') && !empty($request->dojo_ids)) {
            Dojo::whereIn('id', $request->dojo_ids)
                ->update(['instructor_id' => $instructor->id]);
        }

        return response()->json($instructor, 201);
    }

    // GET /api/instructors/{id}
    public function show($id)
    {
        // Must load 'dojos' so the React Edit Form can pre-select the checkboxes
        $instructor = Instructor::with('dojos')->withCount(['students', 'dojos'])->find($id);
        if (!$instructor) {
            return response()->json(['message' => 'Instructor not found'], 404);
        }
        return response()->json($instructor, 200);
    }

    // PUT/PATCH /api/instructors/{id}
    public function update(Request $request, $id)
    {
        $instructor = Instructor::find($id);
        if (!$instructor) {
            return response()->json(['message' => 'Instructor not found'], 404);
        }

        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'rank'     => 'required|string|max:255',
            'age'      => 'required|integer',
            'email'    => 'required|email|unique:instructors,email,' . $id,
            'phone'    => 'required|string',
            'status'   => 'required|string',
            'image'    => 'required|url',
            'dob'      => 'required|date',
            'dojo_ids' => 'array|nullable' // Accept the array from React
        ]);

        $instructor->update($validated);

        // Sync Dojos: First remove all current links, then add the new ones
        if ($request->has('dojo_ids')) {
            // 1. Unassign all Dojos currently assigned to this instructor
            Dojo::where('instructor_id', $instructor->id)->update(['instructor_id' => null]);
            
            // 2. Assign the newly selected Dojos
            if (!empty($request->dojo_ids)) {
                Dojo::whereIn('id', $request->dojo_ids)
                    ->update(['instructor_id' => $instructor->id]);
            }
        }

        return response()->json($instructor, 200);
    }

    // DELETE /api/instructors/{id}
    public function destroy($id)
    {
        $instructor = Instructor::find($id);
        if (!$instructor) {
            return response()->json(['message' => 'Instructor not found'], 404);
        }
        
        // Remove the instructor's ID from any linked Dojos before deleting
        Dojo::where('instructor_id', $instructor->id)->update(['instructor_id' => null]);
        
        $instructor->delete();
        return response()->json(['message' => 'Instructor deleted'], 200);
    }
}