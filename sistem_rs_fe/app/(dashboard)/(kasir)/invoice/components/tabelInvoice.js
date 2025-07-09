'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const statusLabels = {
  BELUM_LUNAS: 'Belum Dibayar',
  LUNAS: 'Sudah Dibayar',
};

const statusSeverity = {
  BELUM_LUNAS: 'danger',
  LUNAS: 'success',
};

const asuransiSeverity = {
  UMUM: 'info',      // biru
  BPJS: 'success',   // hijau
  DEFAULT: 'warning' // kuning untuk selain Umum/BPJS
};

const TabelInvoice = ({ data, loading, onEdit, onDelete }) => {
  const statusBodyTemplate = (row) => (
    <Tag
      value={statusLabels[row.STATUS] || row.STATUS}
      severity={statusSeverity[row.STATUS] || 'info'}
    />
  );

  const asuransiBodyTemplate = (row) => {
    const severity =
      asuransiSeverity[row.ASURANSI?.toUpperCase()] || asuransiSeverity.DEFAULT;

    return (
      <Tag
        value={row.ASURANSI}
        severity={severity}
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
      <Column field="NOINVOICE" header="No Invoice" />
      <Column field="NIK" header="NIK" />
      <Column field="NAMAPASIEN" header="Nama Pasien" />
      <Column
        field="ASURANSI"
        header="Asuransi"
        body={asuransiBodyTemplate}
      />
      <Column
        field="TANGGALINVOICE"
        header="Tgl Invoice"
        body={(row) => {
          const tgl = new Date(row.TANGGALINVOICE);
          return tgl.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
        }}
      />
      <Column
        field="TOTALTAGIHAN"
        header="Total Tagihan"
        body={(row) =>
          `Rp ${Number(row.TOTALTAGIHAN).toLocaleString('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`
        }
      />
      <Column field="STATUS" header="Status" body={statusBodyTemplate} />
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
      />
    </DataTable>
  );
};

export default TabelInvoice;