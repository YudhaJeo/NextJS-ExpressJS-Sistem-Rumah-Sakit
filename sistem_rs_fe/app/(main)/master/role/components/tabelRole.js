'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TabelRole = ({ data, loading }) => {
  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      loading={loading}
      size="small"
      scrollable
    >
      <Column field="IDROLE" header="ID Role" />
      <Column field="NAMAROLE" header="Nama Role" />
      <Column field="JENISROLE" header="Jenis Role" />
      <Column field="KETERANGAN" header="Keterangan" />
    </DataTable>
  );
};

export default TabelRole;