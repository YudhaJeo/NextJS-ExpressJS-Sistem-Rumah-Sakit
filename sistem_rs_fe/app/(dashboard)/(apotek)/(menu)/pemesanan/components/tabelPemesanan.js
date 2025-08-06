'use client';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const TabelPemesanan = ({ data, loading, onDetail, onAccept, onCancel }) => {
  return (
    <DataTable value={data} loading={loading} paginator rows={10}>
      <Column field="IDPEMESANAN" header="ID" />
      <Column field="TGLPEMESANAN" header="Tanggal" />
      <Column field="NAMASUPPLIER" header="Supplier" />
      <Column field="STATUS" header="Status" />
      <Column
        header="Aksi"
        body={(row) => (
          <div className="flex gap-2">
            <Button
              label="Detail"
              icon="pi pi-search"
              size="small"
              onClick={() => onDetail(row)}
            />
            {row.STATUS === 'PENDING' && (
              <>
                <Button
                  label="Terima"
                  icon="pi pi-check"
                  size="small"
                  severity="success"
                  onClick={() => onAccept(row)}
                />
                <Button
                  label="Batal"
                  icon="pi pi-times"
                  size="small"
                  severity="danger"
                  onClick={() => onCancel(row)}
                />
              </>
            )}
            {row.STATUS === 'DITERIMA' && (
              <Button
                label="Batalkan"
                icon="pi pi-times"
                size="small"
                severity="danger"
                onClick={() => onCancel(row)}
              />
            )}
          </div>
        )}
      />
    </DataTable>
  );
};

export default TabelPemesanan;