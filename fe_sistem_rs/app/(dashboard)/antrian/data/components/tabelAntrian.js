"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import React, { useEffect } from "react";
import Link from "next/link";
import "@/styles/customTable.css";

const TabelAntrian = ({ data, loketList, loading, onPanggil, onReset, currentId, fetchData }) => {
  // ✅ Refresh data saat pindah tab
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchData(); // pastikan fetchData adalah props atau fungsi valid
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [fetchData]);

  const renderTable = (loketName) => {
    const filtered = data
      .filter((item) => item.LOKET === loketName)
      .sort((a, b) => a.ID - b.ID);

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
      <div className="flex justify-center gap-2">
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
      <span style={row.STATUS === "Sudah" ? { fontWeight: "bold" } : {}}>
        {row.STATUS}
      </span>
    );

    const rowClassName = (row) => {
      if (row.ID === currentId) return "custom-current-row";
      if (row.STATUS === "Sudah") return "custom-finished-row";
      if (row.STATUS === "Dipanggil") return "custom-called-row";
      return "";
    };

    return (
      <div key={loketName} className="card mb-6">
        <div className="mb-3">
          <h3 className="font-semibold text-lg mb-2">Loket {loketName}</h3>
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

        <div className="overflow-auto">
          <DataTable
            value={filtered}
            paginator
            rows={5}
            loading={loading}
            stripedRows
            responsiveLayout="scroll"
            rowClassName={rowClassName}
            scrollable
            scrollHeight="flex"
            className="w-full"
            emptyMessage="Tidak ada data antrian"
          >
            <Column header="No" body={(_, { rowIndex }) => rowIndex + 1} style={{ width: '5rem' }} />
            <Column field="NO_ANTRIAN" header="No Antrian" style={{ minWidth: '8rem' }} />
            <Column field="LOKET" header="Loket" style={{ minWidth: '8rem' }} />
            <Column field="STATUS" header="Status" body={statusBodyTemplate} style={{ minWidth: '7rem' }} />
            <Column header="Aksi" body={actionBodyTemplate} style={{ minWidth: '16rem' }} />
          </DataTable>
        </div>
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

      {loketList.length > 0 ? (
        loketList.map((loket) => renderTable(loket.NAMALOKET))
      ) : (
        <p className="text-center text-gray-500 mt-10">Tidak ada loket tersedia</p>
      )}
    </>
  );
};

export default TabelAntrian;
