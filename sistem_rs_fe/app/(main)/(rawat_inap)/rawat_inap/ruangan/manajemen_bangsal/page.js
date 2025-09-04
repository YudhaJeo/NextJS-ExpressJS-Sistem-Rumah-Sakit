// app\(dashboard)\(rawat_inap)\rawat_inap\manajemen-bangsal\page.js
'use client';

import { 
  useEffect, 
  useRef, 
  useState 
} from 'react';
import axios from 'axios';
import HeaderBar from '@/app/components/headerbar';
import TabelBangsal from './components/tabelBangsal';
import FormDialogPasien from './components/formDialogBangsal';
import ToastNotifier from '@/app/components/toastNotifier';
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
  const [bangsalOption, setBangsalOptions] = useState([]);

  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const PDFViewer = dynamic(() => import("./print/PDFViewer"), { ssr: false });

  const fetchBangsal = async () => {
    try {
      const res = await axios.get(`${API_URL}/jenis_bangsal`);
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
    fetchData();
    fetchBangsal(); 
  }, []);
  

  const [form, setForm] = useState({
    IDBANGSAL: '',
    NAMABANGSAL: '',
    IDJENISBANGSAL: '',
    LOKASI: '',
  });

  const [errors, setErrors] = useState({});

  const toastRef = useRef(null);

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
  
    if (!form.LOKASI?.trim()) {
      newErrors.LOKASI = (
        <span style={{ color: 'red' }}>Lokasi bangsal wajib diisi</span>
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
      LOKASI: '',
    });    
    setErrors({});
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Manajemen Data Bangsal</h3>

      <div className='flex items-center justify-end'>
        <Button
          icon="pi pi-print"
          className="p-button-warning mt-3"
          tooltip="Atur Print Margin"
          onClick={() => setAdjustDialog(true)}
        />
        <HeaderBar
          title=""
          placeholder="Cari berdasarkan nama atau jenis bangsal"
          onSearch={handleSearch}
          onAddClick={() => {
            resetForm();
            setDialogVisible(true);
          }}
        />
      </div>

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
        bangsalOption={bangsalOption}
      />

      <AdjustPrintMarginLaporan
        adjustDialog={adjustDialog}
        setAdjustDialog={setAdjustDialog}
        selectedRow={null}
        data={data}
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