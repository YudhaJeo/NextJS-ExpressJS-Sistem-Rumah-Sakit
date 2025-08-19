// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_fe\app\(dashboard)\(rawat_inap)\rawat_inap\menu\rawat_inap\components\tabelRawatInap.js
'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const TabelRawatInap = ({ data, loading, onEdit, onDelete, setFormRawatInapMode, onCheckout, onCancelCheckout }) => {

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const tgl = new Date(tanggal);
    return tgl.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <DataTable value={data} paginator rows={10} loading={loading} size="small" scrollable sortField="TANGGALMASUK" sortOrder={-1}>
      <Column
        field="NAMALENGKAP"
        header="Pasien"
      />
      <Column
        field="IDBED"
        header="Bed"
        body={(row) => row.NOMORBED}
      />
      <Column
        field="TANGGALMASUK"
        header="Masuk"
        body={(row) => formatTanggal(row.TANGGALMASUK)}
      />
      <Column
        field="TANGGALKELUAR"
        header="Keluar"
        body={(row) => formatTanggal(row.TANGGALKELUAR)}
      />

      <Column
        header="Status"
        body={(row) => {
          const status = row.STATUS || 'Tidak Diketahui';
          const severity = () => {
            switch (status) {
              case "AKTIF":
                return "success";
              case "SELESAI":
                return "danger";
              default:
                return "info";
            }
          };

          return <Tag
            value={status.toLowerCase().replace(/^\w/, c => c.toUpperCase())}
            severity={severity()}
          />
            ;
        }}
      />
      <Column field="CATATAN" header="Catatan" />
      <Column
        field="TOTALKAMAR"
        header="Total Biaya Kamar"
        body={(row) => row.TOTALKAMAR?.toLocaleString('id-ID', {
          style: 'currency',
          currency: 'IDR',
        })}
      />
      <Column
        header="Aksi"
        body={(row) => (
          <div className="flex gap-2">
            <Button
              tooltip="Edit Data"
              icon="pi pi-address-book"
              size="small"
              severity="warning"
              onClick={() => {
                setFormRawatInapMode("edit")
                onEdit(row, 0)
              }}
            />
            <Button
              tooltip="Visit"
              icon="pi pi-briefcase"
              size="small"
              severity="info"
              onClick={() => { 
                setFormRawatInapMode("visit");
                onEdit(row, 0);
              }}
            />
            {row.STATUS === "AKTIF" && (
              <>
                <Button
                  tooltip="Selesaikan rawat inap"
                  size="small"
                  label="Checkout"
                  severity="success"
                  onClick={() => {
                    onCheckout(row);
                  }}
                />
                <Button
                  tooltip="Hapus Data"
                  icon="pi pi-trash"
                  size="small"
                  severity="danger"
                  onClick={() => onDelete(row)}
                />
              </>
            )}
            {row.STATUS !== "AKTIF" && (
              <>
                <Button
                  tooltip="Batalkan checkout"
                  size="small"
                  label="Aktifkan"
                  severity="warning"
                  onClick={() => {
                    onCancelCheckout(row);
                  }}
                />
              </>
            )}
          </div>
        )}
        style={{ width: '150px' }}
      />
    </DataTable>
  );
};

export default TabelRawatInap;
