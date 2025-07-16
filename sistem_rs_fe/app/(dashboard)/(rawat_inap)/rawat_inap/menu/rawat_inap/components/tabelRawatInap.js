// app\(dashboard)\(rawat_inap)\rawat_inap\menu\rawat_inap\components\tabelTindakan.js
'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import React from 'react';
import { Tag } from 'primereact/tag';

const TabelRawatInap = ({ data, loading, onEdit, onDelete }) => {

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const tgl = new Date(tanggal);
    return tgl.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <DataTable value={data} paginator rows={10} loading={loading} size="small" scrollable>
      <Column field="IDRAWATINAP" header="ID" />
      <Column
        field="IDPASIEN"
        header="Pasien"
        body={(row) => row.NAMALENGKAP}
      />
      <Column
        field="IDKAMAR"
        header="Kamar"
        body={(row) => row.NAMAKAMAR}
      />
      <Column
        field="IDBED"
        header="Kamar"
        body={(row) => row.NOMORBED}
      />
      <Column 
        field="TANGGALMASUK" 
        header="Masuk" 
        body={(row) => formatTanggal(row.TANGGALMASUK)} 
      />
      <Column 
        field="TANGGALKELUAR" 
        header="Keluar" 
        body={(row) => formatTanggal(row.TANGGALKELUAR)} 
      />

      <Column
        header="Status"
        body={(row) => {
          const status = row.STATUS || 'Tidak Diketahui';
          const severity = () => {
            switch (status) {
              case "AKTIF":
                return "success";
              case "SELESAI":
                return "danger"; 
              default:
                return "info"; 
            }
          };

          return <Tag 
          value={status.toLowerCase().replace(/^\w/, c => c.toUpperCase())} 
          severity={severity()} 
        />
        ;
        }}
      />
      <Column field="CATATAN" header="Catatan" />
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

export default TabelRawatInap;
