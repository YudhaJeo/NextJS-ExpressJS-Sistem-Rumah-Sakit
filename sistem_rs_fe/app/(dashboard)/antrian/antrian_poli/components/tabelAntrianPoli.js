"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import Link from "next/link";
import "@/styles/customTable.css";

const TabelAntrianPoli = ({
  data,
  poliList,
  loading,
  onPanggil,
  onReset,
  currentId,
  fetchData,
  selectedZona,
  setSelectedZona,
}) => {
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchData();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [fetchData]);

  const renderTable = (poliName) => {
    const filtered = data
      .filter((item) => item.POLI === poliName)
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
      <div key={poliName} className="card mb-6">
        <div className="mb-3">
          <h3 className="font-semibold text-lg mb-2">{poliName}</h3>
          <Button
            label="Reset Antrian"
            icon="pi pi-refresh"
            severity="danger"
            size="small"
            onClick={() => {
              if (
                confirm(
                  `Apakah kamu yakin ingin mereset antrian ${poliName}?`
                )
              ) {
                onReset(poliName);
              }
            }}
          />
        </div>

        <div className="overflow-auto">
          <DataTable
            value={filtered}
            paginator
            rows={10}
            loading={loading}
            stripedRows
            responsiveLayout="scroll"
            rowClassName={rowClassName}
            scrollable
            scrollHeight="flex"
            className="w-full"
            emptyMessage="Tidak ada data antrian"
          >
            <Column
              header="No"
              body={(_, { rowIndex }) => rowIndex + 1}
              style={{ width: "5rem" }}
            />
            <Column
              field="NO_ANTRIAN"
              header="No Antrian"
              style={{ minWidth: "8rem" }}
            />
            <Column field="POLI" header="Poli" style={{ minWidth: "8rem" }} />
            <Column
              field="STATUS"
              header="Status"
              body={statusBodyTemplate}
              style={{ minWidth: "7rem" }}
            />
            <Column
              header="Aksi"
              body={actionBodyTemplate}
              style={{ minWidth: "16rem" }}
            />
          </DataTable>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter Zona:</span>
          <Dropdown
            value={selectedZona}
            onChange={(e) => setSelectedZona(e.value)}
            options={[...new Set(poliList.map((p) => p.ZONA))].map((z) => ({
              label: z,
              value: z,
            }))}
            placeholder="Pilih Zona"
            className="w-full md:w-14rem"
            showClear
          />
        </div>

        <div className="flex gap-2 ml-auto">
          <Link href="/antrian/poli" target="_blank" rel="noopener noreferrer">
            <Button label="Display Antrian Poli" icon="pi pi-table" />
          </Link>
          <Link
            href={
              selectedZona
                ? `/monitor/poli?zona=${encodeURIComponent(selectedZona)}`
                : "/monitor/poli"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button label="Display Monitor Poli" icon="pi pi-desktop" />
          </Link>
        </div>
      </div>

      {poliList.length > 0 ? (
        poliList
          .filter((p) => !selectedZona || p.ZONA === selectedZona)
          .map((poli) => renderTable(poli.NAMAPOLI))
      ) : (
        <p className="text-center text-gray-500 mt-10">
          Tidak ada poli tersedia
        </p>
      )}
    </>
  );
};

export default TabelAntrianPoli;
