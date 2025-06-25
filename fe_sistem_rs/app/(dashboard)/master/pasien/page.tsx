'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import TabelPasien from './components/tabelPasien';
import { Pasien } from '@/types/pasien';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const MasterPasien = () => {
  const [data, setData] = useState<Pasien[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState<Pasien>({
    NIK: '',
    NAMALENGKAP: '',
    TANGGALLAHIR: '',
    JENISKELAMIN: 'L',
    ASURANSI: 'Umum',
    ALAMAT: '',
    NOHP: '',
    AGAMA: '',
    GOLDARAH: '',
    NOASURANSI: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:4000/api/pasien');
      setData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.NAMALENGKAP.trim()) newErrors.NAMALENGKAP = 'Nama wajib diisi';
    if (!form.NIK.trim()) {
      newErrors.NIK = 'NIK wajib diisi';
    } else if (!/^\d{16}$/.test(form.NIK)) {
      newErrors.NIK = 'NIK harus 16 digit angka';
    }

    if (!form.TANGGALLAHIR) newErrors.TANGGALLAHIR = 'Tanggal lahir wajib diisi';
    if (!form.JENISKELAMIN) newErrors.JENISKELAMIN = 'Jenis kelamin wajib dipilih';
    if (!form.ALAMAT?.trim()) newErrors.ALAMAT = 'Alamat wajib diisi';
    if (!form.NOHP?.trim()) {
      newErrors.NOHP = 'No HP wajib diisi';
    } else if (!/^\d+$/.test(form.NOHP)) {
      newErrors.NOHP = 'No HP hanya boleh berisi angka';
    }

    if (!form.AGAMA?.trim()) newErrors.AGAMA = 'Agama wajib diisi';
    if (!form.GOLDARAH) newErrors.GOLDARAH = 'Golongan darah wajib dipilih';
    if (!form.ASURANSI) newErrors.ASURANSI = 'Asuransi wajib dipilih';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.IDPASIEN;
    const url = isEdit
      ? `http://localhost:4000/api/pasien/${form.IDPASIEN}`
      : 'http://localhost:4000/api/pasien';

    try {
      const payload = {
        ...form,
        TANGGALLAHIR: form.TANGGALLAHIR, 
      };

      if (isEdit) {
        await axios.put(url, payload);
      } else {
        await axios.post(url, payload);
      }

      fetchData();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error('Gagal simpan data:', err);
    }
  };

  const resetForm = () => {
    setForm({
      NIK: '',
      NAMALENGKAP: '',
      TANGGALLAHIR: '',
      JENISKELAMIN: 'L',
      ASURANSI: 'Umum',
      ALAMAT: '',
      NOHP: '',
      AGAMA: '',
      GOLDARAH: '',
      NOASURANSI: '',
    });
    setErrors({});
  };

  const handleEdit = (row: Pasien) => {
    const formattedTanggal = row.TANGGALLAHIR
      ? new Date(row.TANGGALLAHIR).toISOString().split('T')[0]
      : '';

    setForm({
      ...row,
      TANGGALLAHIR: formattedTanggal,
    });

    setDialogVisible(true);
  };

  const handleDelete = async (row: Pasien) => {
    try {
      await axios.delete(`http://localhost:4000/api/pasien/${row.IDPASIEN}`);
      fetchData();
    } catch (err) {
      console.error('Gagal hapus data:', err);
    }
  };

  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }

    fetchData();
  }, []);

  const inputClass = (field: string) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <div className="card">
      <h3 className="text-xl font-semibold">Master Data Pasien</h3>

      <div className="flex justify-content-end my-3">
        <Button
          label="Tambah Pasien"
          icon="pi pi-plus"
          onClick={() => {
            setDialogVisible(true);
            resetForm();
          }}
        />
      </div>

      <TabelPasien
        data={data}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog
        header={form.IDPASIEN ? 'Edit Pasien' : 'Tambah Pasien'}
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
            <label>Nama Lengkap</label>
            <InputText
              className={inputClass('NAMALENGKAP')}
              value={form.NAMALENGKAP}
              onChange={(e) => setForm({ ...form, NAMALENGKAP: e.target.value })}
            />
            {errors.NAMALENGKAP && <small className="text-red-500">{errors.NAMALENGKAP}</small>}
          </div>

          <div>
            <label>NIK</label>
            <InputText
              className={inputClass('NIK')}
              maxLength={16}
              value={form.NIK}
              onChange={(e) => setForm({ ...form, NIK: e.target.value })}
            />
            {errors.NIK && <small className="text-red-500">{errors.NIK}</small>}
          </div>

          <div>
            <label>Tanggal Lahir</label>
            <Calendar
              className={inputClass('TANGGALLAHIR')}
              dateFormat="yy-mm-dd"
              value={form.TANGGALLAHIR ? new Date(form.TANGGALLAHIR) : undefined}
              onChange={(e) =>
                setForm({
                  ...form,
                  TANGGALLAHIR: e.value?.toISOString().split('T')[0] || '',
                })
              }
              showIcon
            />
            {errors.TANGGALLAHIR && <small className="text-red-500">{errors.TANGGALLAHIR}</small>}
          </div>

          <div>
            <label>Jenis Kelamin</label>
            <Dropdown
              className={inputClass('JENISKELAMIN')}
              options={[
                { label: 'Laki-laki', value: 'L' },
                { label: 'Perempuan', value: 'P' },
              ]}
              value={form.JENISKELAMIN}
              onChange={(e) => setForm({ ...form, JENISKELAMIN: e.value })}
              placeholder="Pilih"
            />
            {errors.JENISKELAMIN && <small className="text-red-500">{errors.JENISKELAMIN}</small>}
          </div>

          <div>
            <label>Alamat</label>
            <InputText
              className={inputClass('ALAMAT')}
              value={form.ALAMAT}
              onChange={(e) => setForm({ ...form, ALAMAT: e.target.value })}
            />
            {errors.ALAMAT && <small className="text-red-500">{errors.ALAMAT}</small>}
          </div>

          <div>
            <label>No HP</label>
            <InputText
              className={inputClass('NOHP')}
              value={form.NOHP}
              onChange={(e) => setForm({ ...form, NOHP: e.target.value })}
            />
            {errors.NOHP && <small className="text-red-500">{errors.NOHP}</small>}
          </div>

          <div>
            <label>Agama</label>
            <InputText
              className={inputClass('AGAMA')}
              value={form.AGAMA}
              onChange={(e) => setForm({ ...form, AGAMA: e.target.value })}
            />
            {errors.AGAMA && <small className="text-red-500">{errors.AGAMA}</small>}
          </div>

          <div>
            <label>Golongan Darah</label>
            <Dropdown
              className={inputClass('GOLDARAH')}
              options={[
                { label: 'A', value: 'A' },
                { label: 'B', value: 'B' },
                { label: 'AB', value: 'AB' },
                { label: 'O', value: 'O' },
              ]}
              value={form.GOLDARAH}
              onChange={(e) => setForm({ ...form, GOLDARAH: e.value })}
              placeholder="Pilih"
            />
            {errors.GOLDARAH && <small className="text-red-500">{errors.GOLDARAH}</small>}
          </div>

          <div>
            <label>Asuransi</label>
            <Dropdown
              className={inputClass('ASURANSI')}
              options={[
                { label: 'BPJS', value: 'BPJS' },
                { label: 'Umum', value: 'Umum' },
                { label: 'Lainnya', value: 'Lainnya' },
              ]}
              value={form.ASURANSI}
              onChange={(e) => setForm({ ...form, ASURANSI: e.value })}
              placeholder="Pilih"
            />
            {errors.ASURANSI && <small className="text-red-500">{errors.ASURANSI}</small>}
          </div>

          <div>
            <label>No Asuransi (Opsional)</label>
            <InputText
              className="w-full mt-2"
              value={form.NOASURANSI}
              onChange={(e) => setForm({ ...form, NOASURANSI: e.target.value })}
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

export default MasterPasien;