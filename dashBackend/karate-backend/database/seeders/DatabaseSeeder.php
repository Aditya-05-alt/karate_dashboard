<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Check if the user exists first to avoid duplicate errors
        if (!User::where('email', 'sensei@dojo.com')->exists()) {
            User::create([
                'name' => 'Sensei',
                'email' => 'sensei@dojo.com',
                'password' => Hash::make('password123'),
                // 'status' => 'Active', // Uncomment if you added a status column to users
            ]);
        }
    }
}
