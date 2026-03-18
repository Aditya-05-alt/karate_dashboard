<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    // GET: /api/students
    public function index()
    {
        // Fetch students and include their dojo and instructor names
        $students = Student::with(['dojo', 'instructor'])->orderBy('created_at', 'desc')->get();
        
        // Map data to match React table expectations (optional but helpful)
        $mappedStudents = $students->map(function($student) {
            return [
                'id' => $student->id,
                'name' => $student->name,
                'rank' => $student->rank,
                'dob' => $student->dob,
                'phone' => $student->phone,
                'age' => $student->age,
                'status' => $student->status,
                'dojo' => $student->dojo ? $student->dojo->name : 'N/A', // Flattening for the table
                'instructors' => $student->instructor ? $student->instructor->name : 'N/A',
                'dojo_id' => $student->dojo_id,
                'instructor_id' => $student->instructor_id,
            ];
        });

        return response()->json($mappedStudents);
    }

    // POST: /api/students
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'rank' => 'nullable|string',
            'dob' => 'required|date',
            'phone' => 'nullable|string',
            'age' => 'nullable|integer',
            'status' => 'nullable|string',
            'dojo_id' => 'required|exists:dojos,id',
            'instructor_id' => 'required|exists:instructors,id',
        ]);

        $student = Student::create($validatedData);

        return response()->json([
            'message' => 'Student created successfully',
            'student' => $student
        ], 201);
    }

    // GET: /api/students/{id}
    public function show($id)
    {
        $student = Student::with(['dojo', 'instructor'])->findOrFail($id);
        return response()->json($student);
    }

    // PUT: /api/students/{id}
    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'rank' => 'sometimes|nullable|string',
            'dob' => 'sometimes|required|date',
            'phone' => 'sometimes|nullable|string',
            'age' => 'sometimes|nullable|integer',
            'status' => 'sometimes|nullable|string',
            'dojo_id' => 'sometimes|required|exists:dojos,id',
            'instructor_id' => 'sometimes|required|exists:instructors,id',
        ]);

        $student->update($validatedData);

        return response()->json([
            'message' => 'Student updated successfully',
            'student' => $student
        ]);
    }

    // DELETE: /api/students/{id}
    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return response()->json(['message' => 'Student deleted successfully']);
    }
}