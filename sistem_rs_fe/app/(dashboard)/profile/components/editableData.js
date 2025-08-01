// sistem_rs_fe\app\(dashboard)\profile\components\editableData.js
'use client'

import { Avatar } from 'primereact/avatar'
import { Tag } from 'primereact/tag'
import { Skeleton } from 'primereact/skeleton'

export default function EditableData({ user, setDialogVisible, loading }) {
  const ProfileField = ({ label, value, icon }) => (
    <div className="mb-4">
      <div className="flex align-items-center mb-2">
        {icon && <i className={`${icon} text-500 mr-2`}></i>}
        <span className="text-sm font-medium text-600">{label}</span>
      </div>
      <div className="text-900 font-semibold">{value || '-'}</div>
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
      <div className="col-12 md:col-4">
        <div className="flex flex-column align-items-center">
          <Skeleton shape="circle" size="8rem" className="mb-3"></Skeleton>
          <Skeleton width="10rem" height="2rem" className="mb-2"></Skeleton>
          <Skeleton width="8rem" height="1rem"></Skeleton>
        </div>
      </div>
    )
  }

  return (
    <div className="col-12 md:col-4">
      <div className="flex flex-column align-items-center text-center">
        <div className="mb-4">
          {user.FOTOPROFIL ? (
            <Avatar image={user.FOTOPROFIL} size="xlarge" shape="circle" className="shadow-3" />
          ) : (
            <Avatar icon="pi pi-user" size="xlarge" shape="circle" className="bg-gray-100 text-gray-600 shadow-3" />
          )}
        </div>

        <h3 className="text-xl font-bold text-900 mb-2">{user.NAMALENGKAP || 'Nama tidak tersedia'}</h3>
        {user.ROLE && <Tag value={user.ROLE} severity={getRoleTagSeverity(user.ROLE)} className="mb-3" />}

        <div className="w-full text-left">
          <ProfileField label="Email" value={user.EMAIL} icon="pi pi-envelope" />
          <ProfileField label="No. Telepon" value={user.NOHP} icon="pi pi-phone" />
        </div>
      </div>
    </div>
  )
}
