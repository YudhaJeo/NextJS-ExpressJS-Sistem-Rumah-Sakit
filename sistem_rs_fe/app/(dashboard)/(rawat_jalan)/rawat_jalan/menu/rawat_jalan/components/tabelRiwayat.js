'use client';

import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const URL_API = process.env.NEXT_PUBLIC_URL;

const TabelRawatJalan = ({ data, loading, onEdit, onDelete, onDetail }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const tgl = new Date(tanggal);
    if (isNaN(tgl)) return "-";
    return tgl.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handlePreview = (src) => {
    setPreviewSrc(src);
    setPreviewVisible(true);
  };

  const actionBody = (row) => (
    <div className="flex gap-2">
      <Button
        label="Detail"
        icon="pi pi-search"
        size="small"
        onClick={() => onDetail(row)}
      />
      <Button
        icon="pi pi-pencil"
        size="small"
        severity="warning"
        onClick={() => onEdit(row)}
        tooltip="Edit"
      />
      <Button
        icon="pi pi-trash"
        size="small"
        severity="danger"
        onClick={() => onDelete(row)}
        tooltip="Hapus"
      />
    </div>
  );

  return (
    <>
      <DataTable
        value={data}
        paginator
        rows={10}
        loading={loading}
        stripedRows
        responsiveLayout="scroll"
      >
        <Column field="NAMALENGKAP" header="Nama Pasien" />
        <Column field="NIK" header="NIK" />
        <Column
          field="TANGGALKUNJUNGAN"
          header="Tgl Kunjungan"
          body={(row) => formatTanggal(row.TANGGALKUNJUNGAN)}
        />
        <Column field="KELUHAN" header="Keluhan" />
        <Column field="POLI" header="Poli" />
        <Column field="STATUSKUNJUNGAN" header="Status Kunjungan" />
        <Column field="NAMADOKTER" header="Dokter" />
        <Column field="STATUSRAWAT" header="Status Rawat" />
        <Column field="DIAGNOSA" header="Diagnosa" />
        <Column field="KETERANGAN" header="Keterangan" />
        <Column
            field="FOTORESEP"
            header="Foto Resep"
            style={{ width: '120px', textAlign: 'center' }}
            body={(row) =>
              row.FOTORESEP ? (
                <div className="w-12 aspect-square overflow-hidden rounded cursor-pointer bg-gray-100">
                  <img
                    src={`${URL_API}/uploads/rawat_jalan/${row.FOTORESEP}`}
                    alt="Foto Resep"
                    className="w-full h-full object-cover"
                    onClick={() =>
                      handlePreview(`${URL_API}/uploads/rawat_jalan/${row.FOTORESEP}`)
                    }
                  />
                </div>
              ) : (
                "-"
              )
            }
          />
        <Column header="Aksi" body={actionBody} style={{ width: "220px" }} />
      </DataTable>

      <Dialog
        header="Preview Foto Resep"
        visible={previewVisible}
        style={{ width: '50vw', maxWidth: '600px' }}
        modal
        onHide={() => setPreviewVisible(false)}
      >
        {previewSrc && (
          <img
            src={previewSrc}
            alt="Preview Foto Resep"
            className="w-full h-auto object-contain rounded"
          />
        )}
      </Dialog>
    </>
  );
};

export default TabelRawatJalan;
