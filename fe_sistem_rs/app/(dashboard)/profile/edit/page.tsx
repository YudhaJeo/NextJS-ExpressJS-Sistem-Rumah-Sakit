'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    router.push('/login');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Pengguna</h1>

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
            {email || 'Tidak diketahui'}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <div className="mt-1 border rounded px-3 py-2 text-gray-900 bg-gray-100">
            {role || 'Tidak diketahui'}
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          
          <Link href="/profile">
            <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
              Batal
            </button>
          </Link>

          <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
              Simpan 
          </button>
          
        </div>

      </div>
    </div>
  );
}
