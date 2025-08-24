// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_fe\app\(dashboard)\(rawat_inap)\rawat_inap\menu\rawat_inap\page.js
'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '@/app/components/headerbar';
import TabelRawatInap from './components/tabelRawatInap';
import FormRawatInap from './components/formRawatInap';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import FilterTanggal from '@/app/components/filterTanggal';
import dayjs from "dayjs";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const toastRef = useRef(null);

  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [rawatJalanOptions, setRawatJalanOptions] = useState([]);
  const [bedOptions, setBedOptions] = useState([]);
  const [tenagaMedisOptions, setTenagaMedisOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [formRawatInapMode, setFormRawatInapMode] = useState("edit");
  const [selectedRawat, setSelectedRawat] = useState(null)

  const defaultForm = {
    IDRAWATINAP: '',
    IDRAWATJALAN: '',
    POLI: '',
    DIAGNOSA: '',
    NAMAPASIEN: '',
    UMUR: '',
    JENISKELAMIN: '',
    NIK: '',
    ALAMAT_PASIEN: '',
    IDBED: '',
    NAMAKAMAR: '',
    NAMABANGSAL: '',
    HARGAPERHARI: '',
    TANGGALMASUK: '',
    TANGGALKELUAR: '',
    STATUS: 'AKTIF',
    STATUSBED: '',
    CATATAN: ''
  };
  
  const [form, setForm] = useState(defaultForm);


  useEffect(() => {
    fetchRawatInap();
    fetchRawatJalan();
    fetchBed();
    fetchTenagaMedis();
  }, []);

  useEffect(() => {
    if (form.IDRAWATINAP) {
      fetchBed();
    }
  }, [form.IDRAWATINAP]);

  const fetchRawatInap = async () => {
    try {
      const res = await axios.get(`${API_URL}/rawat_inap`);
      setData(res.data.data); 
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data rawat inap:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRawatJalan = async () => {
    try {
      const res = await axios.get(`${API_URL}/rawat_jalan`);
      const options = res.data.data
        .filter((item) => item.STATUSRAWAT === 'Rawat Inap')  
        .map((item) => ({
          label: `${item.NAMALENGKAP}`,
          value: item.IDRAWATJALAN,
          POLI: item.POLI,
          JENISKELAMIN: item.JENISKELAMIN,
          NIK: item.NIK,
          ALAMAT_PASIEN: item.ALAMAT_PASIEN,
          DIAGNOSA: item.DIAGNOSA,
          NAMALENGKAP: item.NAMALENGKAP,
      }));
      setRawatJalanOptions(options);
    } catch (err) {
      console.error('Gagal ambil data Rawat Inap:', err);
    }
  };

  
  const fetchBed = async () => {
    try {
      const res = await axios.get(`${API_URL}/bed`);
      const options = res.data.data
        .filter((item) => {
          return item.STATUS === 'TERSEDIA' || 
                 (form.IDRAWATINAP && item.IDBED === form.IDBED);
        })
        .map((item) => ({
          label: `${item.NOMORBED} - ${item.NAMAKAMAR} (${item.NAMABANGSAL})`,
          value: item.IDBED,
          NAMAKAMAR: item.NAMAKAMAR, 
          NAMABANGSAL: item.NAMABANGSAL,
          HARGAPERHARI: item.HARGAPERHARI,
          STATUSBED: item.STATUS,
        }));
      setBedOptions(options);
    } catch (err) {
      console.error('Gagal ambil bed:', err);
    }
  };

  const fetchTenagaMedis = async () => {
    try {
      const res = await axios.get(`${API_URL}/tenaga_medis`);
      const options = res.data.data.map((item) => ({
        label: item.NAMALENGKAP,
        value: item.IDTENAGAMEDIS,
        JENISTENAGAMEDIS: item.JENISTENAGAMEDIS,
        NAMATENAGAMEDIS: item.NAMALENGKAP,
      }));
      setTenagaMedisOptions(options);
    } catch (err) {
      console.error('Gagal ambil data tenaga medis:', err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.IDRAWATJALAN) newErrors.IDRAWATJALAN = 'Rawat Inap harus dipilih';
    if (!form.IDBED) newErrors.IDBED = 'Bed harus dipilih';
    if (!form.TANGGALMASUK) newErrors.TANGGALMASUK = 'Tanggal masuk wajib';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  

  const resetForm = () => {
    setForm(defaultForm)
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
  
    const isEdit = !!form.IDRAWATINAP;
    const url = isEdit
      ? `${API_URL}/rawat_inap/${form.IDRAWATINAP}`
      : `${API_URL}/rawat_inap`;
  
    const payload = {
      ...form,
      STATUS: form.TANGGALKELUAR ? 'SELESAI' : 'AKTIF',
      TANGGALMASUK: form.TANGGALMASUK
        ? new Date(form.TANGGALMASUK).toISOString().slice(0, 19).replace("T", " ")
        : null,
      TANGGALKELUAR:
        form.TANGGALKELUAR && form.TANGGALKELUAR !== ''
          ? new Date(form.TANGGALKELUAR).toISOString().slice(0, 19).replace("T", " ")
          : null,        
      CATATAN: form.CATATAN?.trim() || null,
    };

    if (isEdit) {
      payload.IDBED = form.IDBED;
      payload.TANGGALMASUK = form.TANGGALMASUK
        ? new Date(form.TANGGALMASUK).toISOString().slice(0, 19).replace("T", " ")
        : null;
    }
    
    try {
      let response;
      if (isEdit) {
        response = await axios.put(url, payload);
      } else {
        response = await axios.post(url, payload);
      }
    
      if (response.status === 200) {
        fetchRawatInap();
        resetForm();

        fetchBed();
        fetchRawatInap();
        fetchRawatJalan();
        fetchTenagaMedis();
        toastRef.current?.showToast('00', 'Data berhasil disimpan');
      } else {
        throw new Error('Respons tidak valid');
      }
    } catch (err) {
      console.error('Gagal simpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
    }      
  };

  const handleEdit = (row) => {
    setForm({
      IDRAWATINAP: row.IDRAWATINAP,
      IDRAWATJALAN: row.IDRAWATJALAN,
      IDBED: row.IDBED,
      POLI: row.POLI || '',
      DIAGNOSA: row.DIAGNOSA || '',
      JENISKELAMIN: row.JENISKELAMIN || '',
      NIK: row.PASIEN_NIK || '',
      ALAMAT_PASIEN: row.ALAMAT_PASIEN || '',
      NAMAKAMAR: row.NAMAKAMAR || '',
      NAMABANGSAL: row.NAMABANGSAL || '',
      HARGAPERHARI: row.HARGAPERHARI || '',
      TANGGALMASUK: row.TANGGALMASUK,
      TANGGALKELUAR: row.TANGGALKELUAR || '',
      CATATAN: row.CATATAN || '',
      STATUS: row.STATUS || '',
    });    
    setDialogVisible(true); 
    fetchTindakanInapByRawatInapId(row.IDRAWATINAP);
    fetchObatInapByRawatInapId(row.IDRAWATINAP);
    fetchAlkesInapByRawatInapId(row.IDRAWATINAP);
  };
  
  const fetchObatInapByRawatInapId = async (idRawatInap) => {
    try {
      const res = await axios.get(`${API_URL}/obat_inap/rawat_inap/${idRawatInap}`);
      return res.data.data || [];
    } catch (err) {
      console.error('Gagal ambil data obat inap:', err);
      return [];
    }
  };  

  const fetchTindakanInapByRawatInapId = async (idRawatInap) => {
    try {
      const res = await axios.get(`${API_URL}/tindakan_inap/rawat_inap/${idRawatInap}`);
      return res.data.data || [];
    } catch (err) {
      console.error('Gagal ambil data tindakan inap:', err);
      return [];
    }
  }; 
  
  const fetchAlkesInapByRawatInapId = async (idRawatInap) => {
    try {
      const res = await axios.get(`${API_URL}/alkes_inap/rawat_inap/${idRawatInap}`);
      return res.data.data || [];
    } catch (err) {
      console.error('Gagal ambil data alkes inap:', err);
      return [];
    }
  }; 
  

  const handleDelete = (row) => {
    confirmDialog({
      message: `Yakin hapus data rawat inap ini?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/rawat_inap/${row.IDRAWATINAP}`);
          fetchRawatInap();
          toastRef.current?.showToast('00', 'Data berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  const handleCheckout = (row) => {
    confirmDialog({
      message: `Anda yakin akan menyelesaikan rawat inap ini?`,
      header: `Konfirmasi Checkout`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          const today = dayjs().format("YYYY-MM-DD");
          const data = await axios.put(
            `${API_URL}/rawat_inap/${row.IDRAWATINAP}`,
            { TANGGALKELUAR: today },
            { headers: { "Content-Type": "application/json" } }
          );
          toastRef.current?.showToast('00', 'Rawat inap berhasil diselesaikan');
          setDialogVisible(false);
          fetchRawatInap();
        } catch (err) {
          toastRef.current?.showToast('01', 'Gagal menyelesaikan transaksi rawat inap');
          console.error("Gagal menyelesaikan transaksi:", err.message);
        }
      }
    });
  };  

  const handleCancelCheckout = (row) => {
    confirmDialog({
      message: `Tindakan ini akan menghapus riwayat pada tabel riwayat rawat inap. Anda yakin ingin membatalkan checkout rawat inap ini?`,
      header: `Konfirmasi Batal Checkout`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.put(`${API_URL}/rawat_inap/${row.IDRAWATINAP}/cancel_checkout`);
          toastRef.current?.showToast('00', 'Checkout rawat inap berhasil dibatalkan');
          setDialogVisible(false);
          fetchRawatInap();
        } catch (err) {
          toastRef.current?.showToast('01', 'Gagal membatalkan checkout rawat inap');
          console.error("Gagal membatalkan checkout:", err.message);
        }
      }
    });
  };
  
  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);

    const filtered = originalData.filter((item) => {
      const visitDate = new Date(item.TANGGALMASUK);
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

  const handleSearch = (keyword) => {
    if (!keyword) return fetchRawatInap();
    const filtered = data.filter((item) =>
      item.NAMALENGKAP?.toLowerCase().includes(keyword.toLowerCase()) ||
      item.NOMORBED?.toLowerCase().includes(keyword.toLowerCase()) ||
      item.STATUS?.toLowerCase().includes(keyword.toLowerCase()) 
    );
    setData(filtered);
  }

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />
      <h3 className="text-xl font-semibold mb-3">Manajemen Rawat Inap</h3>

      <div className="flex flex-col md:flex-row justify-content-between md:items-center gap-4">
        <FilterTanggal
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          handleDateFilter={handleDateFilter}
          resetFilter={resetFilter}
        />
        <HeaderBar
          title=""
          placeholder="Cari pasien"
          onSearch={handleSearch}
        />
      </div>

      <TabelRawatInap
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        setFormRawatInapMode={setFormRawatInapMode}
        onCheckout={handleCheckout}    
        onCancelCheckout={handleCancelCheckout}
      />

      <FormRawatInap
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          setForm(defaultForm);
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
        rawatJalanOptions={rawatJalanOptions}
        bedOptions={bedOptions}
        tenagaMedisOptions={tenagaMedisOptions}
        mode={formRawatInapMode}
        selectedRawat={selectedRawat?.STATUS || ""}
      />
    </div>
  );
};

export default Page;