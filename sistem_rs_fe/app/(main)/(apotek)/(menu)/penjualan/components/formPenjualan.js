'use client';

import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';

export default function FormPenjualan({ visible, onHide, data, onSubmit }) {
  const [detail, setDetail] = useState([]);

  useEffect(() => {
    if (data?.detail) {
      const mapped = data.detail.map((item) => ({
        IDDETAIL: item.IDDETAIL,
        JENISBARANG: item.JENISBARANG,
        NAMABARANG: item.NAMAOBAT || item.NAMAALKES || "-",
        QTY: item.JUMLAH,
        HARGA: item.HARGA || 0,
      }));
      setDetail(mapped);
    }
  }, [data]);

  const updateHarga = (value, index) => {
    const newDetail = [...detail];
    newDetail[index].HARGA = value;
    setDetail(newDetail);
  };

  const totalHarga = detail.reduce((sum, item) => sum + (item.QTY * item.HARGA), 0);

  const handleSubmit = () => {
    onSubmit({
      IDORDER: data?.header?.IDORDER,
      DETAIL: detail,
    });
  };

  return (
    <Dialog header="Proses Penjualan" visible={visible} style={{ width: '60vw' }} onHide={onHide}>
      <div className="mb-4">
        <p><b>ID Order:</b> {data?.header?.IDORDER}</p>
        <p><b>Pasien:</b> {data?.header?.NAMAPASIEN}</p>
        <p><b>Tanggal Pengambilan:</b> {data?.header?.TANGGALPENGAMBILAN}</p>
      </div>

      <DataTable value={detail} paginator rows={5}>
        <Column field="JENISBARANG" header="Jenis" />
        <Column field="NAMABARANG" header="Nama Barang" />
        <Column field="QTY" header="Qty" />
        <Column
          header="Harga Jual"
          body={(row, { rowIndex }) => (
            <InputNumber
              value={row.HARGA}
              onValueChange={(e) => updateHarga(e.value, rowIndex)}
              mode="currency"
              currency="IDR"
              locale="id-ID"
            />
          )}
        />
        <Column
          header="Subtotal"
          body={(row) =>
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
            }).format(row.QTY * row.HARGA)
          }
        />
      </DataTable>

      <div className="text-right mt-4">
        <h4>
          Total:{' '}
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(totalHarga)}
        </h4>
        <Button label="Simpan Penjualan" icon="pi pi-save" onClick={handleSubmit} />
      </div>
    </Dialog>
  );
}