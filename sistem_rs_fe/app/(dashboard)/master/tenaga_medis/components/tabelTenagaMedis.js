"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

const statusSeverity = {
  TETAP: "success",
  KONTRAK: "info",
  HONORER: "warning",
};

const TabelTenagaMedis = ({ data, loading, onEdit, onDelete }) => {
  const statusKepegawaianBody = (row) => {
    const status = (row.STATUSKEPEGAWAIAN || "").toUpperCase();
    return (
      <Tag
        value={row.STATUSKEPEGAWAIAN || "-"}
        severity={statusSeverity[status] || "secondary"}
      />
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
      <Column field="KODETENAGAMEDIS" header="Kode Tenaga Medis" sortable />
      <Column field="NAMALENGKAP" header="Nama Lengkap" sortable />
      <Column
        field="JENISKELAMIN"
        header="Jenis Kelamin"
        body={(row) => (row.JENISKELAMIN === "L" ? "Laki-laki" : "Perempuan")}
        sortable
      />
      <Column field="TEMPATLAHIR" header="Tempat Lahir" sortable />
      <Column
        field="TANGGALLAHIR"
        header="Tanggal Lahir"
        body={(row) =>
          row.TANGGALLAHIR
            ? new Date(row.TANGGALLAHIR).toLocaleDateString("id-ID")
            : ""
        }
        sortable
      />
      <Column field="NOHP" header="No HP" sortable />
      <Column field="EMAIL" header="Email" sortable />
      <Column field="JENISTENAGAMEDIS" header="Jenis Tenaga Medis" sortable />
      <Column field="SPESIALISASI" header="Spesialisasi" sortable />
      <Column field="NOSTR" header="No STR" sortable />
      <Column
        field="TGLEXPSTR"
        header="Tgl Exp STR"
        body={(row) =>
          row.TGLEXPSTR
            ? new Date(row.TGLEXPSTR).toLocaleDateString("id-ID")
            : ""
        }
        sortable
      />
      <Column field="NOSIP" header="No SIP" sortable />
      <Column
        field="TGLEXPSIP"
        header="Tgl Exp SIP"
        body={(row) =>
          row.TGLEXPSIP
            ? new Date(row.TGLEXPSIP).toLocaleDateString("id-ID")
            : ""
        }
        sortable
      />
      <Column field="UNITKERJA" header="Unit Kerja" sortable />
      <Column field="STATUSKEPEGAWAIAN" header="Status Kepegawaian" body={statusKepegawaianBody} sortable />
      <Column
        field="FOTOPROFIL"
        header="Foto Profil"
        body={(row) =>
        row.FOTOPROFIL
            ? typeof row.FOTOPROFIL === "object" && "name" in row.FOTOPROFIL
            ? row.FOTOPROFIL.name
            : row.FOTOPROFIL
            : "-"
        }
      />
      <Column
        field="DOKUMENPENDUKUNG"
        header="Dokumen Pendukung"
        body={(row) =>
          row.DOKUMENPENDUKUNG
            ? typeof row.DOKUMENPENDUKUNG === "object" && "name" in row.DOKUMENPENDUKUNG
              ? row.DOKUMENPENDUKUNG.name
              : row.DOKUMENPENDUKUNG
            : "-"
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
        style={{ width: "150px" }}
      />
    </DataTable>
  );
};

export default TabelTenagaMedis;