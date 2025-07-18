"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

const statusSeverity = {
  TETAP: "success",
  KONTRAK: "info",
  HONORER: "warning",
};

const TabelTenagaNonMedis = ({ data, loading, onEdit, onDelete }) => {
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
      <Column field="KODETENAGANONMEDIS" header="Kode"  />
      <Column field="NAMALENGKAP" header="Nama"  />
      <Column
        field="JENISKELAMIN"
        header="Jenis Kelamin"
        body={(row) => (row.JENISKELAMIN === "L" ? "Laki-laki" : "Perempuan")}
      />
      <Column field="TEMPATLAHIR" header="Tempat Lahir"  />
      <Column
        field="TANGGALLAHIR"
        header="Tanggal Lahir"
        body={(row) =>
          row.TANGGALLAHIR
            ? new Date(row.TANGGALLAHIR).toLocaleDateString("id-ID")
            : ""
        }
        
      />
      <Column field="NOHP" header="No HP"  />
      <Column field="EMAIL" header="Email"  />
      <Column field="JENISTENAGANONMEDIS" header="Jenis Tenaga Non Medis"  />
      <Column field="SPESIALISASI" header="Spesialisasi"  />
      <Column field="UNITKERJA" header="Unit Kerja"  />
      <Column field="STATUSKEPEGAWAIAN" header="Status Kepegawaian" body={statusKepegawaianBody}  />
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

export default TabelTenagaNonMedis;