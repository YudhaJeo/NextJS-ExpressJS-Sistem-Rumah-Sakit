'use client';

import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const statusKunjunganOptions = [
  { label: 'Diperiksa', value: 'Diperiksa' },
  { label: 'Selesai', value: 'Selesai' },
  { label: 'Batal', value: 'Batal' },
  { label: 'Dalam Antrian', value: 'Dalam Antrian' },
];

const statusRawatOptions = [
  { label: 'Rawat Jalan', value: 'Rawat Jalan' },
  { label: 'Rawat Inap', value: 'Rawat Inap' },
];

const FormDialogRawatJalan = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  dokterOptions,
  pendaftaranOptions,
}) => {
  const [errors, setErrors] = useState({});
  const [fotoPreview, setFotoPreview] = useState(null);

  useEffect(() => {
    if (!visible) {
      setErrors({});
      setFotoPreview(null);
    }
  }, [visible]);

  const validate = () => {
    const newErrors = {};
    if (!form.IDDOKTER) newErrors.IDDOKTER = 'Dokter wajib dipilih';
    if (!form.IDPENDAFTARAN) newErrors.IDPENDAFTARAN = 'Pendaftaran wajib dipilih';
    if (!form.STATUSKUNJUNGAN) newErrors.STATUSKUNJUNGAN = 'Status kunjungan wajib diisi';
    if (!form.STATUSRAWAT) newErrors.STATUSRAWAT = 'Status rawat wajib diisi';
    if (!form.DIAGNOSA || form.DIAGNOSA.trim() === '') newErrors.DIAGNOSA = 'Diagnosa wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  const handleHide = () => {
    setErrors({});
    setFotoPreview(null);
    onHide();
  };

  return (
    <Dialog
      header="Edit Rawat Jalan"
      visible={visible}
      onHide={handleHide}
      style={{ width: '40vw' }}
      modal
      draggable={false}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-medium">Pendaftaran</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.IDPENDAFTARAN })}
            value={form.IDPENDAFTARAN}
            options={pendaftaranOptions}
            onChange={(e) => setForm({ ...form, IDPENDAFTARAN: e.value })}
            placeholder="Pilih Pendaftaran"
          />
          {errors.IDPENDAFTARAN && <small className="p-error">{errors.IDPENDAFTARAN}</small>}
        </div>

        <div>
          <label className="font-medium">Nama Dokter</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.IDDOKTER })}
            value={form.IDDOKTER}
            options={dokterOptions}
            onChange={(e) => setForm({ ...form, IDDOKTER: e.value })}
            placeholder="Pilih Dokter"
          />
          {errors.IDDOKTER && <small className="p-error">{errors.IDDOKTER}</small>}
        </div>

        <div>
          <label className="font-medium">Status Rawat</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.STATUSRAWAT })}
            value={form.STATUSRAWAT}
            options={statusRawatOptions}
            onChange={(e) => setForm({ ...form, STATUSRAWAT: e.value })}
            placeholder="Pilih Status Rawat"
          />
          {errors.STATUSRAWAT && <small className="p-error">{errors.STATUSRAWAT}</small>}
        </div>

        <div>
          <label className="font-medium">Diagnosa</label>
          <InputText
            className={classNames('w-full mt-2', { 'p-invalid': errors.DIAGNOSA })}
            value={form.DIAGNOSA || ''}
            onChange={(e) => setForm({ ...form, DIAGNOSA: e.target.value })}
            placeholder="Masukkan diagnosa"
          />
          {errors.DIAGNOSA && <small className="p-error">{errors.DIAGNOSA}</small>}
        </div>

        <div>
          <label className="font-medium">Keterangan</label>
          <InputText
            className="w-full mt-2"
            value={form.KETERANGAN || ''}
            onChange={(e) => setForm({ ...form, KETERANGAN: e.target.value })}
            placeholder="Masukkan keterangan tambahan"
          />
        </div>

        <div>
          <label className="font-medium">Status Kunjungan</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.STATUSKUNJUNGAN })}
            value={form.STATUSKUNJUNGAN}
            options={statusKunjunganOptions}
            onChange={(e) => setForm({ ...form, STATUSKUNJUNGAN: e.value })}
            placeholder="Pilih Status"
          />
          {errors.STATUSKUNJUNGAN && <small className="p-error">{errors.STATUSKUNJUNGAN}</small>}
        </div>
        
        <div>
          <label className="font-medium">Upload Foto Resep</label>
          <FileUpload
            mode="basic"
            name="FOTORESEP"
            accept="image/*"
            maxFileSize={10000000}
            auto
            chooseLabel="Pilih Foto"
            onSelect={(e) => {
              if (e.files && e.files.length > 0) {
                const file = e.files[0];
                setForm({ ...form, FOTORESEP: file });
                setFotoPreview(URL.createObjectURL(file));
              }
            }}
          />
        </div>

        {fotoPreview && (
          <img
            src={fotoPreview}
            alt="Preview Foto Resep"
            className="w-16 h-16 object-cover mt-2 rounded"
          />
        )}
        {!fotoPreview && form.fotoResepLama && !form.FOTORESEP && (
          <img
            src={`${process.env.NEXT_PUBLIC_MINIO_URL}${form.fotoResepLama}`}
            alt="Foto Resep Lama"
            className="w-16 h-16 object-cover mt-2 rounded"
          />
        )}

        <div className="text-right pt-4">
          <Button
            type="submit"
            label="Simpan"
            icon="pi pi-save"
            className="p-button-primary"
          />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogRawatJalan;
