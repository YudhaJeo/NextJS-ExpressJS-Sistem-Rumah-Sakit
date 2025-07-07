'use client';

import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

const FormDialogPendaftaran = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  pasienOptions,
}) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.NIK) newErrors.NIK = 'NIK harus dipilih';
    if (!form.TANGGALKUNJUNGAN) newErrors.TANGGALKUNJUNGAN = 'Tanggal kunjungan wajib diisi';
    if (!form.LAYANAN) newErrors.LAYANAN = 'Layanan wajib dipilih';
    if (form.LAYANAN === 'Rawat Jalan' && !form.POLI)
      newErrors.POLI = 'Poli wajib diisi untuk Rawat Jalan';
    if (!form.NAMADOKTER) newErrors.NAMADOKTER = 'Nama Dokter wajib diisi';
    if (!form.KELUHAN) newErrors.KELUHAN = 'Keluhan wajib diisi';
    if (!form.STATUSKUNJUNGAN) newErrors.STATUSKUNJUNGAN = 'Status wajib dipilih';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  const handleLayananChange = (value) => {
    setForm({
      ...form,
      LAYANAN: value,
      POLI: value === 'Rawat Jalan' ? form.POLI : '', // reset POLI jika bukan Rawat Jalan
    });
  };

  return (
    <Dialog
      header={form.IDPENDAFTARAN ? 'Edit Pendaftaran' : 'Tambah Pendaftaran'}
      visible={visible}
      onHide={() => {
        setErrors({});
        onHide();
      }}
      style={{ width: '40vw' }}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="font-medium">NIK</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.NIK })}
            options={pasienOptions}
            value={form.NIK}
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
          {errors.NIK && <small className="p-error">{errors.NIK}</small>}
        </div>

        <div>
          <label className="font-medium">Tanggal Kunjungan</label>
          <Calendar
            className={classNames('w-full mt-2', { 'p-invalid': errors.TANGGALKUNJUNGAN })}
            dateFormat="yy-mm-dd"
            value={form.TANGGALKUNJUNGAN ? new Date(form.TANGGALKUNJUNGAN) : undefined}
            onChange={(e) =>
              setForm({
                ...form,
                TANGGALKUNJUNGAN: e.value?.toISOString().split('T')[0] || '',
              })
            }
            showIcon
          />
          {errors.TANGGALKUNJUNGAN && (
            <small className="p-error">{errors.TANGGALKUNJUNGAN}</small>
          )}
        </div>

        <div>
          <label className="font-medium">Layanan</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.LAYANAN })}
            options={['Rawat Jalan', 'Rawat Inap', 'IGD'].map((val) => ({
              label: val,
              value: val,
            }))}
            value={form.LAYANAN}
            onChange={(e) => handleLayananChange(e.value)}
            placeholder="Pilih Layanan"
          />
          {errors.LAYANAN && <small className="p-error">{errors.LAYANAN}</small>}
        </div>

        {/* ✅ Tampilkan field POLI hanya jika layanan = Rawat Jalan */}
        {form.LAYANAN === 'Rawat Jalan' && (
          <div>
            <label className="font-medium">Poli</label>
            <InputText
              className={classNames('w-full mt-2', { 'p-invalid': errors.POLI })}
              value={form.POLI}
              onChange={(e) => setForm({ ...form, POLI: e.target.value })}
            />
            {errors.POLI && <small className="p-error">{errors.POLI}</small>}
          </div>
        )}

        <div>
          <label className="font-medium">Nama Dokter</label>
          <InputText
            className={classNames('w-full mt-2', { 'p-invalid': errors.NAMADOKTER })}
            value={form.NAMADOKTER}
            onChange={(e) => setForm({ ...form, NAMADOKTER: e.target.value })}
          />
          {errors.NAMADOKTER && <small className="p-error">{errors.NAMADOKTER}</small>}
        </div>

        <div>
          <label className="font-medium">Keluhan</label>
          <InputText
            className={classNames('w-full mt-2', { 'p-invalid': errors.KELUHAN })}
            value={form.KELUHAN || ''}
            onChange={(e) => setForm({ ...form, KELUHAN: e.target.value })}
            placeholder="Masukkan Keluhan pasien"
          />
          {errors.KELUHAN && <small className="p-error">{errors.KELUHAN}</small>}
        </div>

        <div>
          <label className="font-medium">Status Kunjungan</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.STATUSKUNJUNGAN })}
            options={['Diperiksa', 'Batal', 'Selesai'].map((val) => ({
              label: val,
              value: val,
            }))}
            value={form.STATUSKUNJUNGAN}
            onChange={(e) => setForm({ ...form, STATUSKUNJUNGAN: e.value })}
            placeholder="Pilih Status"
          />
          {errors.STATUSKUNJUNGAN && (
            <small className="p-error">{errors.STATUSKUNJUNGAN}</small>
          )}
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

export default FormDialogPendaftaran;
