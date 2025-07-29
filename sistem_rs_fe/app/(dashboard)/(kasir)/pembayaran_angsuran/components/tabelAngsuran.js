'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const metodeSeverity = {
  'Cash': 'success',
  'Transfer Bank': 'info',
  'QRIS': 'warning',
  DEFAULT: 'secondary',
};

const asuransiSeverity = {
  UMUM: 'info',      
  BPJS: 'success',   
  DEFAULT: 'warning' 
};

const TabelAngsuran = ({ data, loading, onEdit, onDelete }) => {
  const tanggalBodyTemplate = (row) => {
    const tgl = new Date(row.TANGGALBAYAR);
    return tgl.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const nominalBodyTemplate = (row) => {
    return `Rp ${Number(row.NOMINAL).toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const metodeBodyTemplate = (row) => (
    <Tag
      value={row.METODE}
      severity={metodeSeverity[row.METODE] || metodeSeverity.DEFAULT}
    />
  );

  const bankBodyTemplate = (row) => {
    return row?.NAMA_BANK?.trim() ? row.NAMA_BANK : '-';
  };

  const keteranganBodyTemplate = (row) => {
    return row?.KETERANGAN?.trim() ? row.KETERANGAN : '-';
  };

  const asuransiBodyTemplate = (row) => {
    const severity =
      asuransiSeverity[row.NAMAASURANSI?.toUpperCase()] || asuransiSeverity.DEFAULT;
    
    return (
      <Tag
        value={row.NAMAASURANSI}
        severity={severity}
      />
    );
  };

  return (
    <DataTable
      value={data || []}
      paginator
      rows={10}
      loading={loading}
      size="small"
      scrollable
    >
      <Column field="NOANGSURAN" header="No Angsuran" />
      <Column field="NOINVOICE" header="No Invoice" />
      <Column field="NIK" header="NIK" />
      <Column field="NAMALENGKAP" header="Nama Pasien" />
      <Column field="NAMAASURANSI" header="Asuransi" body={asuransiBodyTemplate} />
      <Column field="NOMINAL" header="Nominal" body={nominalBodyTemplate} />
      <Column field="TANGGALBAYAR" header="Tanggal Bayar" body={tanggalBodyTemplate} />
      <Column field="METODE" header="Metode" body={metodeBodyTemplate} />
      <Column field="NAMA_BANK" header="Bank" body={bankBodyTemplate} />
      <Column field="KETERANGAN" header="Keterangan" body={keteranganBodyTemplate} />
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

export default TabelAngsuran;