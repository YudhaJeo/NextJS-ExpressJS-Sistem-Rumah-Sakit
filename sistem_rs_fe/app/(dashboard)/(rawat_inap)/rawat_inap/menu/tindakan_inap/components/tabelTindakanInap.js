// app\(dashboard)\(rawat_inap)\rawat_inap\menu\tindakan_inap\components\tabelTindakan.js
'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import React from 'react';

const TabelTindakanInap = ({ data, loading, onEdit, onDelete }) => {
  return (
    <DataTable value={data} paginator rows={10} loading={loading} size="small" scrollable>
      <Column
        field="NAMALENGKAP"
        header="Pasien"
        body={(row) => row.NAMALENGKAP}
      />
      <Column
        field="NOMORBED"
        header="Bed"
        body={(row) => row.NOMORBED}
      />
      <Column field="NAMATINDAKAN" header="Nama Tindakan" />
      <Column
        header="Biaya"
        body={(rowData) =>
          new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(rowData.HARGA || 0)
        }
      />
      <Column field="JUMLAH" header="Jumlah" />

      <Column
        header="Total Harga"
        body={(rowData) =>
          new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(rowData.TOTAL || 0)
        }
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

export default TabelTindakanInap;
