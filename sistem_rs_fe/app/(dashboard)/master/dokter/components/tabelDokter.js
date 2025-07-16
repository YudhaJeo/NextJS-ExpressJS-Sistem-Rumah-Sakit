'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const TableDokter = ({ data, loading, onEdit, onDelete }) => {
  const jadwalTemplate = (row) => {
    return (
    <span className="text-sm whitespace-pre-line">
      {row.JADWALPRAKTEK || '-'}
    </span>
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
      <Column field="IDDOKTER" header="ID Dokter" />
      <Column field="NAMADOKTER" header="Nama Dokter" />
      <Column field="NAMAPOLI" header="Nama Poli" />
      <Column header="Jadwal Praktek" body={jadwalTemplate} />
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
      />
    </DataTable>
  );
};

export default TableDokter;