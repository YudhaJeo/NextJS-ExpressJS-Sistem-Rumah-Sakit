'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import FormDialogProfile from './components/formDialogProfile';
import ToastNotifier from '@/app/components/toastNotifier';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const [user, setUser] = useState({ username:'', email:'', role:'' });
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState({ username:'', email:'', role:'' });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const toastRef = useRef(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) return router.push('/login');
    fetchData(token);
  }, []);

  const fetchData = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.data);
      setForm(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  const handleSave = async (newData) => {
    const token = Cookies.get('token');
    try {
      await axios.put(`${API_URL}/profile`, newData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(newData);
      setDialogVisible(false);

      toastRef.current?.showToast('00', 'Data berhasil diperbarui');      
    } catch (err) {
      console.error(err);
      toastRef.current?.showToast('01', 'Gagal memperbarui profile');
    }
  };

  return (
  <div>
    <ToastNotifier ref={toastRef} />

    <div className="card">
      <h3 className="text-xl font-semibold">Profil Pengguna</h3>
    </div>

    <div className="card w-full justify-center items-stretch">
        <div className="">
          <div className="">
            <span className=" text-gray-600 font-medium">Nama Pengguna:</span>
            <div className="card text-lg font-semibold mt-1">{user.username}</div>
          </div>
        </div>

        <div className="my-4">
          <div className="">
            <span className=" text-gray-600 font-medium">Email:</span>
            <div className="card text-lg font-semibold mt-1">{user.email}</div>
          </div>
        </div>

        <div className="">
          <div className="">
            <span className=" text-gray-600 font-medium">Role:</span>
            <div className="card text-lg font-semibold mt-1 uppercase">{user.role}</div>
          </div>
        </div>
      </div>

    <div className="card">
      <div className="flex gap-3 justify-end">
        <Button
          label="Edit Profil"
          icon="pi pi-pencil"
          onClick={() => setDialogVisible(true)}
        />
        <Button
          label="Logout"
          icon="pi pi-sign-out"
          severity="danger"
          onClick={handleLogout}
        />
      </div>
    </div>
    
    <FormDialogProfile
      visible={dialogVisible}
      onHide={() => setDialogVisible(false)}
      onSubmit={handleSave}
      form={form}
      setForm={setForm}
      errors={errors}
      setErrors={setErrors}
    />
    
  </div>
    
  );
}
