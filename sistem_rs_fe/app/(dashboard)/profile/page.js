'use client'

import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import FormDialogProfile from './components/formDialogProfile'
import ToastNotifier from '@/app/components/toastNotifier'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ProfilePage() {
  const [user, setUser] = useState({ username: '', email: '', nohp: '', role: '', profile: '' })
  const [loading, setLoading] = useState(true)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', nohp: '', role: '', fotoprofil: '', file: null })
  const [errors, setErrors] = useState({})
  const router = useRouter()
  const toastRef = useRef(null)

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) return router.push('/login')
    fetchData(token)
  }, [])

  const fetchData = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.data?.data) throw new Error('Data user kosong')

      const { username, email, nohp, role, profile } = res.data.data
      setUser({ username, email, nohp, role, profile })
      setForm({ username, email, nohp, role, profile, file: null })
    } catch (err) {
      console.error('Gagal ambil data:', err)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    confirmDialog({
      message: `Apakah anda yakin ingin logout?`,
      header: 'Konfirmasi Logout',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          toastRef.current?.showToast('00', 'Anda telah logout, silakan login kembali.')
          Cookies.remove('token')
          setTimeout(() => {
            router.push('/login')
          }, 300)
        } catch (err) {
          console.error('Gagal Logout:', err)
          toastRef.current?.showToast('01', 'Gagal Logout')
        }
      },
    })
  }

  const handleSave = async (newData) => {
    const token = Cookies.get('token')
    try {
      const formData = new FormData()
      formData.append('username', newData.username)
      formData.append('email', newData.email)
      formData.append('nohp', newData.nohp || '')
      if (newData.file) {
        formData.append('file', newData.file)
      }

      await axios.put(`${API_URL}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      // reload data dari database setelah update
      await fetchData(token)
      setDialogVisible(false)

      toastRef.current?.showToast('00', 'Data berhasil diperbarui')
    } catch (err) {
      console.error(err)
      toastRef.current?.showToast('01', 'Gagal memperbarui profile')
    }
  }

  return (
    <div className='card'>
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <div className="">
        <h3 className="text-xl font-semibold">Profil Pengguna</h3>
      </div>

      <div className="card w-full justify-center items-stretch mt-5">
        <div className="flex flex-col items-center space-y-4 mb-4">
          <div className="relative">
            {user.profile ? (
              <img
                src={user.profile}
                alt="Preview"
                style={{ maxWidth: '120px', maxHeight: '120px', objectFit: 'cover', borderRadius: '50%' }}
                className="w-24 h-24 rounded-full object-cover border shadow"
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100 border border-gray-300 shadow-inner">
                <i className="pi pi-user text-4xl text-gray-500"></i>
              </div>
            )}
          </div>
        </div>

        <div>
          <span className="text-gray-600 font-medium">Nama Pengguna:</span>
          <div className="card text-lg font-semibold mt-2">{user.username}</div>
        </div>

        <div className="my-4">
          <span className="text-gray-600 font-medium">Email:</span>
          <div className="card text-lg font-semibold mt-2">{user.email}</div>
        </div>

        <div className="my-4">
          <span className="text-gray-600 font-medium">No Telepon:</span>
          <div className="card text-lg font-semibold mt-2">{user.nohp}</div>
        </div>

        <div>
          <span className="text-gray-600 font-medium">Role:</span>
          <div className="card text-lg font-semibold mt-2 uppercase">{user.role}</div>
        </div>
      </div>

      <div className="card">
        <div className="flex gap-3 justify-end">
          <Button label="Edit Profil" icon="pi pi-pencil" onClick={() => setDialogVisible(true)} />
          <Button label="Logout" icon="pi pi-sign-out" severity="danger" onClick={handleLogout} />
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
  )
}
