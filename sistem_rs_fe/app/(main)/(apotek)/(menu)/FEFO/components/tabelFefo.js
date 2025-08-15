'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { useState } from 'react';

export default function TabelFefo({ data, loading, onKoreksiStok }) {
  const [editingRow, setEditingRow] = useState(null);
  const [newStok, setNewStok] = useState(0);

  const actionBody = (rowData) => {
    return editingRow === rowData.IDBATCH ? (
      <div className="flex gap-2">
        <InputNumber
          value={newStok}
          onValueChange={(e) => setNewStok(e.value)}
          className="w-24"
        />
        <Button
          icon="pi pi-check"
          className="p-button-success p-button-sm"
          onClick={() => {
            onKoreksiStok(rowData, newStok);
            setEditingRow(null);
          }}
        />
        <Button
          icon="pi pi-times"
          className="p-button-secondary p-button-sm"
          onClick={() => setEditingRow(null)}
        />
      </div>
    ) : (
      <Button
        icon="pi pi-pencil"
        className="p-button-warning p-button-sm"
        onClick={() => {
          setEditingRow(rowData.IDBATCH);
          setNewStok(rowData.STOK);
        }}
      />
    );
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value || 0);

  return (
    <div className="card">
      <DataTable value={data} loading={loading} paginator rows={10} responsiveLayout="scroll">
        <Column field="TIPE" header="Tipe" />
        <Column field="NAMAITEM" header="Nama Item" />
        <Column field="STOK" header="Stok" />
        <Column field="TGLKADALUARSA" header="Kadaluarsa" />
        <Column
          field="HARGABELI"
          header="Harga Beli"
          body={(row) => formatCurrency(row.HARGABELI)}
        />
        <Column
          field="HARGAJUAL"
          header="Harga Jual"
          body={(row) => formatCurrency(row.HARGAJUAL)}
        />
        <Column header="Aksi" body={actionBody} style={{ width: '200px', textAlign: 'center' }} />
      </DataTable>
    </div>
  );
}