// app\(dashboard)\antrian\printer\components\tabelPrinter.js
'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag'; // ✅ Tambahkan import Tag
import React from 'react';

const TabelPrinter = ({ data, loading, onEdit, onDelete }) => {
  const statusTemplate = (rowData) => {
    const status = rowData.KETERANGAN;
    const severity = status === 'AKTIF' ? 'success' : 'danger';
    return <Tag value={status} severity={severity} />;
  };

  return (
    <DataTable value={data} paginator rows={5} loading={loading} size="small" scrollable>
      <Column field="NOPRINTER" header="No" style={{ width: '70px' }} />
      <Column field="NAMAPRINTER" header="Nama Printer" sortable />
      <Column field="KODEPRINTER" header="Kode Printer" />

      <Column
        field="KETERANGAN"
        header="Status"
        body={statusTemplate}
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

export default TabelPrinter;