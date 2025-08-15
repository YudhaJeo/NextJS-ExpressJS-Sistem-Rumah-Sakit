'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import React from 'react';

const TabelAgama = ({ data, loading, onEdit, onDelete }) => {
  return (
    <DataTable
      value={data}
      paginator rows={10}
      loading={loading}
      size="small">
      <Column field="IDAGAMA" header="ID" />

      <Column field="NAMAAGAMA" header="Nama Agama" />

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

export default TabelAgama;