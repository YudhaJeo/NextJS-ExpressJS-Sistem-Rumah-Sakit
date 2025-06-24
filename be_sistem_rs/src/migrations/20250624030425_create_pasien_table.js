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

const MasterPasien = () => {
  const [data, setData] = useState<Pasien[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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

    if (!form.NIK || form.NIK.length !== 16) newErrors.NIK = 'NIK harus 16 digit';
    if (!form.NAMALENGKAP) newErrors.NAMALENGKAP = 'Nama wajib diisi';
    if (!form.TANGGALLAHIR) newErrors.TANGGALLAHIR = 'Tanggal lahir wajib diisi';
    if (!form.JENISKELAMIN) newErrors.JENISKELAMIN = 'Jenis kelamin wajib diisi';
    if (!form.ALAMAT) newErrors.ALAMAT = 'Alamat wajib diisi';
    if (!form.NOHP) newErrors.NOHP = 'Nomor HP wajib diisi';
    if (!form.AGAMA) newErrors.AGAMA = 'Agama wajib diisi';
    if (!form.GOLDARAH) newErrors.GOLDARAH = 'Golongan darah wajib diisi';
    if (!form.ASURANSI) newErrors.ASURANSI = 'Asuransi wajib diisi';

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
      if (isEdit) {
        await axios.put(url, form);
      } else {
        await axios.post(url, form);
      }
      fetchData();
      setDialogVisible(false);
      resetForm();
      setErrors({});
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
  };

  const handleEdit = (row: Pasien) => {
    setForm({
      ...row,
      TANGGALLAHIR: row.TANGGALLAHIR || '',
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="card">
      <h3 className="text-xl font-semibold">Master Data Pasien</h3>

      <div className="flex justify-content-end my-3">
        <Button
          label="Tambah Pasien"
          icon="pi pi-plus"
          onClick={() => setDialogVisible(true)}
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
          setErrors({});
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
          {[
            { key: 'NAMALENGKAP', label: 'Nama Lengkap' },
            { key: 'NIK', label: 'NIK', maxLength: 16 },
            { key: 'ALAMAT', label: 'Alamat' },
            { key: 'NOHP', label: 'No HP' },
            { key: 'AGAMA', label: 'Agama' },
            { key: 'NOASURANSI', label: 'No Asuransi' },
          ].map(({ key, label, maxLength }) => (
            <div key={key}>
              <label>{label}</label>
              <InputText
                className="w-full mt-2"
                value={form[key as keyof Pasien] as string}
                maxLength={maxLength}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
              {errors[key] && <small className="text-red-500">{errors[key]}</small>}
            </div>
          ))}

          <div>
            <label>Tanggal Lahir</label>
            <Calendar
              className="w-full mt-2"
              dateFormat="yy-mm-dd"
              value={form.TANGGALLAHIR ? new Date(form.TANGGALLAHIR) : null}
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
              className="w-full mt-2"
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
            <label>Golongan Darah</label>
            <Dropdown
              className="w-full mt-2"
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
              className="w-full mt-2"
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

          <div className="text-right pt-3">
            <Button type="submit" label="Simpan" icon="pi pi-save" />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default MasterPasien;
