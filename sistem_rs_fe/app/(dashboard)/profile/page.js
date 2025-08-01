'use client'

import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Avatar } from 'primereact/avatar'
import { Divider } from 'primereact/divider'
import { Tag } from 'primereact/tag'
import { Panel } from 'primereact/panel'
import { Skeleton } from 'primereact/skeleton'
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
    JENISTENAGANONMEDIS: '',
    JENISTENAGAMEDIS: '',
    NOSTR: '',
    TGLEXPSTR: '',
    NOSIP: '',
    TGLEXPSIP: '',
    DOKUMENPENDUKUNG: ''
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

      console.log("[DEBUG]Data:", data)
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

  const ProfileField = ({ label, value, icon }) => (
    <div className="mb-4">
      <div className="flex align-items-center mb-2">
        {icon && <i className={`${icon} text-500 mr-2`}></i>}
        <span className="text-sm font-medium text-600">{label}</span>
      </div>
      <div className="text-900 font-semibold">
        {value || '-'}
      </div>
    </div>
  )

  const getRoleTagSeverity = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'danger'
      case 'dokter': return 'success'
      case 'perawat': return 'info'
      default: return 'secondary'
    }
  }

  if (loading) {
    return (
      <div className="p-4">
        <Card className="shadow-2">
          <div className="grid">
            <div className="col-12 md:col-4">
              <div className="flex flex-column align-items-center">
                <Skeleton shape="circle" size="8rem" className="mb-3"></Skeleton>
                <Skeleton width="10rem" height="2rem" className="mb-2"></Skeleton>
                <Skeleton width="8rem" height="1rem"></Skeleton>
              </div>
            </div>
            <div className="col-12 md:col-8">
              <Skeleton width="100%" height="2rem" className="mb-3"></Skeleton>
              <Skeleton width="100%" height="1.5rem" className="mb-2"></Skeleton>
              <Skeleton width="80%" height="1.5rem" className="mb-2"></Skeleton>
              <Skeleton width="60%" height="1.5rem"></Skeleton>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-900 m-0">Profil Pengguna</h2>
        <p className="text-600 mt-1">Kelola informasi profil dan pengaturan akun Anda</p>
      </div>

      {/* Main Profile Card */}
      <Card className="shadow-2 mb-4">
        <div className="grid">
          {/* Left Section - Editable Info */}
          <div className="col-12 md:col-4">
            <div className="flex flex-column align-items-center text-center">
              {/* Avatar */}
              <div className="mb-4">
                {user.FOTOPROFIL ? (
                  <Avatar 
                    image={user.FOTOPROFIL} 
                    size="xlarge" 
                    shape="circle"
                    className="shadow-3"
                  />
                ) : (
                  <Avatar 
                    icon="pi pi-user" 
                    size="xlarge" 
                    shape="circle"
                    className="bg-gray-100 text-gray-600 shadow-3"
                  />
                )}
              </div>
              
              {/* Name and Role */}
              <h3 className="text-xl font-bold text-900 mb-2">{user.NAMALENGKAP || 'Nama tidak tersedia'}</h3>
              {user.ROLE && (
                <Tag 
                  value={user.ROLE} 
                  severity={getRoleTagSeverity(user.ROLE)}
                  className="mb-3"
                />
              )}
              
              {/* Contact Info */}
              <div className="w-full text-left">
                <ProfileField 
                  label="Email" 
                  value={user.EMAIL} 
                  icon="pi pi-envelope"
                />
                <ProfileField 
                  label="No. Telepon" 
                  value={user.NOHP} 
                  icon="pi pi-phone"
                />
              </div>
            </div>
          </div>

          {/* Right Section - Personal Info */}
          <div className="col-12 md:col-8">
            <Panel header="Informasi Personal" className="mb-4">
              <div className="grid">
                <div className="col-12 md:col-6">
                  <ProfileField 
                    label="Tempat Lahir" 
                    value={user.TEMPATLAHIR} 
                    icon="pi pi-map-marker"
                  />
                </div>
                <div className="col-12 md:col-6">
                  <ProfileField 
                    label="Tanggal Lahir" 
                    value={formatTanggal(user.TANGGALLAHIR)} 
                    icon="pi pi-calendar"
                  />
                </div>
                <div className="col-12 md:col-6">
                  <ProfileField 
                    label="Jenis Kelamin" 
                    value={formatGender(user.JENISKELAMIN)} 
                    icon="pi pi-user"
                  />
                </div>
                <div className="col-12 md:col-6">
                  <ProfileField 
                    label="Status Kepegawaian" 
                    value={user.STATUSKEPEGAWAIAN} 
                    icon="pi pi-briefcase"
                  />
                </div>
              </div>
            </Panel>

            <Panel header="Informasi Pekerjaan" className="mb-4">
              <div className="grid">
                <div className="col-12 md:col-6">
                  <ProfileField 
                    label="Unit Kerja" 
                    value={user.UNITKERJA} 
                    icon="pi pi-building"
                  />
                </div>
                <div className="col-12 md:col-6">
                  <ProfileField 
                    label="Spesialisasi" 
                    value={user.SPESIALISASI} 
                    icon="pi pi-star"
                  />
                </div>
                <div className="col-12">
                  <ProfileField 
                    label="Jenis Tenaga" 
                    value={user.JENISTENAGAMEDIS || user.JENISTENAGANONMEDIS} 
                    icon="pi pi-users"
                  />
                </div>
              </div>
            </Panel>

            {/* Medical Credentials - Only show if user has STR */}
            {user.NOSTR && (
              <Panel header="Kredensial Medis" className="mb-4">
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <ProfileField 
                      label="No. STR" 
                      value={user.NOSTR} 
                      icon="pi pi-id-card"
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <ProfileField 
                      label="Tanggal Exp STR" 
                      value={formatTanggal(user.TGLEXPSTR)} 
                      icon="pi pi-calendar-times"
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <ProfileField 
                      label="No. SIP" 
                      value={user.NOSIP} 
                      icon="pi pi-id-card"
                    />
                  </div>
                  <div className="col-12 md:col-6">
                    <ProfileField 
                      label="Tanggal Exp SIP" 
                      value={formatTanggal(user.TGLEXPSIP)} 
                      icon="pi pi-calendar-times"
                    />
                  </div>
                  <div className="col-12">
                    <div className="mb-4">
                      <div className="flex align-items-center mb-2">
                        <i className="pi pi-file text-500 mr-2"></i>
                        <span className="text-sm font-medium text-600">Dokumen Pendukung</span>
                      </div>
                      <div className="text-900 font-semibold">
                        {user.DOKUMENPENDUKUNG ? (
                          <Button 
                            label="Lihat Dokumen" 
                            icon="pi pi-external-link" 
                            link
                            onClick={() => window.open(`http://localhost:4000${user.DOKUMENPENDUKUNG}`, '_blank')}
                          />
                        ) : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>
            )}
          </div>
        </div>

        <Divider />

        {/* Action Buttons */}
        <div className="flex justify-content-end gap-3 pt-3">
          <Button 
            label="Edit Profil" 
            icon="pi pi-pencil" 
            onClick={() => setDialogVisible(true)}
            className="p-button-outlined"
          />
          <Button 
            label="Logout" 
            icon="pi pi-sign-out" 
            severity="danger" 
            onClick={handleLogout}
          />
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