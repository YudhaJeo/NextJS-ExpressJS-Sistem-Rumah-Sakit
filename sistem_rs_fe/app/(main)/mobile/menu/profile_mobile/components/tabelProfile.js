'use client'

import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Card } from "primereact/card";

export default function TabelProfile({ data, onEdit, loading }) {
  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <div className="flex flex-column align-items-center justify-content-center" style={{ minHeight: "300px" }}>
          <i className="pi pi-info-circle text-500" style={{ fontSize: "3rem" }}></i>
          <p className="mt-3 text-600">Tidak ada data profil.</p>
        </div>
      </Card>
    );
  }

  const MINIO_URL = process.env.NEXT_PUBLIC_MINIO_URL;
  const profile = data[0];
  const cleanPath = profile.FOTOLOGO?.startsWith("/")
    ? profile.FOTOLOGO.substring(1)
    : profile.FOTOLOGO;
  const imageUrl = profile.FOTOLOGO ? `${MINIO_URL}/${cleanPath}` : null;

  const ProfileField = ({ label, value, icon }) => (
    <div className="mb-4">
      <div className="flex align-items-center mb-2">
        {icon && <i className={`${icon} text-500 mr-2`}></i>}
        <span className="text-sm font-medium text-600">{label}</span>
      </div>
      <div className="text-900 font-semibold">{value || '-'}</div>
    </div>
  );

  return (
    <div className="grid">
      {/* Kolom Kiri - Profile Card */}
      <div className="col-12 md:col-4">
        <Card className="mb-4">
          <div className="flex flex-column align-items-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Profil"
                  className="border-circle w-10rem h-10rem mb-4 object-cover shadow-1"
                />
              ) : (
                <div className="w-10rem h-10rem border-circle surface-100 flex align-items-center justify-content-center mb-4 shadow-1">
                  <span className="pi pi-user text-4xl text-500"></span>
                </div>
              )}

            <h3 className="mt-0 mb-3 text-center text-900">{profile.NAMARS || "Nama RS"}</h3>

            <Button
              icon="pi pi-pencil"
              label="Edit Profil"
              className="w-full mb-4"
              outlined
              onClick={() => onEdit(profile)}
            />

            <div className="w-full">
              <ProfileField label="Email" value={profile.EMAIL} icon="pi pi-envelope" />
              <ProfileField label="Hotline" value={profile.NOMORHOTLINE} icon="pi pi-phone" />
              <ProfileField label="Telp Ambulan" value={profile.NOTELPAMBULAN} icon="pi pi-car" />
              <ProfileField label="WA Ambulan" value={profile.NOAMBULANWA} icon="pi pi-whatsapp" />
            </div>
          </div>
        </Card>
      </div>

      {/* Kolom Kanan - Detail Information */}
      <div className="col-12 md:col-8">
        <Panel header="Informasi Umum" className="mb-4">
          <div className="grid">
            <div className="col-12">
              <ProfileField label="Nama Rumah Sakit" value={profile.NAMARS} icon="pi pi-building" />
            </div>
            <div className="col-12">
              <ProfileField label="Alamat" value={profile.ALAMAT} icon="pi pi-map-marker" />
            </div>
            <div className="col-12 md:col-6">
              <ProfileField label="Email" value={profile.EMAIL} icon="pi pi-envelope" />
            </div>
            <div className="col-12 md:col-6">
              <ProfileField label="Nomor Hotline" value={profile.NOMORHOTLINE} icon="pi pi-phone" />
            </div>
          </div>
        </Panel>

        <Panel header="Layanan Ambulan" className="mb-4">
          <div className="grid">
            <div className="col-12 md:col-6">
              <ProfileField label="Telp Ambulan" value={profile.NOTELPAMBULAN} icon="pi pi-car" />
            </div>
            <div className="col-12 md:col-6">
              <ProfileField label="WhatsApp Ambulan" value={profile.NOAMBULANWA} icon="pi pi-whatsapp" />
            </div>
          </div>
        </Panel>

        <Panel header="Tentang Rumah Sakit" className="mb-4">
          <div className="grid">
            <div className="col-12">
              <ProfileField label="Deskripsi" value={profile.DESKRIPSI} icon="pi pi-align-left" />
            </div>
            <div className="col-12">
              <ProfileField label="Visi" value={profile.VISI} icon="pi pi-eye" />
            </div>
            <div className="col-12">
              <ProfileField label="Misi" value={profile.MISI} icon="pi pi-flag" />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}