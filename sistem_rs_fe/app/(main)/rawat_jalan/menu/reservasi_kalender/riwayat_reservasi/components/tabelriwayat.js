'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';

const TabelReservasiRajal = ({ data, loading }) => {

  const dateBodyTemplate = (rowData) => {
    if (!rowData.TANGGALRESERVASI) return '-';
    const date = new Date(rowData.TANGGALRESERVASI);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const statusBodyTemplate = (rowData) => {
    const isConfirmed = rowData.STATUS === 'Dikonfirmasi';
    return (
      <span
        className={`px-2 py-1 rounded-lg text-sm font-medium ${
          isConfirmed ? 'bg-green-100 text-green-700' : ''
        }`}
      >
        {rowData.STATUS}
      </span>
    );
  };

  return (
    <div className="mt-4">
      {loading ? (
        <div className="flex justify-center items-center p-5">
          <ProgressSpinner style={{ width: '40px', height: '40px' }} />
        </div>
      ) : (
        <DataTable
          value={data}
          paginator
          rows={10} rowsPerPageOptions={[10, 25, 50, 75, 100, 250, 500, 1000]}
          emptyMessage="Tidak ada data reservasi rawat jalan yang dikonfirmasi."
          className="p-datatable-sm"
        >
          <Column field="NIK" header="NIK Pasien" sortable />
          <Column field="NAMALENGKAP" header="Nama Pasien" sortable />
          <Column field="NAMAPOLI" header="Poli" sortable />
          <Column field="NAMADOKTER" header="Dokter" sortable />
          <Column
            field="TANGGALRESERVASI"
            header="Tanggal Reservasi"
            body={dateBodyTemplate}
            sortable
          />
          <Column field="JAMRESERVASI" header="Jam Reservasi" sortable />
          <Column
            field="STATUS"
            header="Status"
            body={statusBodyTemplate}
            sortable
          />
          <Column field="KETERANGAN" header="Keterangan" />
        </DataTable>
      )}
    </div>
  );
};

export default TabelReservasiRajal;
