// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_fe\app\(main)\(rawat_inap)\rawat_inap\inventory\log_transaksi\components\tabelTransaksi.js
'use client'

import React from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { Button } from 'primereact/button'

const TabelTransaksi = ({ data, loading, onDetail }) => {
  const dateBody = (rowData) => {
    return rowData.TANGGAL
      ? new Date(rowData.TANGGAL).toLocaleString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : '-'
  }

  const statusBody = (rowData) => {
    const severity = rowData.TIPE === 'PEMESANAN' ? 'success' : 'warning';
    const label = rowData.TIPE === 'PEMESANAN' ? 'Masuk' : 'Keluar';
  
    return <Tag value={label} severity={severity} />;
  };

  const tipeBody = (rowData) => {
    const severity =
      rowData.TIPE === 'PEMESANAN'
        ? 'success'
        : rowData.TIPE === 'OBAT_INAP'
        ? 'info'
        : 'warning'
    return <Tag value={rowData.TIPE} severity={severity} />
  }

  const actionBody = (rowData) => {
    if (
      rowData.TIPE === 'PEMESANAN' ||
      rowData.TIPE === 'OBAT_INAP' ||
      rowData.TIPE === 'ALKES_INAP'
    ) {
      return (
        <Button
          label="Detail"
          icon="pi pi-search"
          className="p-button-sm p-button-info"
          onClick={() => onDetail?.(rowData)}
        />
      )
    }
    return null
  }  

  return (
    <DataTable
      value={data}
      loading={loading}
      paginator
      rows={20}
      responsiveLayout="scroll"
      emptyMessage="Tidak ada data transaksi stok"
    >
      <Column field="ID" header="ID" />
      <Column body={dateBody} header="Tanggal" />
      <Column body={tipeBody} header="Tipe" />
      <Column body={statusBody} header="Status" />
      <Column field="JUMLAH" header="Jumlah" />
      <Column 
        header="Total" 
        body={(row) =>
          new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.TOTAL)
        }
        />
      <Column body={actionBody} header="Aksi" />
    </DataTable>
  )
}

export default TabelTransaksi
