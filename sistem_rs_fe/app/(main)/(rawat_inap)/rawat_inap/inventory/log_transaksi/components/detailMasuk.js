'use client';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const DetailMasuk = ({ visible, onHide, data }) => {
  if (!data) return null;

  const formatRupiah = (val) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
      .format(Number(val) || 0);

  return (
    <Dialog
      header={`Detail Pemesanan ${data.pemesanan?.IDPEMESANAN || ''}`}
      visible={visible}
      style={{ width: '60vw' }}
      onHide={onHide}
    >
      <div className="mb-3">
        <p><b>Tanggal:</b> {data.pemesanan?.TGLPEMESANAN}</p>
        <p><b>Supplier:</b> {data.pemesanan?.NAMASUPPLIER}</p>
        <p><b>Status:</b> {data.pemesanan?.STATUS}</p>
      </div>

      <DataTable value={data.details} paginator rows={5}>
        <Column field="JENISBARANG" header="Jenis" />
        <Column field="NAMABARANG" header="ID Barang" />
        <Column field="QTY" header="Qty" />
        <Column
          field="HARGABELI"
          header="Harga Beli"
          body={(row) => formatRupiah(row.HARGABELI)}
        />
        <Column
          header="Total"
          body={(row) => {
            const total = (Number(row.QTY) || 0) * (Number(row.HARGABELI) || 0);
            return formatRupiah(total);
          }}
        />
      </DataTable>
    </Dialog>
  );
};

export default DetailMasuk;