'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import TabelDokumen from './components/tabelDokumen';
import { Dokumen } from '@/types/dokumen';

const DokumenPage = () => {
  const [data, setData] = useState<Dokumen[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [pasienList, setPasienList] = useState<{
      NAMALENGKAP: any; NIK: string; NAMAPASIEN: string 
}[]>([]);
  const [form, setForm] = useState<Dokumen>({
    IDDOKUMEN: 0,
    NIK: '',
    NAMAFILE: '',
    JENISDOKUMEN: '',
    LOKASIFILE: '',
    TANGGALUPLOAD: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fetchDokumen = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:4000/api/dokumen');
      setData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPasien = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/pasien');
      setPasienList(res.data.data);
    } catch (err) {
      console.error('Gagal mengambil data pasien:', err);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.NIK) newErrors.NIK = 'NIK wajib dipilih';
    if (!form.NAMAFILE.trim()) newErrors.NAMAFILE = 'Nama file wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await axios.post('http://localhost:4000/api/dokumen', form);
      fetchDokumen();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal simpan data:', err);
    }
  };

  const resetForm = () => {
    setForm({
      IDDOKUMEN: 0,
      NIK: '',
      NAMAFILE: '',
      JENISDOKUMEN: '',
      LOKASIFILE: '',
      TANGGALUPLOAD: '',
    });
    setErrors({});
  };

  const handleDelete = async (row: Dokumen) => {
    try {
      await axios.delete(`http://localhost:4000/api/dokumen/${row.IDDOKUMEN}`);
      fetchDokumen();
    } catch (err) {
      console.error('Gagal hapus data:', err);
    }
  };

  useEffect(() => {
    fetchDokumen();
    fetchPasien();
  }, []);

  const inputClass = (field: string) => (errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2');

  return (
    <div className="card">
      <h3 className="text-xl font-semibold">Manajemen Dokumen Rekam Medis</h3>

      <div className="flex justify-content-end my-3">
        <Button
          label="Tambah Dokumen"
          icon="pi pi-plus"
          onClick={() => {
            setDialogVisible(true);
            resetForm();
          }}
        />
      </div>

      <TabelDokumen data={data} loading={isLoading} onDelete={handleDelete} />

      <Dialog
        header="Tambah Dokumen"
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        style={{ width: '40vw' }}
      >
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            <label>NIK Pasien</label>
            <Dropdown
              className={inputClass('NIK')}
              value={form.NIK}
              options={pasienList.map((p) => ({
                label: `${p.NIK} - ${p.NAMALENGKAP}`,
                value: p.NIK,
              }))}
              onChange={(e) => setForm({ ...form, NIK: e.value })}
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
            />
            {errors.NAMAFILE && <small className="text-red-500">{errors.NAMAFILE}</small>}
          </div>

          <div>
            <label>Jenis Dokumen</label>
            <InputText
              className="w-full mt-2"
              value={form.JENISDOKUMEN}
              onChange={(e) => setForm({ ...form, JENISDOKUMEN: e.target.value })}
            />
          </div>

          <div>
            <label>Lokasi File</label>
            <InputText
              className="w-full mt-2"
              value={form.LOKASIFILE}
              onChange={(e) => setForm({ ...form, LOKASIFILE: e.target.value })}
            />
          </div>

          <div className="text-right pt-3">
            <Button type="submit" label="Simpan" icon="pi pi-save" />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default DokumenPage;