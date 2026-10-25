<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Admin User',      'email' => 'admin@pharmacy.test',      'role' => 'admin'],
            ['name' => 'Pharmacist User', 'email' => 'pharmacist@pharmacy.test', 'role' => 'pharmacist'],
            ['name' => 'Customer User',   'email' => 'customer@pharmacy.test',   'role' => 'customer'],
        ];

        foreach ($users as $data) {
            // forceFill because 'role' is deliberately NOT in $fillable
            // (so nobody can sign themselves up as admin through the register form)
            $user = User::firstOrNew(['email' => $data['email']]);
            $user->forceFill([
                'name'     => $data['name'],
                'role'     => $data['role'],
                'password' => Hash::make('password'),   // demo only, change before any real use
            ])->save();
        }
    }
}