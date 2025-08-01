// sistem_rs_fe\app\(dashboard)\profile\page.js
'use client'

import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import ToastNotifier from '@/app/components/toastNotifier'
import FormDialogProfile from './components/formDialogProfile'
import EditableData from './components/editableData'
import MedisTable from './components/medisTable'
import NonMedisTable from './components/nonmedisTable'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ProfilePage() {
  const [user, setUser] = useState({})
  const [form, setForm] = useState({ NAMALENGKAP: '', EMAIL: '', NOHP: '', FOTOPROFIL: '', file: null })
  const [loading, setLoading] = useState(true)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [errors, setErrors] = useState({})
  const toastRef = useRef(null)
  const router = useRouter()

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
      setForm({ NAMALENGKAP: data.NAMALENGKAP, EMAIL: data.EMAIL, NOHP: data.NOHP, FOTOPROFIL: data.FOTOPROFIL, file: null })
    } catch (err) {
      console.error('Gagal ambil data:', err)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-"
    const tgl = new Date(tanggal)
    return tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const formatGender = (gender) => {
    if (!gender) return "-"
    return gender === "L" ? "Laki-laki" : "Perempuan"
  }

  const handleLogout = () => {
    confirmDialog({
      message: `Apakah anda yakin ingin logout?`,
      header: 'Konfirmasi Logout',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        toastRef.current?.showToast('00', 'Anda telah logout, silakan login kembali.')
        Cookies.remove('token')
        setTimeout(() => router.push('/login'), 300)
      },
    })
  }

  const handleSave = async (newData) => {
    const token = Cookies.get('token')
    try {
      const formData = new FormData()
      formData.append('NAMALENGKAP', newData.NAMALENGKAP)
      formData.append('EMAIL', newData.EMAIL)
      formData.append('NOHP', newData.NOHP || '')
      if (newData.file) {
        formData.append('file', newData.file)
      }
  
      await axios.put(`${API_URL}/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
  
      await fetchData(token)
      setDialogVisible(false)
      toastRef.current?.showToast('00', 'Data berhasil diperbarui')
    } catch (err) {
      console.error('Update profil error:', err.response?.data || err)
      toastRef.current?.showToast('01', 'Gagal memperbarui profile')
    }
  }  

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <div className="mb-4">
        <h2 className="text-2xl font-bold text-900 m-0">Profil Pengguna</h2>
        <p className="text-600 mt-1">Kelola informasi profil dan pengaturan akun Anda</p>
      </div>

      <Card className="shadow-2 mb-4">
        <div className="grid">
          <EditableData user={user} setDialogVisible={setDialogVisible} loading={loading} />
          {user.NOSTR
            ? <MedisTable user={user} formatTanggal={formatTanggal} formatGender={formatGender} />
            : <NonMedisTable user={user} formatTanggal={formatTanggal} formatGender={formatGender} />}
        </div>

        <Divider />
        <div className="flex justify-content-end gap-3 pt-3">
          <Button label="Edit Profil" icon="pi pi-pencil" onClick={() => setDialogVisible(true)} className="p-button-outlined" />
          <Button label="Logout" icon="pi pi-sign-out" severity="danger" onClick={handleLogout} />
        </div>
      </Card>

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
