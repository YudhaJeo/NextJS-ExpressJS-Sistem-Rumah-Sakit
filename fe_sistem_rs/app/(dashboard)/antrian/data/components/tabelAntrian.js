"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import React from "react";
import Link from "next/link";
import "@/styles/customTable.css"; 

const TabelAntrian = ({
  data,
  loketList,
  loading,
  onPanggil,
  onReset,
  currentId,
}) => {
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
      <div className="p-d-flex p-jc-center p-gap-2">
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
      <span
        style={
          row.STATUS === "Sudah" ? { fontWeight: "bold" } : {}
        }
      >
        {row.STATUS}
      </span>
    );

    const rowClassName = (row) => {
      if (row.ID === currentId) return "custom-current-row"; 
      if (row.STATUS === "Sudah") return "custom-finished-row"; 
      return "";
    };

    return (
      <div key={loketName} className="p-card" style={{ padding: '1rem', marginBottom: '2rem' }}>
        <div className="p-d-flex p-jc-between p-ai-center p-mb-3">
          <h3 className="p-text-bold p-m-0">Loket {loketName}</h3>
          <Button
            label="Reset Antrian"
            icon="pi pi-refresh"
            severity="danger"
            size="small"
            onClick={() => {
              if (confirm(`Apakah kamu yakin ingin mereset antrian di Loket ${loketName}?`)) {
                onReset(loketName);
              }
            }}
          />
        </div>

        <DataTable
          value={filtered}
          paginator
          rows={5}
          loading={loading}
          size="small"
          stripedRows
          rowClassName={rowClassName}
          emptyMessage="Tidak ada data antrian"
          responsiveLayout="scroll"
          style={{ minWidth: '600px' }}
        >
          <Column header="No" body={(_, { rowIndex }) => rowIndex + 1} style={{ width: '5%' }} />
          <Column field="NO_ANTRIAN" header="No Antrian" style={{ width: '15%' }} />
          <Column field="LOKET" header="Loket" style={{ width: '20%' }} />
          <Column field="STATUS" header="Status" body={statusBodyTemplate} style={{ width: '15%' }} />
          <Column header="Aksi" body={actionBodyTemplate} style={{ width: '35%' }} />
        </DataTable>
      </div>
    );
  };

  return (
    <>
        <div className="flex justify-content-end gap-2 mb-4">
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
