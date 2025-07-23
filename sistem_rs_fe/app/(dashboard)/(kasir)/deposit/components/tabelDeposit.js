'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const statusLabels = {
  AKTIF: 'Aktif',
  HABIS: 'Habis',
  REFUND: 'Refund',
};

const statusSeverity = {
  AKTIF: 'success',
  HABIS: 'danger',
  REFUND: 'warning',
};

const metodeSeverity = {
  'Cash': 'success',
  'Transfer Bank': 'info',
  'QRIS': 'warning',
  DEFAULT: 'secondary',
};

const TabelDeposit = ({ data, loading, onEdit, onDelete }) => {
  const statusBodyTemplate = (row) => {
    const effectiveStatus = Number(row.SALDO_SISA) === 0 ? 'HABIS' : row.STATUS;
    return (
      <Tag
        value={statusLabels[effectiveStatus] || effectiveStatus}
        severity={statusSeverity[effectiveStatus] || 'info'}
      />
    );
  };

  const metodeBodyTemplate = (row) => (
    <Tag
        value={row.METODE}
        severity={metodeSeverity[row.METODE] || metodeSeverity.DEFAULT}
      />
  );

  const nominalBodyTemplate = (row) =>
    `Rp ${Number(row.NOMINAL).toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  const saldoSisaBodyTemplate = (row) =>
    `Rp ${Number(row.SALDO_SISA).toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  const keteranganBodyTemplate = (row) => row.KETERANGAN?.trim() ? row.KETERANGAN : '-';

  const bankBodyTemplate = (row) => {
    return row.NAMA_BANK && row.NAMA_BANK.trim() !== '' ? row.NAMA_BANK : '-';
  };

  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      loading={loading}
      size="small"
      scrollable
      scrollHeight="400px"
    >
      <Column field="NODEPOSIT" header="No Deposit" />
      <Column field="NIK" header="NIK" />
      <Column field="NOMINAL" header="Nominal" body={nominalBodyTemplate} />
      <Column field="METODE" header="Metode" body={metodeBodyTemplate} />
      <Column field="NAMA_BANK" header="Bank" body={bankBodyTemplate}/>
      <Column field="SALDO_SISA" header="Saldo Sisa" body={saldoSisaBodyTemplate} />
      <Column field="STATUS" header="Status" body={statusBodyTemplate} />
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

export default TabelDeposit;