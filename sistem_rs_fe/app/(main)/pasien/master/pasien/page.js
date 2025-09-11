'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '@/app/components/headerbar';
import TabelPasien from './components/tabelPasien';
import FormDialogPasien from './components/formDialogPasien';
import ToastNotifier from '@/app/components/toastNotifier';
import FilterTanggal from '@/app/components/filterTanggal';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from "primereact/button";
import AdjustPrintMarginLaporan from "./print/adjustPrintMarginLaporan";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [agamaOptions, setAgamaOptions] = useState([]);
  const [asuransiOptions, setAsuransiOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const PDFViewer = dynamic(() => import("./print/PDFViewer"), { ssr: false });

  const fetchAgama = async () => {
    try {
      const res = await axios.get(`${API_URL}/agama`);
      const options = res.data.data.map((item) => ({
        label: item.NAMAAGAMA,
        value: item.IDAGAMA,
      }));
      setAgamaOptions(options);
    } catch (err) {
      console.error('Gagal ambil data pasien:', err);
    }
  };

  const fetchAsuransi = async () => {
    try {
      const res = await axios.get(`${API_URL}/asuransi`);
      const options = res.data.data.map((item) => ({
        label: item.NAMAASURANSI,
        value: item.IDASURANSI,
      }));
      setAsuransiOptions(options);
    } catch (err) {
      console.error('Gagal ambil data asuransi:', err);
    }
  };

  const [form, setForm] = useState({
    NOREKAMMEDIS: '',
    NIK: '',
    NAMALENGKAP: '',
    TANGGALLAHIR: '',
    JENISKELAMIN: 'L',
    IDASURANSI: '',
    ALAMAT: '',
    ALAMAT_KTP: '',
    NOHP: '',
    USIA: '',
    IDAGAMA: '',
    GOLDARAH: '',
    NOASURANSI: '',
  });

  const [errors, setErrors] = useState({});

  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
    fetchAgama();
    fetchAsuransi();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/pasien`);
      const sortedData = res.data.data.sort((a, b) => b.IDPASIEN - a.IDPASIEN);
      setData(sortedData);
      setOriginalData(sortedData);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.NAMALENGKAP.trim()) newErrors.NAMALENGKAP = <span style={{ color: 'red' }}>Nama wajib diisi</span>;
    if (!form.NIK.trim()) {
      newErrors.NIK = <span style={{ color: 'red' }}>NIK wajib diisi</span>;
    } else if (!/^\d{16}$/.test(form.NIK)) {
      newErrors.NIK = <span style={{ color: 'red' }}>NIK harus 16 digit angka</span>;
    }

    if (!form.TANGGALLAHIR) newErrors.TANGGALLAHIR =
      <span style={{ color: 'red' }}>
        Tanggal Lahir wajib diisi
      </span>;
    if (!form.JENISKELAMIN) newErrors.JENISKELAMIN =
      <span style={{ color: 'red' }}>
        Jenis kelamin wajib dipilih
      </span>;
    if (!form.ALAMAT?.trim()) newErrors.ALAMAT =
      <span style={{ color: 'red' }}>
        Alamat wajib diisi
      </span>;
    if (!form.NOHP?.trim()) {
      newErrors.NOHP =
        <span style={{ color: 'red' }}>
          No HP wajib diisi
        </span>;
    } else if (!/^\d{9,13}$/.test(form.NOHP)) {
      newErrors.NOHP =
        <span style={{ color: 'red' }}>
          No HP harus 9–13 digit angka
        </span>;
    } else if (!/^\d{1,3}$/.test(form.USIA)) {
      newErrors.USIA =
        <span style={{ color: 'red' }}>
          No HP harus 1–3 digit angka
        </span>;
    }

    if (!form.IDAGAMA) newErrors.IDAGAMA =
      <span style={{ color: 'red' }}>
        Agama wajib diisi
      </span>;
    if (!form.GOLDARAH) newErrors.GOLDARAH =
      <span style={{ color: 'red' }}>
        Golongan darah wajib dipilih
      </span>;
    if (!form.IDASURANSI) {
      newErrors.IDASURANSI =
        <span style={{ color: 'red' }}>
          Asuransi wajib dipilih
        </span>;
    } else {
      const selected = asuransiOptions.find(opt => opt.value === form.IDASURANSI);
      if (selected?.label !== 'Umum' && !form.NOASURANSI.trim()) {
        newErrors.NOASURANSI =
          <span style={{ color: 'red' }}>
            No Asuransi wajib diisi
          </span>;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSearch = (keyword) => {
    if (!keyword) {
      setData(originalData);
    } else {
      const filtered = originalData.filter(
        (item) =>
          item.NIK.toLowerCase().includes(keyword.toLowerCase()) ||
          item.NAMALENGKAP.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };

    const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);
    const filtered = originalData.filter((item) => {
      const visitDate = new Date(item.TANGGALDAFTAR);
      const from = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
      const to = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;
      return (!from || visitDate >= from) && (!to || visitDate <= to);
    });
    setData(filtered);
  };

  const resetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setData(originalData);
  };

  const handleSubmit = async () => {

    if (!validateForm()) return;

    const isEdit = !!form.IDPASIEN;
    const url = isEdit
      ? `${API_URL}/pasien/${form.IDPASIEN}`
      : `${API_URL}/pasien`;

    try {
      const payload = {
        ...form,
        TANGGALLAHIR: form.TANGGALLAHIR,
      };

      if (isEdit) {
        await axios.put(url, payload);
        toastRef.current?.showToast('00', 'Data pasien berhasil diperbarui');
      } else {
        await axios.post(url, payload);
        toastRef.current?.showToast('00', 'Pasien baru berhasil didaftarkan');
      }

      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal simpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data pasien');
    }
  };

  const handleEdit = (row) => {
    const formattedTanggal = row.TANGGALLAHIR
      ? new Date(row.TANGGALLAHIR).toISOString().split('T')[0]
      : '';

    setForm({
      ...row,
      TANGGALLAHIR: formattedTanggal,
    });

    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Apakah Anda yakin ingin menghapus pasien '${row.NAMALENGKAP}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/pasien/${row.IDPASIEN}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data pasien berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data pasien');
        }
      },
    });
  };

  const resetForm = () => {
    setForm({
      NOREKAMMEDIS: '',
      NIK: '',
      NAMALENGKAP: '',
      TANGGALLAHIR: '',
      JENISKELAMIN: 'L',
      IDASURANSI: '',
      ALAMAT: '',
      ALAMAT_KTP: '',
      NOHP: '',
      USIA: '',
      IDAGAMA: '',
      GOLDARAH: '',
      NOASURANSI: '',
    });
    setErrors({});
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Master Data Pasien</h3>

      <div className="flex flex-col md:flex-row justify-content-between md:items-center gap-4">
        <FilterTanggal
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          handleDateFilter={handleDateFilter}
          resetFilter={resetFilter}
        />
      <div className="flex items-center justify-end">
        <Button
          icon="pi pi-print"
          className="p-button-warning mt-3"
          tooltip="Atur Print Margin"
          onClick={() => {
            handleDateFilter();
            setAdjustDialog(true);
          }}
        />
      <HeaderBar
        title=""
        placeholder="Cari berdasarkan NIK atau Nama"
        onSearch={handleSearch}
        onAddClick={() => {
          resetForm();
          setDialogVisible(true);
        }}
      />
      </div>
      </div>

      <TabelPasien
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogPasien
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
        agamaOptions={agamaOptions}
        asuransiOptions={asuransiOptions}
      />

      <AdjustPrintMarginLaporan
        adjustDialog={adjustDialog}
        setAdjustDialog={setAdjustDialog}
        selectedRow={null}
        dataPasien={data}
        setPdfUrl={setPdfUrl}
        setFileName={setFileName}
        setJsPdfPreviewOpen={setJsPdfPreviewOpen}
      />

      <Dialog
        visible={jsPdfPreviewOpen}
        onHide={() => setJsPdfPreviewOpen(false)}
        modal
        style={{ width: "90vw", height: "90vh" }}
        header="Preview PDF"
      >
        <PDFViewer pdfUrl={pdfUrl} fileName={fileName} paperSize="A4" />
      </Dialog>
    </div>
  );
};

export default Page;