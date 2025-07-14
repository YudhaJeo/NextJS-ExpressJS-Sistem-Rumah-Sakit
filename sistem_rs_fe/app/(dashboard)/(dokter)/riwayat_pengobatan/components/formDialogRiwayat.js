'use client';

import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

const FormDialogPengobatan = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  pendaftaranOptions,
}) => {
  const [errors, setErrors] = useState([]);

  const validate = () => {
    const newErrors = {};
    if (!form.NIK) newErrors.NIK = 'NIK harus dipilih';
    if (!form.TANGGALKUNJUNGAN) newErrors.TANGGALKUNJUNGAN = 'Tanggal kunjungan wajib diisi';
    if (!form.KELUHAN) newErrors.KELUHAN = 'Keluhan wajib diisi';
    if (!form.POLI) newErrors.POLI = 'Poli wajib dipilih';
    if (!form.STATUSKUNJUNGAN) newErrors.STATUSKUNJUNGAN = 'Status wajib dipilih';
    if (!form.STATUSRAWAT) newErrors.STATUSRAWAT = 'Status wajib dipilih';
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
        {/* NIK */}
        <div>
          <label className="font-medium">NIK</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.NIK })}
            options={pendaftaranOptions}
            optionLabel="label"
            optionValue="value"
            value={form.NIK}
            onChange={(e) => {
              const selected = pendaftaranOptions.find((p) => p.value === e.value);
              setForm({
                ...form,
                NIK: selected?.value || '',
                IDPENDAFTARAN: selected?.IDPENDAFTARAN || '',
                NAMALENGKAP: selected?.NAMALENGKAP || '',
                TANGGALKUNJUNGAN: selected?.TANGGALKUNJUNGAN || '',
                KELUHAN: selected?.KELUHAN || '',
                POLI: selected?.POLI || '',
                STATUSKUNJUNGAN: selected?.STATUSKUNJUNGAN || 'Diperiksa',
              });
            }}
            placeholder="Pilih NIK"
            filter
            showClear
          />
          {errors.NIK && <small className="p-error">{errors.NIK}</small>}
        </div>

        {/* Tanggal Kunjungan (read-only) */}
        <div>
          <label className="font-medium">Tanggal Kunjungan</label>
          <Calendar
            className={classNames('w-full mt-2', { 'p-invalid': errors.TANGGALKUNJUNGAN })}
            dateFormat="yy-mm-dd"
            value={form.TANGGALKUNJUNGAN ? new Date(form.TANGGALKUNJUNGAN) : undefined}
            disabled
          />
          {errors.TANGGALKUNJUNGAN && (
            <small className="p-error">{errors.TANGGALKUNJUNGAN}</small>
          )}
        </div>

        {/* Keluhan (read-only) */}
        <div>
          <label className="font-medium">Keluhan</label>
          <InputText
            className={classNames('w-full mt-2', { 'p-invalid': errors.KELUHAN })}
            value={form.KELUHAN || ''}
            placeholder="Masukkan keluhan pasien"
            readOnly
          />
          {errors.KELUHAN && <small className="p-error">{errors.KELUHAN}</small>}
        </div>

        {/* Poli (read-only) */}
        <div>
          <label className="font-medium">Poli</label>
          <InputText
            className={classNames('w-full mt-2', { 'p-invalid': errors.POLI })}
            value={form.POLI || ''}
            placeholder="Masukkan poli"
            readOnly
          />
          {errors.POLI && <small className="p-error">{errors.POLI}</small>}
        </div>

        {/* Status Kunjungan (read-only) */}
        <div>
          <label className="font-medium">Status Kunjungan</label>
          <InputText
            className={classNames('w-full mt-2', { 'p-invalid': errors.STATUSKUNJUNGAN })}
            options={['Diperiksa', 'Batal', 'Selesai'].map((val) => ({
              label: val,
              value: val,
            }))}
            value={form.STATUSKUNJUNGAN}
            placeholder="Pilih Status"
            disabled
          />
          {errors.STATUSKUNJUNGAN && (
            <small className="p-error">{errors.STATUSKUNJUNGAN}</small>
          )}
        </div>

        {/* Status Rawat */}
        <div>
          <label className="font-medium">Status Rawat</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.STATUSRAWAT })}
            options={['Rawat Jalan', 'Rawat Inap'].map((val) => ({
              label: val,
              value: val,
            }))}
            value={form.STATUSRAWAT}
            onChange={(e) => setForm({ ...form, STATUSRAWAT: e.value })}
            placeholder="Pilih Status"
          />
          {errors.STATUSRAWAT && <small className="p-error">{errors.STATUSRAWAT}</small>}
        </div>

        {/* Diagnosa */}
        <div>
          <label className="font-medium">Diagnosa</label>
          <InputText
            className={classNames('w-full mt-2', { 'p-invalid': errors.DIAGNOSA })}
            value={form.DIAGNOSA || ''}
            onChange={(e) => setForm({ ...form, DIAGNOSA: e.target.value })}
            placeholder="Masukkan Diagnosa..."
          />
          {errors.DIAGNOSA && <small className="p-error">{errors.DIAGNOSA}</small>}
        </div>

        {/* Obat */}
        <div>
          <label className="font-medium">Obat</label>
          <InputText
            className={classNames('w-full mt-2', { 'p-invalid': errors.OBAT })}
            value={form.OBAT || ''}
            onChange={(e) => setForm({ ...form, OBAT: e.target.value })}
            placeholder="Masukkan Obat..."
          />
          {errors.OBAT && <small className="p-error">{errors.OBAT}</small>}
        </div>

        <div className="text-right pt-3">
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

export default FormDialogPengobatan;
