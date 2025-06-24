'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import TabelDokumen from './components/tabelDokumen';
import { Dokumen } from '@/types/dokumen';

const JenisDokumenOptions = [
  { label: 'Hasil Lab', value: 'Hasil Lab' },
  { label: 'Resume Medis', value: 'Resume Medis' },
  { label: 'Rekam Rawat Jalan', value: 'Rekam Rawat Jalan' },
];

const Page = () => {
  const [data, setData] = useState<Dokumen[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState<Dokumen>({
    IDDOKUMEN: 0,
    NAMALENGKAP: "",
    NIK: "",
    JENISDOKUMEN: "",
    NAMAFILE: "",
    LOKASIFILE: "",
    TANGGALUPLOAD: new Date().toISOString(),
    file: undefined,
  });

  const [pasienOptions, setPasienOptions] = useState<
    { label: string; value: string; NAMALENGKAP: string }[]
  >([]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fetchPasien = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/pasien");
      const options = res.data.data.map((pasien: any) => ({
        label: `${pasien.NIK} - ${pasien.NAMALENGKAP}`,
        value: pasien.NIK,
        NAMALENGKAP: pasien.NAMALENGKAP,
      }));
      setPasienOptions(options);
    } catch (err) {
      console.error("Gagal ambil data pasien:", err);
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/dokumen');
      console.log('Data dari API:', res.data);
      setData(res.data.data);
    } catch (err) {
      console.error('Gagal mengambil data dokumen:', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPasien();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.NIK.trim()) newErrors.NIK = 'NIK wajib diisi';
    else if (!/^\d{16}$/.test(form.NIK)) newErrors.NIK = 'NIK harus 16 digit angka';
    if (!form.JENISDOKUMEN) newErrors.JENISDOKUMEN = 'Jenis dokumen wajib dipilih';
    if (!form.file && !form.IDDOKUMEN) newErrors.file = 'File wajib diunggah';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const formData = new FormData();
    formData.append('NIK', form.NIK);
    formData.append('JENISDOKUMEN', form.JENISDOKUMEN || '');
    formData.append('NAMAFILE', form.NAMAFILE); // penting kalau NAMAFILE digunakan

    // Jika ada file baru, tambahkan ke FormData
    if (form.file) {
      formData.append('file', form.file);
    }

    if (form.IDDOKUMEN) {
      await axios.put(`http://localhost:4000/api/dokumen/${form.IDDOKUMEN}`, formData);
    } else {
      await axios.post('http://localhost:4000/api/dokumen', formData);
    }

    fetchData();
    setDialogVisible(false);
    resetForm();
  } catch (err) {
    console.error('Gagal menyimpan data:', err);
  }
};

  const handleEdit = (row: Dokumen) => {
    setForm({
      IDDOKUMEN: row.IDDOKUMEN,
      NAMALENGKAP: row.NAMALENGKAP,
      NIK: row.NIK,
      JENISDOKUMEN: row.JENISDOKUMEN || "",
      NAMAFILE: row.NAMAFILE || "",
      LOKASIFILE: row.LOKASIFILE || "",
      TANGGALUPLOAD: row.TANGGALUPLOAD,
      file: undefined,
    });
    setDialogVisible(true);
  };

  const handleDelete = async (row: Dokumen) => {
    try {
      await axios.delete(`http://localhost:4000/api/dokumen/${row.IDDOKUMEN}`);
      fetchData();
    } catch (err) {
      console.error('Gagal menghapus dokumen:', err);
    }
  };

  const resetForm = () => {
    setForm({
      IDDOKUMEN: 0,
      NAMALENGKAP: "",
      NIK: "",
      JENISDOKUMEN: "",
      NAMAFILE: "",
      LOKASIFILE: "",
      TANGGALUPLOAD: new Date().toISOString(),
      file: undefined,
    });
    setErrors({});
  };

  const inputClass = (field: string) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <div className="card">
      <h3 className="text-xl font-semibold">Manajemen Dokumen Rekam Medis</h3>

      <div className="flex justify-end my-3">
        <Button
          label="Tambah Dokumen"
          icon="pi pi-plus"
          onClick={() => {
            setDialogVisible(true);
            resetForm();
          }}
        />
      </div>

      <TabelDokumen
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={false}
        onDownload={() => {}}
      />

      <Dialog
        header={form.IDDOKUMEN ? 'Edit Dokumen' : 'Tambah Dokumen'}
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        style={{ width: '30vw' }}
      >
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            <label>Nama Pasien</label>
            <InputText
              className="w-full mt-2"
              value={form.NAMALENGKAP}
              disabled
            />
          </div>
          <div>
            <label>NIK Pasien</label>
            <Dropdown
              className={inputClass('NIK')}
              value={form.NIK}
              options={pasienOptions}
              onChange={(e) => {
                const selected = pasienOptions.find((p) => p.value === e.value);
                setForm({
                  ...form,
                  NIK: e.value,
                  NAMALENGKAP: selected?.NAMALENGKAP || '',
                });
              }}
              placeholder="Pilih NIK"
              filter
              showClear
            />
            {errors.NIK && <small className="text-red-500">{errors.NIK}</small>}
          </div>
          <div>
            <label>Nama File</label>
            <InputText
              className={inputClass('NAMAFILE')}
              value={form.NAMAFILE}
              onChange={(e) => setForm({ ...form, NAMAFILE: e.target.value })}
              placeholder="Masukkan nama file"
            />
            {errors.NAMAFILE && (
              <small className="text-red-500">{errors.NAMAFILE}</small>
            )}
          </div>
          <div>
            <label>Jenis Dokumen</label>
            <Dropdown
              className={inputClass('JENISDOKUMEN')}
              options={JenisDokumenOptions}
              value={form.JENISDOKUMEN}
              onChange={(e) => setForm({ ...form, JENISDOKUMEN: e.value })}
              placeholder="Pilih"
            />
            {errors.JENISDOKUMEN && (
              <small className="text-red-500">{errors.JENISDOKUMEN}</small>
            )}
          </div>
          <div>
            <label>Unggah File</label>
            <input
              type="file"
              className={inputClass('file')}
              onChange={(e: any) => {
                const file = e.target.files[0];
                setForm({ ...form, file });
              }}
            />
            {errors.file && <small className="text-red-500">{errors.file}</small>}
          </div>


          <div className="text-right pt-3">
            <Button type="submit" label="Simpan" icon="pi pi-save" />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default Page;
