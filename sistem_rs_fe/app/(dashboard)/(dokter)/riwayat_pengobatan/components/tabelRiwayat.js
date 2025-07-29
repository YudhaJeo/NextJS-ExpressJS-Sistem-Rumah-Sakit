'use client';

import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const TabelPengobatan = ({ data, loading, onEdit, onDelete, onUploadFoto }) => {
  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const tgl = new Date(tanggal);
    if (isNaN(tgl)) return "-";
    return tgl.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const fotoBodyTemplate = (rowData) => {
    return rowData.FOTOPROFIL ? (
      <img 
        src={`http://localhost:4000/uploads/riwayat_pengobatan/${rowData.FOTOPROFIL}`} 
        alt="foto" 
        width="100" 
        style={{ borderRadius: '5px' }} 
      />
    ) : (
      <span className="text-gray-400">Belum ada foto</span>
    );
  };

  const actionBody = (row) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-upload"
        size="small"
        severity="success"
        tooltip="Upload Foto"
        onClick={() => onUploadFoto(row)}
      />
      <Button
        icon="pi pi-pencil"
        size="small"
        severity="warning"
        onClick={() => onEdit(row)}
        tooltip="Edit"
      />
      <Button
        icon="pi pi-trash"
        size="small"
        severity="danger"
        onClick={() => onDelete(row)}
        tooltip="Hapus"
      />
    </div>
  );

  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      loading={loading}
      stripedRows
      responsiveLayout="scroll"
    >
      <Column field="NAMALENGKAP" header="Nama Pasien" />
      <Column field="NIK" header="NIK" />
      <Column 
        field="TANGGALKUNJUNGAN" 
        header="Tgl Kunjungan" 
        body={(row) => formatTanggal(row.TANGGALKUNJUNGAN)} 
      />
      <Column field="KELUHAN" header="Keluhan" />
      <Column field="POLI" header="Poli" />
      <Column field="STATUSKUNJUNGAN" header="Status Kunjungan" />
      <Column field="NAMADOKTER" header="Dokter" />
      <Column field="STATUSRAWAT" header="Status Rawat" />
      <Column field="DIAGNOSA" header="Diagnosa" />
      <Column field="OBAT" header="Obat" />
      <Column header="Foto Profil" body={fotoBodyTemplate} style={{ width: "120px" }} />
      <Column header="Aksi" body={actionBody} style={{ width: "220px" }} />
    </DataTable>
  );
};

export default TabelPengobatan;
