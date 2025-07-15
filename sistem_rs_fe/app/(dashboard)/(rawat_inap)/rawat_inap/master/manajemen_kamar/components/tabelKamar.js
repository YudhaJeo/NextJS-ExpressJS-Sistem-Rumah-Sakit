// app\(dashboard)\(rawat_inap)\rawat_inap\manajemen-kamar\components\tabelKamar.js
'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import React from 'react';

const TabelKamar = ({ data, loading, onEdit, onDelete }) => {
  return (
    <DataTable value={data} paginator rows={10} loading={loading} size="small" scrollable>
      
      <Column field="IDKAMAR" header="ID" />
      <Column field="NAMAKAMAR" header="Nama Kamar" />
      <Column
        field="IDBANGSAL"
        header="Bangsal"
        body={(row) => row.NAMABANGSAL}
      />
      <Column field="KAPASITAS" header="Kapasitas" />
      <Column field="KETERANGAN" header="Keterangan" />

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

export default TabelKamar;