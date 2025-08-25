'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const TabelPasien = ({ data, loading, onEdit, onDelete }) => {
  return (
    <DataTable value={data} paginator rows={10} loading={loading} size="small" scrollable>
      <Column field="NAMALENGKAP" header="Nama Lengkap" sortable />
      <Column field="NOREKAMMEDIS" header="No Rekam Medis" />
      <Column field="NIK" header="NIK" />
      <Column
        field="TANGGALLAHIR"
        header="Tgl Lahir"
        body={(row) => {
          const tanggal = new Date(row.TANGGALLAHIR);
          return tanggal.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
        }}
      />
      <Column field="JENISKELAMIN" header="JK" />
      <Column field="ALAMAT" header="Alamat Domisili" />
      <Column field="ALAMAT_KTP" header="Alamat KTP" />
      <Column field="NOHP" header="No HP" />
      <Column field="USIA" header="Usia" />
      <Column field="NAMAAGAMA" header="Agama" />
      <Column field="GOLDARAH" header="Gol. Darah" />
      <Column field="NAMAASURANSI" header="Asuransi" />
      <Column
        field="NOASURANSI"
        header="No Asuransi"
        body={(row) => row.NOASURANSI?.trim() || '-'}
      />
      <Column
        field="TANGGALDAFTAR"
        header="Tgl Daftar"
        body={(row) => {
          const tanggal = new Date(row.TANGGALDAFTAR ?? '');
          return tanggal.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
        }}
      />
      <Column
        header="Aksi"
        body={(row) => (
          <div className="flex gap-2">
            <Button
              icon="pi pi-pencil"
              size="small"
              severity="warning"
              onClick={() => onEdit(row)}
            />
            <Button
              icon="pi pi-trash"
              size="small"
              severity="danger"
              onClick={() => onDelete(row)}
            />
          </div>
        )}
        style={{ width: '150px' }}
      />
    </DataTable>
  );
};

export default TabelPasien;