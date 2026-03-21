<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use Illuminate\Http\Request;

class InstructorController extends Controller
{
    // GET /api/instructors
    public function index()
    {
        // 1. Fetch instructors and dynamically COUNT their related students and dojos
        $instructors = Instructor::withCount(['students', 'dojos'])->get();

        // 2. Map the data so React gets the counts easily
        $mappedInstructors = $instructors->map(function($instructor) {
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
                // THE MAGIC: Appending the dynamic counts
                'students' => $instructor->students_count,
                'dojos'    => $instructor->dojos_count,
            ];
        });

        return response()->json($mappedInstructors, 200);
    }

    // POST /api/instructors
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'rank'   => 'required|string|max:255',
            'age'    => 'required|integer|min:18',
            'email'  => 'required|email|unique:instructors,email',
            'phone'  => 'required|string|max:20',
            'status' => 'required|string',
            'image'  => 'required|url',
            'dob'    => 'required|date',
        ]);

        $instructor = Instructor::create($validated);
        return response()->json($instructor, 201);
    }

    // GET /api/instructors/{id}
    public function show($id)
    {
        // Also fetch counts when viewing a single instructor just in case
        $instructor = Instructor::withCount(['students', 'dojos'])->find($id);
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
            'name'   => 'required|string|max:255',
            'rank'   => 'required|string|max:255',
            'age'    => 'required|integer',
            'email'  => 'required|email|unique:instructors,email,' . $id,
            'phone'  => 'required|string',
            'status' => 'required|string',
            'image'  => 'required|url',
            'dob'    => 'required|date',
        ]);

        $instructor->update($validated);
        return response()->json($instructor, 200);
    }

    // DELETE /api/instructors/{id}
    public function destroy($id)
    {
        $instructor = Instructor::find($id);
        if (!$instructor) {
            return response()->json(['message' => 'Instructor not found'], 404);
        }
        $instructor->delete();
        return response()->json(['message' => 'Instructor deleted'], 200);
    }
}