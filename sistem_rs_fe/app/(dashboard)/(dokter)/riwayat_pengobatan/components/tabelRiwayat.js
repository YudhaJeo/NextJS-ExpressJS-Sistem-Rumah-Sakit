'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const TabelPengobatan = ({ data, loading, onEdit, onDelete }) => {

  return (
    <DataTable value={data} paginator rows={10} loading={loading} size="small" scrollable>
      <Column field="NAMALENGKAP" header="Nama Pasien" />
      <Column field="NIK" header="NIK" />
      <Column
        field="TANGGALKUNJUNGAN"
        header="Tgl Kunjungan"
        body={(row) => {
          const tgl = new Date(row.TANGGALKUNJUNGAN);
          return tgl.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
        }}
      />
      <Column field="KELUHAN" header="Keluhan" />
      <Column field="POLI" header="Poli" />
      <Column field="STATUSKUNJUNGAN" header="Status Kunjungan" />
      <Column field="STATUSRAWAT" header="Status Rawat" />
      <Column field="DIAGNOSA" header="Diagnosa" />
      <Column field="OBAT" header="Obat" />
      <Column
        header="Aksi"
        body={(row) => (
          <div className="flex gap-2">
            <Button icon="pi pi-pencil" size="small" severity="warning" onClick={() => onEdit(row)} />
            <Button icon="pi pi-trash" size="small" severity="danger" onClick={() => onDelete(row)} />
          </div>
        )}
      />
    </DataTable>
  );
};

export default TabelPengobatan;