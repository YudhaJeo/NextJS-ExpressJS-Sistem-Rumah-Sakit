// app\(dashboard)\(rawat_inap)\rawat_inap\manajemen-bangsal\components\formDialogBangsal.js
'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import React from 'react';

const FormDialogBangsal = ({ 
  visible, 
  onHide, 
  onSubmit, 
  form, 
  setForm,
  errors,
  bangsalOption
}) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={form.IDBANGSAL ? 'Edit Bangsal' : 'Tambah Bangsal'}
      visible={visible}
      onHide={onHide}
      style={{ width: '40vw' }}
    >
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div>
          <label>Nama Bangsal</label>
          <InputText
            className={inputClass('NAMABANGSAL')}
            value={form.NAMABANGSAL}
            onChange={(e) => setForm({ ...form, NAMABANGSAL: e.target.value })}
            placeholder='Masukan nama bangsal'
          />
          {errors.NAMABANGSAL && <small className="text-red-500">{errors.NAMABANGSAL}</small>}
        </div>

        <div className="mt-2">
          <label>Jenis Bangsal</label>
          <Dropdown
            className={inputClass('IDJENISBANGSAL')}
            options={bangsalOption}
            value={form.IDJENISBANGSAL}
            onChange={(e) => setForm({ ...form, IDJENISBANGSAL: e.value })}
            placeholder="Pilih Jenis Bangsal"
          />
          {errors.IDJENISBANGSAL && <small className="text-red-500">{errors.IDJENISBANGSAL}</small>}
        </div>

        <div className="mt-2">
          <label>Lokasi</label>
          <InputText
            className={inputClass('LOKASI')}
            value={form.LOKASI}
            onChange={(e) => setForm({ ...form, LOKASI: e.target.value })}
            placeholder="Masukkan lokasi bangsal"
          />
          {errors.LOKASI && <small className="text-red-500">{errors.LOKASI}</small>}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogBangsal;