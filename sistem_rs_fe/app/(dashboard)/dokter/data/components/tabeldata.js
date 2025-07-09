'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const TabelData = ({ data, loading, onEdit, onDelete }) => {
  return (
    <DataTable value={data} paginator rows={10} loading={loading}>
      <Column field="NAMA_DOKTER" header="Nama Dokter" />
      <Column field="POLI" header="Poli" />
      <Column field="JADWALPRAKTEK" header="Jadwal" />
      <Column field="NO_TELEPON" header="Telepon" />
      <Column field="EMAIL" header="Email" />
      <Column field="JENIS_KELAMIN" header="Jenis Kelamin" />
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

export default TabelData;
