'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import React from 'react';

const FormDialogBankAccount = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  errors: externalErrors 
}) => {
  const [errors, setErrors] = useState({});

  const inputClass = (field) =>
    classNames('w-full mt-2', { 'p-invalid': errors[field] || externalErrors?.[field] });

  const validate = () => {
    const newErrors = {};
    if (!form.NAMA_BANK) newErrors.NAMA_BANK = 'Nama Bank wajib diisi';
    if (!form.NO_REKENING) newErrors.NO_REKENING = 'No Rekening wajib diisi';
    if (!form.ATAS_NAMA) newErrors.ATAS_NAMA = 'Atas Nama wajib diisi';
    if (!form.CABANG) newErrors.CABANG = 'Cabang wajib diisi';
    if (!form.KODE_BANK) newErrors.KODE_BANK = 'Kode Bank wajib diisi';
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
      header={form.IDBANK ? 'Edit Rekening Bank' : 'Tambah Rekening Bank'}
      visible={visible}
      onHide={handleHide}
      style={{ width: '40vw' }}
    >
      <form
        className="space-y-3"
        onSubmit={handleSubmit}
      >
        <div>
          <label>Nama Bank</label>
          <InputText
            className={inputClass('NAMA_BANK')}
            value={form.NAMA_BANK}
            onChange={(e) => setForm({ ...form, NAMA_BANK: e.target.value })}
          />
          {(errors.NAMA_BANK || externalErrors?.NAMA_BANK) && (
            <small className="p-error">{errors.NAMA_BANK || externalErrors.NAMA_BANK}</small>
          )}
        </div>

        <div>
          <label>No Rekening</label>
          <InputText
            className={inputClass('NO_REKENING')}
            value={form.NO_REKENING}
            onChange={(e) => setForm({ ...form, NO_REKENING: e.target.value })}
          />
          {(errors.NO_REKENING || externalErrors?.NO_REKENING) && (
            <small className="p-error">{errors.NO_REKENING || externalErrors.NO_REKENING}</small>
          )}
        </div>

        <div>
          <label>Atas Nama</label>
          <InputText
            className={inputClass('ATAS_NAMA')}
            value={form.ATAS_NAMA}
            onChange={(e) => setForm({ ...form, ATAS_NAMA: e.target.value })}
          />
          {(errors.ATAS_NAMA || externalErrors?.ATAS_NAMA) && (
            <small className="p-error">{errors.ATAS_NAMA || externalErrors.ATAS_NAMA}</small>
          )}
        </div>

        <div>
          <label>Cabang</label>
          <InputText
            className={inputClass('CABANG')}
            value={form.CABANG}
            onChange={(e) => setForm({ ...form, CABANG: e.target.value })}
          />
          {(errors.CABANG || externalErrors?.CABANG) && (
            <small className="p-error">{errors.CABANG || externalErrors.CABANG}</small>
          )}
        </div>

        <div>
          <label>Kode Bank</label>
          <InputText
            className={inputClass('KODE_BANK')}
            value={form.KODE_BANK}
            onChange={(e) => setForm({ ...form, KODE_BANK: e.target.value })}
          />
          {(errors.KODE_BANK || externalErrors?.KODE_BANK) && (
            <small className="p-error">{errors.KODE_BANK || externalErrors.KODE_BANK}</small>
          )}
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
            placeholder="Opsional"
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

export default FormDialogBankAccount;