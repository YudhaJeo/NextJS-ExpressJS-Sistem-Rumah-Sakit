'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import FilterTanggal from '@/app/components/filterTanggal';
import TabelAngsuran from './components/tabelAngsuran';
import FormDialogAngsuran from './components/formDialogAngsuran';
import { Button } from 'primereact/button';
import AdjustPrintMarginLaporan from './print/adjustPrintMarginLaporan';
import { Dialog } from 'primereact/dialog';
import dynamic from 'next/dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [invoiceOptions, setInvoiceOptions] = useState([]);
  const [metodeOptions, setMetodeOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);

  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);

  const [form, setForm] = useState({
    IDANGSURAN: 0,
    NOANGSURAN: '',
    NIK: '',
    NAMALENGKAP: '',
    NAMAASURANSI: '',
    IDINVOICE: '',
    NOMINAL: 0,
    TANGGALBAYAR: '',
    KETERANGAN: '',
    METODE: '',
    IDBANK: '',
  });

  const toastRef = useRef(null);
  const router = useRouter();

  const PDFViewer = dynamic(() => import('./print/PDFViewer'), { ssr: false });

  useEffect(() => {
    fetchData();
    fetchInvoices();
    fetchMetode();
    fetchBanks();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/angsuran`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data angsuran:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${API_URL}/invoice`);
      const options = res.data.data
        .filter((inv) => inv.STATUS !== 'LUNAS')
        .map((inv) => ({
          label: `${inv.NOINVOICE} - ${inv.NAMAPASIEN} | Sisa: ${formatRupiah(inv.SISA_TAGIHAN)}`,
          value: inv.IDINVOICE,
          NIK: inv.NIK,
          NAMAPASIEN: inv.NAMAPASIEN,
          NAMAASURANSI: inv.ASURANSI,
          SISA_TAGIHAN: inv.SISA_TAGIHAN,
        }));
      console.log("Data Invoice:", options)
      setInvoiceOptions(options);
    } catch (err) {
      console.error('Gagal ambil data invoice:', err);
    }
  };

  const fetchMetode = async () => {
    try {
      const res = await axios.get(`${API_URL}/metode_pembayaran/aktif`);
      const options = res.data.data.map((m) => ({
        label: m.NAMA,
        value: m.NAMA,
      }));
      setMetodeOptions(options);
    } catch (err) {
      console.error('Gagal ambil data metode pembayaran:', err);
    }
  };

  const fetchBanks = async () => {
    const res = await axios.get(`${API_URL}/bank_account`);
    const options = res.data.data
      .filter((b) => b.STATUS === 'AKTIF')
      .map((b) => ({
        label: `${b.NAMA_BANK} - ${b.NO_REKENING}`,
        value: b.IDBANK,
      }));
    setBankOptions(options);
  };

  const handleSearch = (keyword) => {
    if (!keyword) return setData(originalData);
    const filtered = originalData.filter(
      (item) =>
        item.NOINVOICE?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.NAMAPASIEN?.toLowerCase().includes(keyword.toLowerCase())
    );
    setData(filtered);
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);
    const filtered = originalData.filter((item) => {
      const tgl = new Date(item.TANGGAL);
      const from = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
      const to = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;
      return (!from || tgl >= from) && (!to || tgl <= to);
    });
    setData(filtered);
  };

  const resetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setData(originalData);
  };

  const handleSubmit = async () => {
    const isEdit = !!form.IDANGSURAN;
    const url = isEdit
      ? `${API_URL}/angsuran/${form.IDANGSURAN}`
      : `${API_URL}/angsuran`;

    try {
      const body = { ...form };
      delete body.NOINVOICE;
      delete body.NAMAPASIEN;
      if (!isEdit) delete body.IDANGSURAN;

      if (isEdit) {
        await axios.put(url, body);
        toastRef.current?.showToast('00', 'Data berhasil diperbarui');
      } else {
        await axios.post(url, body);
        toastRef.current?.showToast('00', 'Angsuran berhasil ditambahkan');
      }

      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal simpan data angsuran:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
    }
  };

  const handleEdit = (row) => {
    setForm({
      ...row,
      TANGGALBAYAR: row.TANGGALBAYAR?.split('T')[0] || '',
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Hapus angsuran invoice ${row.NOINVOICE}?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/angsuran/${row.IDANGSURAN}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data angsuran:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  const resetForm = () => {
    setForm({
      IDANGSURAN: 0,
      NOANGSURAN: '',
      NIK: '',
      NAMALENGKAP: '',
      NAMAASURANSI: '',
      IDINVOICE: '',
      NOMINAL: 0,
      TANGGALBAYAR: '',
      KETERANGAN: '',
      METODE: '',
      IDBANK: '',
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Manajemen Pembayaran Angsuran</h3>

      <div className="flex flex-col md:flex-row justify-content-between md:items-center gap-4">
        <FilterTanggal
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          handleDateFilter={handleDateFilter}
          resetFilter={resetFilter}
        />
        <div className="flex items-center gap-2">
          <Button
            icon="pi pi-print"
            className="p-button-warning mt-3"
            tooltip="Atur Print Margin"
            onClick={() => setAdjustDialog(true)}
          />
          <HeaderBar
            title=""
            placeholder="Cari no invoice atau nama pasien..."
            onSearch={handleSearch}
            onAddClick={() => {
              resetForm();
              setDialogVisible(true);
            }}
          />
        </div>
      </div>

      <TabelAngsuran
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogAngsuran
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        invoiceOptions={invoiceOptions}
        metodeOptions={metodeOptions}
        bankOptions={bankOptions}
      />

      <AdjustPrintMarginLaporan
        adjustDialog={adjustDialog}
        setAdjustDialog={setAdjustDialog}
        selectedRow={null}
        dataAngsuran={data}
        setPdfUrl={setPdfUrl}
        setFileName={setFileName}
        setJsPdfPreviewOpen={setJsPdfPreviewOpen}
      />

      <Dialog
        visible={jsPdfPreviewOpen}
        onHide={() => setJsPdfPreviewOpen(false)}
        modal
        style={{ width: '90vw', height: '90vh' }}
        header="Preview PDF"
      >
        <PDFViewer
          pdfUrl={pdfUrl}
          fileName={fileName}
          paperSize="A4"
        />
      </Dialog>
    </div>
  );
};

export default Page;