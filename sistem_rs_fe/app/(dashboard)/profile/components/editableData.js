'use client'

import { Skeleton } from 'primereact/skeleton'

export default function EditableData({ user, loading }) {
  if (loading) {
    return (
      <div className="col-12 md:col-4">
        <div className="flex flex-column align-items-center">
          <Skeleton shape="circle" size="10rem" className="mb-3" />
          <Skeleton width="12rem" height="2rem" className="mb-2" />
          <Skeleton width="8rem" height="1rem" />
        </div>
      </div>
    )
  }

  return (
    <div className="col-12 md:col-4">
      <div className="card align-items-center text-center">
        {/* foto profil */}
        <div className="flex justify-center mb-4">
          {user.FOTOPROFIL ? (
            <img
              src={user.FOTOPROFIL}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover border shadow"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100 border border-gray-300 shadow-inner">
              <i className="pi pi-user text-4xl text-gray-500"></i>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold">{user.NAMALENGKAP || 'Nama tidak tersedia'}</h2>

        <h4 className="card text-lg mt-5">
          <i className="pi pi-id-card text-lg text-gray-500 m-2"></i>
          {user.ROLE || 'Role tersedia'}
        </h4>
        <h4 className="card text-lg">
          <i className="pi pi-envelope text-lg text-gray-500 m-2"></i>
          {user.EMAIL || 'Email tersedia'}
        </h4>
        <h4 className="card text-lg">
          <i className="pi pi-phone text-lg text-gray-500 m-2"></i>
          {user.NOHP || 'Nomor telepon tersedia'}
        </h4>

      </div>
    </div>
  )
}
