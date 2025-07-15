'use client';

import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

const FormDialogPengobatan = ({ visible, onHide, onSubmit, form, setForm, pendaftaranOptions }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.IDPENDAFTARAN) newErrors.IDPENDAFTARAN = 'Pendaftaran wajib dipilih';
    if (!form.STATUSKUNJUNGAN) newErrors.STATUSKUNJUNGAN = 'Status Kunjungan wajib diisi';
    if (!form.STATUSRAWAT) newErrors.STATUSRAWAT = 'Status Rawat wajib diisi';
    if (!form.DIAGNOSA) newErrors.DIAGNOSA = 'Diagnosa wajib diisi';
    if (!form.OBAT) newErrors.OBAT = 'Obat wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <Dialog
      header={form.IDPENGOBATAN ? 'Edit Riwayat Pengobatan' : 'Tambah Riwayat Pengobatan'}
      visible={visible}
      onHide={() => {
        setErrors({});
        onHide();
      }}
      style={{ width: '40vw' }}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="font-medium">Pilih Pendaftaran</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.IDPENDAFTARAN })}
            value={form.IDPENDAFTARAN}
            options={pendaftaranOptions}
            onChange={(e) => {
              const selected = pendaftaranOptions.find((p) => p.value === e.value);
              setForm({
                ...form,
                IDPENDAFTARAN: e.value,
                NIK: selected.NIK,
                NAMALENGKAP: selected.NAMALENGKAP,
                TANGGALKUNJUNGAN: selected.TANGGALKUNJUNGAN,
                KELUHAN: selected.KELUHAN,
                POLI: selected.POLI,
                STATUSKUNJUNGAN: selected.STATUSKUNJUNGAN || 'Diperiksa',
              });
            }}
            placeholder="Pilih pendaftaran"
            filter
            showClear
          />
          {errors.IDPENDAFTARAN && <small className="p-error">{errors.IDPENDAFTARAN}</small>}
        </div>

        <div>
          <label className="font-medium">NIK</label>
          <InputText className="w-full mt-2" value={form.NIK || ''} disabled />
        </div>

        <div>
          <label className="font-medium">Nama Lengkap</label>
          <InputText className="w-full mt-2" value={form.NAMALENGKAP || ''} disabled />
        </div>

        <div>
          <label className="font-medium">Tanggal Kunjungan</label>
          <Calendar value={form.TANGGALKUNJUNGAN ? new Date(form.TANGGALKUNJUNGAN) : undefined} disabled showIcon className="w-full mt-2" />
        </div>

        <div>
          <label className="font-medium">Poli</label>
          <InputText className="w-full mt-2" value={form.POLI || ''} disabled />
        </div>

        <div>
          <label className="font-medium">Keluhan</label>
          <InputText className="w-full mt-2" value={form.KELUHAN || ''} disabled />
        </div>

        <div>
          <label className="font-medium">Status Kunjungan</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.STATUSKUNJUNGAN })}
            value={form.STATUSKUNJUNGAN}
            options={['Diperiksa', 'Selesai', 'Batal'].map((val) => ({ label: val, value: val }))}
            onChange={(e) => setForm({ ...form, STATUSKUNJUNGAN: e.value })}
            placeholder="Pilih Status"
          />
          {errors.STATUSKUNJUNGAN && <small className="p-error">{errors.STATUSKUNJUNGAN}</small>}
        </div>

        <div>
          <label className="font-medium">Status Rawat</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.STATUSRAWAT })}
            value={form.STATUSRAWAT}
            options={['Rawat Jalan', 'Rawat Inap'].map((val) => ({ label: val, value: val }))}
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
          <label className="font-medium">Obat</label>
          <InputText
            className={classNames('w-full mt-2', { 'p-invalid': errors.OBAT })}
            value={form.OBAT || ''}
            onChange={(e) => setForm({ ...form, OBAT: e.target.value })}
            placeholder="Masukkan obat"
          />
          {errors.OBAT && <small className="p-error">{errors.OBAT}</small>}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" className="p-button-primary" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogPengobatan;