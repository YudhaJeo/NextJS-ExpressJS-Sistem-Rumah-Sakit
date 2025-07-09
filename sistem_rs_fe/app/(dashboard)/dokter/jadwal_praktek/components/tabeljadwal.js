// app/jadwalpraktek/components/tabeljadwal.js
'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const TabelJadwal = ({ data, loading, onEdit, onDelete }) => {
  return (
    <DataTable value={data} paginator rows={10} loading={loading}>
      <Column field="NAMA_DOKTER" header="Nama Dokter" />
      <Column field="HARI" header="Hari" />
      <Column field="JAM_MULAI" header="Jam Mulai" />
      <Column field="JAM_SELESAI" header="Jam Selesai" />
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

export default TabelJadwal;
