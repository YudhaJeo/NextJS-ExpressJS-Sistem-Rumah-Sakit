'use client';

import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

const FormDialogDeposit = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  pasienOptions,
  metodeOptions,
  bankOptions,
}) => {
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { label: 'Aktif', value: 'AKTIF' },
    { label: 'Habis', value: 'HABIS' },
    { label: 'Refund', value: 'REFUND' },
  ];

  const validate = () => {
    const newErrors = {};
    if (!form.NIK) newErrors.NIK = 'NIK pasien wajib dipilih';
    if (!form.TANGGALDEPOSIT) newErrors.TANGGALDEPOSIT = 'Tanggal Deposit wajib diisi';
    if (!form.NOMINAL || form.NOMINAL <= 0)
      newErrors.NOMINAL = 'Nominal harus lebih dari 0';
    if (!form.METODE) newErrors.METODE = 'Metode pembayaran wajib dipilih';
    if (form.METODE === 'Transfer Bank' && !form.IDBANK) {
      newErrors.IDBANK = 'Rekening bank wajib dipilih untuk Transfer Bank';
    }
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
      header={form.IDDEPOSIT ? 'Edit Deposit' : 'Tambah Deposit'}
      visible={visible}
      onHide={() => {
        setErrors({});
        onHide();
      }}
      style={{ width: '40vw' }}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label className="font-medium">No Deposit</label>
          <InputText
            className="w-full mt-2"
            value={form.NODEPOSIT || 'Otomatis'}
            readOnly
          />
        </div>

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
              });
            }}
            placeholder="Pilih Pasien"
            filter
            showClear
          />
          {errors.NIK && <small className="p-error">{errors.NIK}</small>}
        </div>

        <div>
          <label className="font-medium">Nama Pasien</label>
          <InputText
            className="w-full mt-2"
            value={form.NAMAPASIEN || '-'}
            readOnly
          />
        </div>

        <div>
          <label className="font-medium">Tanggal Deposit</label>
          <Calendar
            className={classNames('w-full mt-2', { 'p-invalid': errors.TANGGALDEPOSIT })}
            dateFormat="yy-mm-dd"
            value={form.TANGGALDEPOSIT ? new Date(form.TANGGALDEPOSIT) : null}
            onChange={(e) =>
              setForm({
                ...form,
                TANGGALDEPOSIT: e.value?.toISOString().split('T')[0] || '',
              })
            }
            showIcon
            showButtonBar
            placeholder="Pilih Tanggal"
          />
          {errors.TANGGALDEPOSIT && <small className="p-error">{errors.TANGGALDEPOSIT}</small>}
        </div>

        <div>
          <label className="font-medium">Nominal</label>
          <InputNumber
            className={classNames('w-full mt-2', { 'p-invalid': errors.NOMINAL })}
            value={form.NOMINAL}
            onValueChange={(e) =>
              setForm({
                ...form,
                NOMINAL: e.value,
                SALDO_SISA: e.value, 
              })
            }
            mode="currency"
            currency="IDR"
            locale="id-ID"
          />
          {errors.NOMINAL && <small className="p-error">{errors.NOMINAL}</small>}
        </div>

        <div>
          <label className="font-medium">Metode Pembayaran</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.METODE })}
            options={metodeOptions}
            value={form.METODE}
            onChange={(e) => {
              if (e.value !== 'Transfer Bank') {
                setForm({ ...form, METODE: e.value, IDBANK: null });
              } else {
                setForm({ ...form, METODE: e.value });
              }
            }}
            placeholder="Pilih Metode"
          />
          {errors.METODE && <small className="p-error">{errors.METODE}</small>}
        </div>
        
        {form.METODE === 'Transfer Bank' && (
          <div>
            <label className="font-medium">Pilih Rekening Bank</label>
            <Dropdown
              className={classNames('w-full mt-2', { 'p-invalid': errors.IDBANK })}
              options={bankOptions}
              value={form.IDBANK || ''}
              onChange={(e) => setForm({ ...form, IDBANK: e.value })}
              placeholder="Pilih Bank"
              optionLabel="label"
              optionValue="value"
              filter
              showClear
            />
            {errors.IDBANK && <small className="p-error">{errors.IDBANK}</small>}
          </div>
        )}

        <div>
          <label className="font-medium">Saldo Sisa</label>
          <InputNumber
            className="w-full mt-2"
            value={form.SALDO_SISA}
            mode="currency"
            currency="IDR"
            locale="id-ID"
            readOnly
          />
        </div>

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

        <div>
          <label className="font-medium">Keterangan</label>
          <InputText
            className="w-full mt-2"
            value={form.KETERANGAN || ''}
            onChange={(e) =>
              setForm({ ...form, KETERANGAN: e.target.value })
            }
            placeholder="Isi jika ada keterangan tambahan"
          />
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

export default FormDialogDeposit;