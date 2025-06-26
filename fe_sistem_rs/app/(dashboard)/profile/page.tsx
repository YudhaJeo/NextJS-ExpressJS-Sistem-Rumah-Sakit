'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function ProfilePage() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const name = Cookies.get('username');
    if (name) setUsername(name);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profil Pengguna</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nama Pengguna</label>
          <div className="mt-1 border rounded px-3 py-2 text-gray-900 bg-gray-100">
            {username || 'Tidak diketahui'}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1 border rounded px-3 py-2 text-gray-900 bg-gray-100">
            rara@example.com {/* Ganti sesuai data dinamis jika pakai context/auth */}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <div className="mt-1 border rounded px-3 py-2 text-gray-900 bg-gray-100">
            Admin
          </div>
        </div>

        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Edit Profil
        </button>
      </div>
    </div>
  );
}
