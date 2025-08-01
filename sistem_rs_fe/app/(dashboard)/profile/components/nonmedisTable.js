// sistem_rs_fe\app\(dashboard)\profile\components\nonmedisTable.js
'use client'

import { Panel } from 'primereact/panel'

export default function NonMedisTable({ user, formatTanggal, formatGender }) {
  const ProfileField = ({ label, value, icon }) => (
    <div className="mb-4">
      <div className="flex align-items-center mb-2">
        {icon && <i className={`${icon} text-500 mr-2`}></i>}
        <span className="text-sm font-medium text-600">{label}</span>
      </div>
      <div className="text-900 font-semibold">{value || '-'}</div>
    </div>
  )

  return (
    <div className="col-12 md:col-8">
      <Panel header="Informasi Personal" className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-6"><ProfileField label="Tempat Lahir" value={user.TEMPATLAHIR} icon="pi pi-map-marker" /></div>
          <div className="col-12 md:col-6"><ProfileField label="Tanggal Lahir" value={formatTanggal(user.TANGGALLAHIR)} icon="pi pi-calendar" /></div>
          <div className="col-12 md:col-6"><ProfileField label="Jenis Kelamin" value={formatGender(user.JENISKELAMIN)} icon="pi pi-user" /></div>
          <div className="col-12 md:col-6"><ProfileField label="Status Kepegawaian" value={user.STATUSKEPEGAWAIAN} icon="pi pi-briefcase" /></div>
        </div>
      </Panel>

      <Panel header="Informasi Pekerjaan" className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-6"><ProfileField label="Unit Kerja" value={user.UNITKERJA} icon="pi pi-building" /></div>
          <div className="col-12 md:col-6"><ProfileField label="Spesialisasi" value={user.SPESIALISASI} icon="pi pi-star" /></div>
          <div className="col-12"><ProfileField label="Jenis Tenaga" value={user.JENISTENAGANONMEDIS} icon="pi pi-users" /></div>
        </div>
      </Panel>
    </div>
  )
}
