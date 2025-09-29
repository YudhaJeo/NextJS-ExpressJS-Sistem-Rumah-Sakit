'use client';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const DetailKeluar = ({ visible, onHide, data }) => {
  if (!data) return null;

  return (
    <Dialog 
      header={`Detail Pengeluaran ${data.TIPE === 'OBAT_INAP' ? 'Obat' : 'Alkes'}`} 
      visible={visible} 
      style={{ width: '60vw' }} 
      onHide={onHide}
    >
      <div className="mb-3">
        <p><b>Tanggal Pemberian:</b> {new Date(data.TANGGAL).toLocaleString('id-ID')}</p>
        <p><b>Pasien:</b> {data.NAMALENGKAP} </p>
        <p><b>Bed:</b> {data.NOMORBED}</p>
        <p><b>Perawat:</b> {data.NAMAPERAWAT}</p>
        <p><b>Tipe:</b> {data.TIPE}</p>
      </div>

      <DataTable value={[data]}>
        <Column 
          header="Nama Barang" 
          body={() => data.NAMAOBAT || data.NAMAALKES} 
        />
        <Column field="JUMLAH" header="Jumlah" />
        <Column 
          field="HARGA" 
          header="Harga Satuan" 
          body={(row) =>
            new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.HARGA)
          } 
        />
        <Column 
          field="TOTAL" 
          header="Total" 
          body={(row) =>
            new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.TOTAL)
          } 
        />
      </DataTable>
    </Dialog>
  );
};

export default DetailKeluar;