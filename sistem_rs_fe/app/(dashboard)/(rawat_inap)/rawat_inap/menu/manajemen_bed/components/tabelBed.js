'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from "primereact/tag";

const TabelBed = ({ data, loading, onEdit, onDelete }) => {
  return (
    <DataTable value={data} paginator rows={10} loading={loading} size="small" scrollable>
      <Column field="NOMORBED" header="Nomor Bed" />
      <Column
        field="IDKAMAR"
        header="Kamar"
        body={(row) => row.NAMAKAMAR}
      />
      <Column
        header="Bangsal"
        body={(row) => row.NAMABANGSAL}
      />

      <Column
        header="Status"
        body={(row) => {
          const status = row.STATUS || 'Tidak Diketahui';
          const severity = () => {
            switch (status) {
              case "TERSEDIA":
                return "success";
              case "PENUH":
                return "danger";
              case "DIBERSIHKAN":
                return "warning";
              default:
                return "info";
            }
          };

          return <Tag
            value={status.toLowerCase().replace(/^\w/, c => c.toUpperCase())}
            severity={severity()}
          />
            ;
        }}
      />
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

export default TabelBed;