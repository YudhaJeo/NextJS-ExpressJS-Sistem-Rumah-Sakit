"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

const TabelSupplier = ({ data, loading, onEdit, onDelete }) => {
  return (
    <DataTable value={data} paginator rows={10} loading={loading} size="small" scrollable>
      <Column field="SUPPLIERID" header="ID" style={{ width: '100px' }} />
      <Column field="NAMASUPPLIER" header="Nama Supplier" />
      <Column field="ALAMAT" header="Alamat" />
      <Column field="KOTA" header="Kota" />
      <Column field="TELEPON" header="Telepon" />
      <Column field="EMAIL" header="Email" />
      <Column field="NAMASALES" header="Nama Sales" />
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

export default TabelSupplier;