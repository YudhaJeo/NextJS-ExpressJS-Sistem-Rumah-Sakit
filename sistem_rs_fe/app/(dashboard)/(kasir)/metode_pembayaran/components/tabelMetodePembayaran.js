'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import React from 'react';

const statusLabels = {
  AKTIF: 'Aktif',
  NONAKTIF: 'Non Aktif',
};

const statusSeverity = {
  AKTIF: 'success',  
  NONAKTIF: 'danger', 
};

const TabelMetodePembayaran = ({ data, loading, onEdit, onDelete }) => {
  const statusBodyTemplate = (row) => {
    const statusKey = (row.STATUS || '').toUpperCase();
    return (
      <Tag
        value={statusLabels[statusKey] || row.STATUS}
        severity={statusSeverity[statusKey] || 'info'}
      />
    );
  };

  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      loading={loading}
      size="small"
      scrollable
    >
      <Column field="NAMA" header="Nama Metode" sortable />
      <Column
        field="FEE_PERSEN"
        header="Fee (%)"
        body={(row) => `${row.FEE_PERSEN || 0}%`}
        sortable
      />
      <Column field="STATUS" header="Status" body={statusBodyTemplate} />
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

export default TabelMetodePembayaran;