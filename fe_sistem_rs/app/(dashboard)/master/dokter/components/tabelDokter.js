'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const TableDokter = ({ data, loading, onEdit, onDelete }) => {
  const jadwalTemplate = (row) => {
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(`1970-01-01T${timeString}Z`); // Pakai tanggal fiktif
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="text-sm whitespace-pre-line">
      {row.JADWAL?.filter(j => j.JAM_MULAI && j.JAM_SELESAI).map((j, idx) => (
        <div key={idx}>
          {`${j.HARI} ${formatTime(j.JAM_MULAI)} - ${formatTime(j.JAM_SELESAI)}`}
        </div>
      ))}
    </div>
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