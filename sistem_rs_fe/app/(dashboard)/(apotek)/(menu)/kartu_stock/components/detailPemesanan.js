'use client';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const DetailPemesanan = ({ visible, onHide, data }) => {
  if (!data) return null;

  return (
    <Dialog header={`Detail Pemesanan ${data.pemesanan?.IDPEMESANAN || ''}`}
      visible={visible} style={{ width: '60vw' }} onHide={onHide}>
      
      <div className="mb-3">
        <p><b>Tanggal:</b> {data.pemesanan?.TGLPEMESANAN}</p>
        <p><b>Supplier:</b> {data.pemesanan?.NAMASUPPLIER}</p>
        <p><b>Status:</b> {data.pemesanan?.STATUS}</p>
      </div>

      <DataTable value={data.details} paginator rows={5}>
        <Column field="JENISBARANG" header="Jenis" />
        <Column field="IDBARANG" header="ID Barang" />
        <Column field="QTY" header="Qty" />
        <Column field="HARGABELI" header="Harga Beli" body={(row) => 
          new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.HARGABELI)
        }/>
      </DataTable>
    </Dialog>
  );
};

export default DetailPemesanan;