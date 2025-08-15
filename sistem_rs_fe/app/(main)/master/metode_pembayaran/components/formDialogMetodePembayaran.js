'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';

const FormDialogMetodePembayaran = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  errors: externalErrors,
}) => {
  const [errors, setErrors] = useState({});

  const inputClass = (field) =>
    classNames('w-full mt-2', { 'p-invalid': errors[field] || externalErrors?.[field] });

  const validate = () => {
    const newErrors = {};
    if (!form.NAMA) newErrors.NAMA = 'Nama Metode wajib diisi';
    if (!form.STATUS) newErrors.STATUS = 'Status wajib dipilih';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
      setErrors({});
    }
  };

  const handleHide = () => {
    setErrors({});
    onHide();
  };

  return (
    <Dialog
      header={form.IDMETODE ? 'Edit Metode Pembayaran' : 'Tambah Metode Pembayaran'}
      visible={visible}
      onHide={handleHide}
      style={{ width: '40vw' }}
    >
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <label>Nama Metode</label>
          <InputText
            className={inputClass('NAMA')}
            value={form.NAMA ?? ''}
            onChange={(e) => setForm({ ...form, NAMA: e.target.value })}
          />
          {(errors.NAMA || externalErrors?.NAMA) && (
            <small className="p-error">{errors.NAMA || externalErrors.NAMA}</small>
          )}
        </div>

        <div>
          <label>Fee (%)</label>
          <InputNumber
            className="w-full mt-2"
            value={form.FEE_PERSEN ?? 0}
            onValueChange={(e) => setForm({ ...form, FEE_PERSEN: e.value })}
            mode="decimal"
            min={0}
            max={100}
            suffix="%"
          />
        </div>

        <div>
          <label>Status</label>
          <Dropdown
            className={inputClass('STATUS')}
            options={[
              { label: 'Aktif', value: 'AKTIF' },
              { label: 'Nonaktif', value: 'NONAKTIF' },
            ]}
            value={form.STATUS ?? null}
            onChange={(e) => setForm({ ...form, STATUS: e.value })}
            placeholder="Pilih Status"
          />
          {(errors.STATUS || externalErrors?.STATUS) && (
            <small className="p-error">{errors.STATUS || externalErrors.STATUS}</small>
          )}
        </div>

        <div>
          <label>Keterangan</label>
          <InputText
            className="w-full mt-2"
            value={form.KETERANGAN ?? ''}
            onChange={(e) => setForm({ ...form, KETERANGAN: e.target.value })}
          />
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogMetodePembayaran;