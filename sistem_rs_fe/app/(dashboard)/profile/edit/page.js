'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ProfilePage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const name = Cookies.get('username');
    const email = Cookies.get('email');
    const role = Cookies.get('role');

    if (name) setUsername(name);
    if (email) setEmail(email);
    if (role) setRole(role);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('username');
    Cookies.remove('email');
    Cookies.remove('role');
    router.push('/login');
  };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/auth/update-profile`, {
        username,
        email,
        role
      });
      alert('Profil berhasil diperbarui!');
    } catch (error) {
      console.error('Gagal update profil:', error);
      alert('Gagal menyimpan perubahan.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Pengguna</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nama Pengguna</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2 text-gray-900"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2 text-gray-900"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2 text-gray-900"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => router.back()}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-black"
          >
            Batal
          </button>

          <button
            onClick={handleSave}
            className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
          >
            Simpan
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600 ml-auto"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
