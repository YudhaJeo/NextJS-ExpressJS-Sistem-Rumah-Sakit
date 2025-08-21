'use client'

import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { Toolbar } from 'primereact/toolbar'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function AdjustPrintMarginLaporan({
  adjustDialog,
  setAdjustDialog,
  selectedRow,
  setPdfUrl,
  setFileName,
  setJsPdfPreviewOpen
}) {
  const [loadingExport, setLoadingExport] = useState(false)
  const [dataAdjust, setDataAdjust] = useState({
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    paperSize: 'A4',
    orientation: 'portrait'
  })

  const paperSizes = [
    { name: 'A4', value: 'A4' },
    { name: 'Letter', value: 'Letter' },
    { name: 'Legal', value: 'Legal' }
  ]
  const orientationOptions = [
    { label: 'Potrait', value: 'portrait' },
    { label: 'Lanskap', value: 'landscape' }
  ]

  const onInputChangeNumber = (e, name) => {
    setDataAdjust((prev) => ({ ...prev, [name]: e.value || 0 }))
  }
  const onInputChange = (e, name) => {
    setDataAdjust((prev) => ({ ...prev, [name]: e.value }))
  }

  async function exportPDF(row, adjustConfig) {
  const pemesanan = row.pemesanan || {};
  const details = Array.isArray(row.details) ? row.details : [];

  const doc = new jsPDF({
    orientation: adjustConfig.orientation,
    unit: 'mm',
    format: adjustConfig.paperSize,
  });

  const marginLeft = parseFloat(adjustConfig.marginLeft) || 10;
  const marginTop = parseFloat(adjustConfig.marginTop) || 10;
  const marginRight = parseFloat(adjustConfig.marginRight) || 10;

  let y = marginTop + 10;

  const formatTanggal = (tanggal) =>
    tanggal
      ? new Date(tanggal).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '-';

  const formatRupiah = (val) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(val || 0);

  // Header
  doc.setFontSize(18);
  doc.text('Kartu Stok Obat atau Alat Kesehatan', doc.internal.pageSize.width / 2, y, { align: 'center' });
  y += 5;

  doc.setFontSize(10);
  doc.text(`No Kartu: #${pemesanan.IDPEMESANAN ?? '-'}`, doc.internal.pageSize.width / 2, y, { align: 'center' });
  y += 15;

  const labelX = marginLeft;
  const valueX = marginLeft + 25;
  const statusRawHeader = pemesanan.STATUS ?? '-';
  const statusHeader = statusRawHeader === 'DITERIMA' ? 'MASUK' : statusRawHeader;


  // Informasi Penjualan/Pembelian
doc.setFontSize(12);
doc.text('Informasi Penjualan/Pembelian', labelX, y);
y += 6;

doc.setFontSize(10);
doc.text('Nama Supplier', labelX, y);
doc.text(`: ${pemesanan.NAMASUPPLIER ?? '-'}`, valueX - 2, y);
y += 6;

doc.text('Status', labelX, y);
doc.text(`: ${statusHeader}`, valueX - 2, y);
y += 6;

doc.setFontSize(12);
doc.text('Tanggal Pembelian', labelX, y);
y += 6;

doc.setFontSize(10);
doc.text('Tanggal', labelX, y);
doc.text(`: ${formatTanggal(pemesanan.TGLPEMESANAN)}`, valueX - 2, y);
y += 6;

const services = details.length
  ? details.map((d, idx) => {
      const harga = Number(d.HARGABELI ?? d.HARGA ?? 0);
      const qty = Number(d.QTY ?? d.QTY_BARANG ?? 0);
      const jenis = d.JENISBARANG ?? d.JENIS ?? '-';
      const nama = d.NAMABARANG ?? d.KETERANGAN ?? `Item ${idx + 1}`;
      const total = harga * qty;
      const statusRaw = pemesanan.STATUS ?? '-';
      const status = statusRaw === 'DITERIMA' ? 'MASUK' : statusRaw;

      return [
        idx + 1,
        `${nama} ${harga ? `(${formatRupiah(harga)})` : ''}`,
        `${qty}`,
        `${jenis}`,
        status, 
        formatRupiah(harga),
        formatRupiah(total),
      ];
    })
  : [
      [1, 'Biaya Pembelian', '(0)', '-', pemesanan.STATUS ?? '-', formatRupiah(0), formatRupiah(0)]
    ];

autoTable(doc, {
  startY: y,
  head: [['#', 'Layanan', 'Qty', 'Jenis', 'Status', 'Harga Satuan', 'Total']], 
  body: services,
  styles: { fontSize: 9, lineColor: [200, 200, 200], lineWidth: 0.1 },
  headStyles: {
    fillColor: [245, 246, 250],
    textColor: 20,
    halign: 'center',
    fontStyle: 'bold',
  },
  bodyStyles: {
    fillColor: [255, 255, 255],
    textColor: 20,
  },
  columnStyles: {
    0: { halign: 'center', cellWidth: 8 },  
    1: { halign: 'left', cellWidth: 45 },    
    2: { halign: 'center', cellWidth: 25 },  
    3: { halign: 'center', cellWidth: 25 },  
    4: { halign: 'center', cellWidth: 25 },  
    5: { halign: 'right', cellWidth: 30 },   
    6: { halign: 'right', cellWidth: 30 },   
  },
  margin: { left: marginLeft, right: marginRight },
});


  let y2 = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : y + 60;

  const grandTotal = details.reduce((s, d) => {
    const harga = Number(d.HARGABELI ?? d.HARGA ?? 0);
    const qty = Number(d.QTY ?? d.QTY_BARANG ?? 0);
    return s + harga * qty;
  }, 0);

  doc.setFontSize(12);
  doc.text('Ringkasan Biaya', marginLeft, y2);
  y2 += 6;

  doc.setFontSize(10);
  doc.text('Biaya Obat atau Alat Kesehatan:', marginLeft, y2);
  doc.text(formatRupiah(grandTotal), doc.internal.pageSize.width - marginRight, y2, { align: 'right' });
  y2 += 10;

  doc.setFontSize(9);
  doc.text(
    'Terima kasih atas kepercayaan anda menggunakan layanan kami.',
    doc.internal.pageSize.width / 2,
    y2,
    { align: 'center' }
  );

  return doc.output('datauristring');
}



  const handleExportPdf = async () => {
    if (!selectedRow) return
    try {
      setLoadingExport(true)

      const pdfDataUrl = await exportPDF(selectedRow, dataAdjust)
      console.log("selectedRow", selectedRow)
      setPdfUrl(pdfDataUrl)
      setFileName(`Kartu_Stok_${selectedRow.NAMASUPPLIER}`)
      setAdjustDialog(false)
      setJsPdfPreviewOpen(true)
    } finally {
      setLoadingExport(false)
    }
  }  

  const footer = () => (
    <div className="flex flex-row">
      <Button
        label="Export PDF"
        icon="pi pi-file"
        className="p-button-danger"
        onClick={handleExportPdf}
        loading={loadingExport}
      />
    </div>
  )

  return (
    <Dialog
      visible={adjustDialog}
      onHide={() => setAdjustDialog(false)}
      header="Pengaturan Cetak"
      style={{ width: '50vw' }}
    >
      <div className="grid p-fluid">
        <div className="col-12 md:col-6">
          <div className="grid formgrid">
            <h5 className="col-12 mb-2">Pengaturan Margin (mm)</h5>
            {['Top', 'Bottom', 'Right', 'Left'].map((label) => (
              <div className="col-6 field" key={label}>
                <label>Margin {label}</label>
                <InputNumber
                  value={dataAdjust[`margin${label}`]}
                  onChange={(e) => onInputChangeNumber(e, `margin${label}`)}
                  min={0}
                  suffix=" mm"
                  showButtons
                  className="w-full"
                  inputStyle={{ padding: '0.3rem' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 md:col-6">
          <div className="grid formgrid">
            <h5 className="col-12 mb-2">Pengaturan Kertas</h5>
            <div className="col-12 field">
              <label>Ukuran Kertas</label>
              <Dropdown
                value={dataAdjust.paperSize}
                options={paperSizes}
                onChange={(e) => onInputChange(e, 'paperSize')}
                optionLabel="name"
                className="w-full"
              />
            </div>
            <div className="col-12 field">
              <label>Orientasi</label>
              <Dropdown
                value={dataAdjust.orientation}
                options={orientationOptions}
                onChange={(e) => onInputChange(e, 'orientation')}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <Toolbar className="py-2 justify-content-end" end={footer} />
    </Dialog>
  )
}