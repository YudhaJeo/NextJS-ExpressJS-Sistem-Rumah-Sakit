'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import React from 'react';
import Link from 'next/link';

const TabelAntrian = ({ data, loketList, loading, onPanggil, currentId }) => {
  const renderTable = (loketName) => {
    const filtered = data.filter((item) => item.LOKET === loketName);

    const handleNext = (row) => {
      const index = filtered.findIndex((item) => item.ID === row.ID);
      const next = filtered[index + 1];
      if (next) onPanggil(next.ID);
    };

    const handlePrev = (row) => {
      const index = filtered.findIndex((item) => item.ID === row.ID);
      const prev = filtered[index - 1];
      if (prev) onPanggil(prev.ID);
    };

    const actionBodyTemplate = (row) => (
      <div className="flex gap-1 justify-center">
        <Button
          icon="pi pi-step-backward"
          severity="secondary"
          size="small"
          onClick={() => handlePrev(row)}
          disabled={filtered[0]?.ID === row.ID}
        />
        <Button
          label="Panggil"
          icon="pi pi-volume-up"
          size="small"
          severity="success"
          onClick={() => onPanggil(row.ID)}
        />
        <Button
          icon="pi pi-step-forward"
          severity="secondary"
          size="small"
          onClick={() => handleNext(row)}
          disabled={filtered[filtered.length - 1]?.ID === row.ID}
        />
      </div>
    );

    const statusBodyTemplate = (row) => (
      <span className={row.STATUS === 'Sudah' ? 'text-red-500 font-semibold' : ''}>
        {row.STATUS}
      </span>
    );

    const rowClassName = (row) => {
      if (row.ID === currentId) return 'custom-current-row';
      if (row.STATUS === 'Sudah') return 'custom-finished-row';
      return '';
    };

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
          <Column header="Aksi" body={actionBodyTemplate} />
        </DataTable>
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-end gap-2 mb-4">
        <Link href="/antrian" target="_blank" rel="noopener noreferrer">
          <Button label="Display Antrian" icon="pi pi-table" />
        </Link>
        <Link href="/monitor" target="_blank" rel="noopener noreferrer">
          <Button label="Display Monitor" icon="pi pi-desktop" />
        </Link>
      </div>

      {loketList.map((loket) => renderTable(loket.NAMALOKET))}
    </>
  );
};

export default TabelAntrian;
