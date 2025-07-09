// app\(dashboard)\(rawatinap)\rawatinap\manajemen-bangsal\page.js
'use client';

import { 
  useEffect, 
  useRef, 
  useState 
} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import HeaderBar from '@/app/components/headerbar';
import TabelBangsal from './components/tabelBangsal';
import FormDialogPasien from './components/formDialogBangsal';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [bangsalOption, setBangsalOptions] = useState([]);

  const fetchBangsal = async () => {
    try {
      const res = await axios.get(`${API_URL}/jenisbangsal`);
      const options = res.data.data.map((item) => ({
        label: item.NAMAJENIS,
        value: item.IDJENISBANGSAL,
      }));
      setBangsalOptions(options); 
    } catch (err) {
      console.error('Gagal ambil data jenis bangsal:', err);
    }
  };
  
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }
  
    fetchData();
    fetchBangsal(); 
  }, []);
  

  const [form, setForm] = useState({
    IDBANGSAL: '',
    NAMABANGSAL: '',
    IDJENISBANGSAL: '',
    KAPASITAS: '',
    TERISI: '',
    STATUS: 'TERSEDIA',
    KETERANGAN: '',
  });

  const [errors, setErrors] = useState({});

  const toastRef = useRef(null);
  const router = useRouter();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/bangsal`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
  
    if (!form.NAMABANGSAL?.trim()) {
      newErrors.NAMABANGSAL = (
        <span style={{ color: 'red' }}>Nama bangsal wajib diisi</span>
      );
    }
  
    if (!form.IDJENISBANGSAL) {
      newErrors.IDJENISBANGSAL = (
        <span style={{ color: 'red' }}>Jenis bangsal wajib dipilih</span>
      );
    }
  
    if (!form.KAPASITAS || isNaN(form.KAPASITAS)) {
      newErrors.KAPASITAS = (
        <span style={{ color: 'red' }}>Kapasitas wajib diisi dan harus berupa angka</span>
      );
    }
  
    if (!form.TERISI || isNaN(form.TERISI)) {
      newErrors.TERISI = (
        <span style={{ color: 'red' }}>Tersedia wajib diisi dan harus berupa angka</span>
      );
    }
  
    if (!form.STATUS) {
      newErrors.STATUS = (
        <span style={{ color: 'red' }}>Status wajib dipilih</span>
      );
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
          item.NAMABANGSAL.toLowerCase().includes(keyword.toLowerCase()) ||
          item.NAMAJENIS?.toLowerCase().includes(keyword.toLowerCase())
      );
      setData(filtered);
    }
  };
  

  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    const isEdit = !!form.IDBANGSAL;
    const url = isEdit
      ? `${API_URL}/bangsal/${form.IDBANGSAL}`
      : `${API_URL}/bangsal`;
  
      const payload = {
        ...form,
        KAPASITAS: parseInt(form.KAPASITAS),
        TERISI: parseInt(form.TERISI)
      };
      
  
    try {
      if (isEdit) {
        await axios.put(url, payload);
        toastRef.current?.showToast('00', 'Data bangsal berhasil diperbarui');
      } else {
        await axios.post(url, payload);
        toastRef.current?.showToast('00', 'Bangsal baru berhasil didaftarkan');
      }
  
      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal simpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data bangsal');
    }
  };
  
  const handleEdit = (row) => {
    setForm({ ...row });
    setDialogVisible(true);
  };
  

  const handleDelete = (row) => {
    confirmDialog({
      message: `Apakah Anda yakin ingin menghapus bangsal '${row.NAMABANGSAL}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/bangsal/${row.IDBANGSAL}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data bangsal berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data bangsal');
        }
      },
    });
  };
  

  const resetForm = () => {
    setForm({
      IDBANGSAL: '',
      NAMABANGSAL: '',
      IDJENISBANGSAL: '',
      KAPASITAS: '',
      TERISI: '',
      STATUS: '',
      KETERANGAN: '',
    });
    setErrors({});
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Manajemen Data Bangsal</h3>

      <HeaderBar
        title=""
        placeholder="Cari berdasarkan nama atau jenis bangsal"
        onSearch={handleSearch}
        onAddClick={() => {
          resetForm();
          setDialogVisible(true);
        }}
      />

      <TabelBangsal 
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
        // DROP DOWN OPTION
        bangsalOption={bangsalOption}
      />
    </div>
  );
};

export default Page;