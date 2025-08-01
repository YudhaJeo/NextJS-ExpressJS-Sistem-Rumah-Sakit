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
  const [user, setUser] = useState({
    NAMALENGKAP: '',
    EMAIL: '',
    NOHP: '',
    FOTOPROFIL: '',
    TEMPATLAHIR: '',
    TANGGALLAHIR: '',
    JENISKELAMIN: '',
    STATUSKEPEGAWAIAN: '',
    SPESIALISASI: '',
    UNITKERJA: '',
    JENISTENAGANONMEDIS: ''
  })  
  
  const [form, setForm] = useState({ 
    NAMALENGKAP: '', 
    EMAIL: '', 
    NOHP: '', 
    FOTOPROFIL: '', 
    file: null 
  })

  const [loading, setLoading] = useState(true)
  const [dialogVisible, setDialogVisible] = useState(false)
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
  
      const data = res.data.data
      setUser(data)
      setForm({ 
        NAMALENGKAP: data.NAMALENGKAP,
        EMAIL: data.EMAIL,
        NOHP: data.NOHP,
        FOTOPROFIL: data.FOTOPROFIL,
        file: null
      })
    } catch (err) {
      console.error('Gagal ambil data:', err)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }  

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const tgl = new Date(tanggal);
    return tgl.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatGender = (gender) => {
    if (!gender) return "-";
    return gender === "L" ? "Laki-laki" : "Perempuan";
  };
  

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
      formData.append('username', newData.NAMALENGKAP)
      formData.append('email', newData.EMAIL)
      formData.append('nohp', newData.NOHP || '')
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

      <div className='flex gap-5'>
        {/* Kiri(EDITABLE) */}
        <div className="card w-1/2 justify-center mt-5">
          <div className="flex flex-col items-center space-y-4 mb-4">
            <div className="relative">
              {user.FOTOPROFIL ? (
                <img
                  src={user.FOTOPROFIL}
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
            <div className="card text-lg font-semibold mt-2">{user.NAMALENGKAP}</div>
          </div>

          <div className="my-4">
            <span className="text-gray-600 font-medium">Email:</span>
            <div className="card text-lg font-semibold mt-2">{user.EMAIL}</div>
          </div>

          <div className="my-4">
            <span className="text-gray-600 font-medium">No Telepon:</span>
            <div className="card text-lg font-semibold mt-2">{user.NOHP}</div>
          </div>

          <div>
            <span className="text-gray-600 font-medium">Role:</span>
            <div className="card text-lg font-semibold mt-2 uppercase">{user.ROLE}</div>
          </div>
        </div>

        {/* Kanan (TIDAK EDITABLE) */}
        <div className='card w-1/2 justify-center mt-5'>
          <div>
            <span className="text-gray-600 font-medium">Tempat Lahir:</span>
            <div className="card text-lg font-semibold mt-2">{user.TEMPATLAHIR}</div>
          </div>

          <div className="my-4">
            <span className="text-gray-600 font-medium">Tanggal Lahir:</span>
            <div className="card text-lg font-semibold mt-2">{formatTanggal(user.TANGGALLAHIR)}</div>
          </div>

          <div className="my-4">
            <span className="text-gray-600 font-medium">Jenis Kelamin:</span>
            <div className="card text-lg font-semibold mt-2">{formatGender(user.JENISKELAMIN)}</div>
          </div>

          <div className="my-4">
            <span className="text-gray-600 font-medium">Status Kepegawaian:</span>
            <div className="card text-lg font-semibold mt-2">{user.STATUSKEPEGAWAIAN}</div>
          </div>

          <div className="my-4">
            <span className="text-gray-600 font-medium">Spesialisasi:</span>
            <div className="card text-lg font-semibold mt-2">{user.SPESIALISASI}</div>
          </div>

          <div className="my-4">
            <span className="text-gray-600 font-medium">Unit Kerja:</span>
            <div className="card text-lg font-semibold mt-2">{user.UNITKERJA}</div>
          </div>

          <div>
            <span className="text-gray-600 font-medium">Jenis Tenaga:</span>
            <div className="card text-lg font-semibold mt-2 uppercase">
              {user.JENISTENAGANONMEDIS}
            </div>
          </div>
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
