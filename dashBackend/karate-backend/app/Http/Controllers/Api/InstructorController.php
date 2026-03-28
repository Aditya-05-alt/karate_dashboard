<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use App\Models\Dojo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'name'       => 'required|string|max:255',
            'rank'       => 'required|string|max:255',
            'age'        => 'required|integer|min:18',
            'email'      => 'required|email|unique:instructors,email',
            'phone'      => 'required|string|max:20',
            'status'     => 'required|string',
            'dob'        => 'required|date',
            'dojo_ids'   => 'array|nullable',
            // Image fields are now nullable because they can send either one
            'image'      => 'nullable|url',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5048', // Max 5MB file
        ]);

        $imagePath = null;

        // Check if a physical file was uploaded
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('instructors', 'public');
            $imagePath = asset('storage/' . $path);
        } 
        // Or if they just pasted a URL
        elseif ($request->filled('image')) {
            $imagePath = $request->image;
        }

        // Add the correct image path back into the data array before saving
        $validated['image'] = $imagePath;

        $instructor = Instructor::create($validated);

        // Assign the Dojos to this new instructor using Many-to-Many sync
        if ($request->has('dojo_ids')) {
            $instructor->dojos()->sync($request->dojo_ids);
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
            'name'       => 'required|string|max:255',
            'rank'       => 'required|string|max:255',
            'age'        => 'required|integer',
            'email'      => 'required|email|unique:instructors,email,' . $id,
            'phone'      => 'required|string',
            'status'     => 'required|string',
            'dob'        => 'required|date',
            'dojo_ids'   => 'array|nullable',
            'image'      => 'nullable|url',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5048',
        ]);

        $imagePath = $instructor->image; // Keep current image by default

        // Check if a new file was uploaded
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('instructors', 'public');
            $imagePath = asset('storage/' . $path);
        } 
        // Or if they pasted a new URL
        elseif ($request->filled('image')) {
            $imagePath = $request->image;
        }

        $validated['image'] = $imagePath;

        $instructor->update($validated);

        // Sync Dojos: Laravel automatically adds new ones and removes unselected ones seamlessly
        if ($request->has('dojo_ids')) {
            $instructor->dojos()->sync($request->dojo_ids);
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
        
        // Safely detach all dojos from the pivot table before deleting
        $instructor->dojos()->detach();
        
        $instructor->delete();
        return response()->json(['message' => 'Instructor deleted'], 200);
    }
}