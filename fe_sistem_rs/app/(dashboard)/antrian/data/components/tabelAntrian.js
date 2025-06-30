'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import React from 'react';
import Link from 'next/link';

const TabelAntrian = ({ data, loketList, loading, onPanggil }) => {
  const renderTable = (loketName) => {
    const filtered = data.filter((item) => item.LOKET === loketName);

    const actionBodyTemplate = (row) => (
      <div className="flex gap-1 justify-center">
        <Button icon="pi pi-step-backward" severity="danger" size="small" />
        <Button
          label="Panggil"
          icon="pi pi-volume-up"
          size="small"
          severity="success"
          onClick={() => onPanggil(row.ID)}
        />
        <Button icon="pi pi-step-forward" severity="danger" size="small" />
      </div>
    );

    const statusBodyTemplate = (row) => (
      <span className={row.STATUS === 'Sudah' ? 'text-red-500 font-semibold' : ''}>
        {row.STATUS}
      </span>
    );

    const rowClassName = (row) => ({
      'bg-red-100': row.STATUS === 'Sudah',
    });

    return (
      <div key={loketName} className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Loket {loketName}</h3>
        <DataTable
          value={filtered}
          paginator
          rows={5}
          loading={loading}
          size="small"
          stripedRows
          rowClassName={rowClassName}
          emptyMessage="Tidak ada data antrian"
        >
          <Column header="No" body={(_, { rowIndex }) => rowIndex + 1} />
          <Column field="NO_ANTRIAN" header="No Antrian" />
          <Column field="LOKET" header="Loket" />
          <Column field="STATUS" header="Status" body={statusBodyTemplate} />
          <Column header="Action" body={actionBodyTemplate} />
        </DataTable>
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-content-end gap-2 mb-4">
        <Link href="/antrian">
          <Button label="Display Antrian" icon="pi pi-table" />
        </Link>
        <Link href="/monitor">
          <Button label="Display Monitor" icon="pi pi-desktop" />
        </Link>
      </div>

      {/* 🔥 Auto-render berdasarkan semua data loket dari DB */}
      {loketList.map((loket) => renderTable(loket.NAMALOKET))}
    </>
  );
};

export default TabelAntrian;
