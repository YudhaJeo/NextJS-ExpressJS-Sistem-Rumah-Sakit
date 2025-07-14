'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import FormDialogPengobatan from './components/formDialogRiwayat';
import TabelPengobatan from './components/tabelRiwayat';
import HeaderBar from '@/app/components/headerbar';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [pendaftaranOptions, setPendaftaranOptions] = useState([]);
  const [form, setForm] = useState(initialForm());
  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
    fetchPendaftaran();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(`${API_URL}/riwayatpengobatan`);
    setData(res.data.data);
  };

  const fetchPendaftaran = async () => {
    const res = await axios.get(`${API_URL}/pendaftaran`);
    const options = res.data.data.map((p) => ({
      label: `${p.NIK} - ${p.NAMALENGKAP}`,
      value: p.IDPENDAFTARAN,
      NIK: p.NIK,
      NAMALENGKAP: p.NAMALENGKAP,
      TANGGALKUNJUNGAN: p.TANGGALKUNJUNGAN?.split('T')[0] || '',
      KELUHAN: p.KELUHAN,
      POLI: p.NAMAPOLI,
    }));
    setPendaftaranOptions(options);
  };

  const handleSubmit = async () => {
    const isEdit = !!form.IDPENGOBATAN;
    const url = isEdit
      ? `${API_URL}/riwayatpengobatan/${form.IDPENGOBATAN}`
      : `${API_URL}/riwayatpengobatan`;
    const payload = {
      IDPENDAFTARAN: form.IDPENDAFTARAN,
      STATUSKUNJUNGAN: form.STATUSKUNJUNGAN,
      STATUSRAWAT: form.STATUSRAWAT,
      DIAGNOSA: form.DIAGNOSA,
      OBAT: form.OBAT,
    };

    try {
      if (isEdit) {
        await axios.put(url, payload);
      } else {
        await axios.post(url, payload);
      }
      fetchData();
      toastRef.current?.showToast('00', 'Data berhasil disimpan');
      setDialogVisible(false);
      setForm(initialForm());
    } catch (err) {
      toastRef.current?.showToast('01', 'Gagal simpan data');
    }
  };

  const handleEdit = (row) => {
    setForm({ ...row });
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Hapus riwayat ${row.NAMALENGKAP}?`,
      header: 'Konfirmasi',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await axios.delete(`${API_URL}/riwayatpengobatan/${row.IDPENGOBATAN}`);
        fetchData();
        toastRef.current?.showToast('00', 'Data berhasil dihapus');
      },
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <HeaderBar
        title="Riwayat Pengobatan"
        onAddClick={() => {
          setForm(initialForm());
          setDialogVisible(true);
        }}
      />

      <TabelPengobatan
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialogPengobatan
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        pendaftaranOptions={pendaftaranOptions}
      />
    </div>
  );
};

const initialForm = () => ({
  IDPENGOBATAN: '',
  IDPENDAFTARAN: '',
  NIK: '',
  NAMALENGKAP: '',
  TANGGALKUNJUNGAN: '',
  KELUHAN: '',
  POLI: '',
  STATUSKUNJUNGAN: 'Diperiksa',
  STATUSRAWAT: '',
  DIAGNOSA: '',
  OBAT: '',
});

export default Page;
