import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function TabelKritikSaran({ data, loading }) {

  return (
    <DataTable
      value={data}
      loading={loading}
      paginator
      rows={10}
      rowsPerPageOptions={[10, 25, 50, 75, 100, 250, 500, 1000]}
      responsiveLayout="scroll"
    >
      <Column field="NIK" header="NIK" />
      <Column field="JENIS" header="Jenis" />
      <Column field="PESAN" header="Pesan" />
      <Column
        field="CREATED_AT"
        header="Tanggal"
        body={(row) => new Date(row.CREATED_AT).toLocaleString("id-ID", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
      />
    </DataTable>
  );
}
