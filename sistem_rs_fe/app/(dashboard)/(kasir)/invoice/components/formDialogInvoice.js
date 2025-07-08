'use client';

import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

const FormDialogInvoice = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  pasienOptions,
}) => {
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { label: 'Belum Dibayar', value: 'BELUM_LUNAS' },
    { label: 'Sudah Dibayar', value: 'LUNAS' },
    { label: 'Batal', value: 'BATAL' },
  ];

  const validate = () => {
    const newErrors = {};
    if (!form.NOINVOICE) newErrors.NOINVOICE = 'No Invoice wajib diisi';
    if (!form.NIK) newErrors.NIK = 'NIK pasien wajib dipilih';
    if (!form.TANGGALINVOICE) newErrors.TANGGALINVOICE = 'Tanggal Invoice wajib diisi';
    if (!form.TOTALTAGIHAN || form.TOTALTAGIHAN <= 0)
      newErrors.TOTALTAGIHAN = 'Total tagihan harus lebih dari 0';
    if (!form.STATUS) newErrors.STATUS = 'Status wajib dipilih';
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
      header={form.IDINVOICE ? 'Edit Invoice' : 'Tambah Invoice'}
      visible={visible}
      onHide={() => {
        setErrors({});
        onHide();
      }}
      style={{ width: '40vw' }}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        {/* No Invoice */}
        <div>
          <label className="font-medium">No Invoice</label>
          <InputText
            className={classNames('w-full mt-2', { 'p-invalid': errors.NOINVOICE })}
            value={form.NOINVOICE}
            onChange={(e) => setForm({ ...form, NOINVOICE: e.target.value })}
            placeholder="Contoh: INV-20250701-001"
          />
          {errors.NOINVOICE && <small className="p-error">{errors.NOINVOICE}</small>}
        </div>

        {/* NIK Pasien */}
        <div>
          <label className="font-medium">NIK Pasien</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.NIK })}
            options={pasienOptions}
            value={form.NIK}
            onChange={(e) => {
              const selected = pasienOptions.find((p) => p.value === e.value);
              setForm({
                ...form,
                NIK: e.value,
                NAMAPASIEN: selected?.NAMALENGKAP || '',
                ASURANSI: selected?.ASURANSI || '-', // ✅ otomatis isi asuransi
              });
            }}
            placeholder="Pilih Pasien"
            filter
            showClear
          />
          {errors.NIK && <small className="p-error">{errors.NIK}</small>}
        </div>

        {/* Asuransi */}
        <div>
          <label className="font-medium">Asuransi</label>
          <InputText
            className="w-full mt-2"
            value={form.ASURANSI || '-'}
            readOnly // ✅ readonly agar tidak bisa diubah manual
          />
        </div>

        {/* Tanggal Invoice */}
        <div>
          <label className="font-medium">Tanggal Invoice</label>
          <Calendar
            className={classNames('w-full mt-2', { 'p-invalid': errors.TANGGALINVOICE })}
            dateFormat="yy-mm-dd"
            value={form.TANGGALINVOICE ? new Date(form.TANGGALINVOICE) : undefined}
            onChange={(e) =>
              setForm({
                ...form,
                TANGGALINVOICE: e.value?.toISOString().split('T')[0] || '',
              })
            }
            showIcon
          />
          {errors.TANGGALINVOICE && <small className="p-error">{errors.TANGGALINVOICE}</small>}
        </div>

        {/* Total Tagihan */}
        <div>
          <label className="font-medium">Total Tagihan</label>
          <InputNumber
            className={classNames('w-full mt-2', { 'p-invalid': errors.TOTALTAGIHAN })}
            value={form.TOTALTAGIHAN}
            onValueChange={(e) => setForm({ ...form, TOTALTAGIHAN: e.value })}
            mode="currency"
            currency="IDR"
            locale="id-ID"
          />
          {errors.TOTALTAGIHAN && <small className="p-error">{errors.TOTALTAGIHAN}</small>}
        </div>

        {/* Status */}
        <div>
          <label className="font-medium">Status</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.STATUS })}
            options={statusOptions}
            value={form.STATUS}
            onChange={(e) => setForm({ ...form, STATUS: e.value })}
            placeholder="Pilih Status"
          />
          {errors.STATUS && <small className="p-error">{errors.STATUS}</small>}
        </div>

        {/* Tombol Simpan */}
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

export default FormDialogInvoice;
