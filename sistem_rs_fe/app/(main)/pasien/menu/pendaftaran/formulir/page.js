'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import TabelPendaftaran from './components/tabelFormulir';
import FormDialogPendaftaran from './components/formDialogFormulir';
import HeaderBar from '@/app/components/headerbar';
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [poliOptions, setPoliOptions] = useState([]);
  const [pasienOptions, setPasienOptions] = useState([]);
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const PDFViewer = dynamic(() => import("./print/PDFViewer"), { ssr: false });

  const [form, setForm] = useState({
    IDPENDAFTARAN: 0,
    NIK: '',
    NAMALENGKAP: '',
    TANGGALKUNJUNGAN: '',
    KELUHAN: '',
    IDPOLI: '',
    STATUSKUNJUNGAN: 'Dalam Antrian',
  });

  const toastRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
    fetchPasien();
    fetchPoli();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/pendaftaran`);

      const sorted = [...res.data.data].sort(
        (a, b) => b.IDPENDAFTARAN - a.IDPENDAFTARAN
      );

      setData(sorted);
      setOriginalData(sorted);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPoli = async () => {
    try {
      const res = await axios.get(`${API_URL}/poli`);

      const options = res.data.map((poli) => ({
        label: `${poli.NAMAPOLI}`,
        value: poli.IDPOLI,
      }));

      setPoliOptions(options);
    } catch (err) {
      console.error('Gagal ambil data poli:', err);
    }
  };


  const fetchPasien = async () => {
    try {
      const res = await axios.get(`${API_URL}/pasien`);
      const options = res.data.data.map((pasien) => ({
        label: `${pasien.NIK} - ${pasien.NAMALENGKAP}`,
        value: pasien.NIK,
        NAMALENGKAP: pasien.NAMALENGKAP,
      }));
      setPasienOptions(options);
    } catch (err) {
      console.error('Gagal ambil data pasien:', err);
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword) return setData(originalData);
    const filtered = originalData.filter(
      (item) =>
        item.NIK.toLowerCase().includes(keyword.toLowerCase()) ||
        item.NAMALENGKAP.toLowerCase().includes(keyword.toLowerCase())
    );
    setData(filtered);
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);
    const filtered = originalData.filter((item) => {
      const visitDate = new Date(item.TANGGALKUNJUNGAN);
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
    const isEdit = !!form.IDPENDAFTARAN;
    const url = isEdit
      ? `${API_URL}/pendaftaran/${form.IDPENDAFTARAN}`
      : `${API_URL}/pendaftaran`;

    try {
      if (isEdit) {
        await axios.put(url, form);
        toastRef.current?.showToast('00', 'Data berhasil diperbarui');
      } else {
        await axios.post(url, form);
        toastRef.current?.showToast('00', 'Data berhasil ditambahkan');
      }
      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal simpan data:', err);
      const msg = err.response?.data?.error || 'Gagal menyimpan data';
      toastRef.current?.showToast('01', msg);
    }
  };

  const handleEdit = (row) => {
    const poli = poliOptions.find((p) => p.label === row.POLI);

    setForm({
      ...row,
      TANGGALKUNJUNGAN: row.TANGGALKUNJUNGAN?.split('T')[0] || '',
      IDPOLI: poli ? poli.value : null,
    });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Apakah Anda yakin ingin menghapus data milik ${row.NAMALENGKAP}?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/pendaftaran/${row.IDPENDAFTARAN}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  const resetForm = () => {
    const today = new Date().toISOString().split('T')[0];
    setForm({
      IDPENDAFTARAN: 0,
      NIK: '',
      NAMALENGKAP: '',
      TANGGALKUNJUNGAN: today,
      KELUHAN: '',
      IDPOLI: null,
      STATUSKUNJUNGAN: 'Dalam Antrian',
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Formulir Pendaftaran Kunjungan</h3>

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
          placeholder="Cari nama atau NIK..."
          onSearch={handleSearch}
          onAddClick={() => {
            resetForm();
            setDialogVisible(true);
          }}
        />
      </div>
      </div>

      <TabelPendaftaran
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        poliOptions={poliOptions}
      />

      <FormDialogPendaftaran
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        pasienOptions={pasienOptions}
        poliOptions={poliOptions}
      />
      <AdjustPrintMarginLaporan
        adjustDialog={adjustDialog}
        setAdjustDialog={setAdjustDialog}
        selectedRow={null}
        dataFormulir={data}
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
}

export default Page;