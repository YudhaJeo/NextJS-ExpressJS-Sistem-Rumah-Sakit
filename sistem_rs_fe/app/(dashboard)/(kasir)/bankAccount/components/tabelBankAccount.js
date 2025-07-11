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

const TabelBankAccount = ({ data, loading, onEdit, onDelete }) => {
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
      rows={5}
      loading={loading}
      size="small"
      scrollable
    >
      <Column field="NAMA_BANK" header="Nama Bank" sortable />
      <Column field="NO_REKENING" header="No Rekening" />
      <Column field="ATAS_NAMA" header="Atas Nama" />
      <Column field="CABANG" header="Cabang" />
      <Column field="KODE_BANK" header="Kode Bank" />
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

export default TabelBankAccount;