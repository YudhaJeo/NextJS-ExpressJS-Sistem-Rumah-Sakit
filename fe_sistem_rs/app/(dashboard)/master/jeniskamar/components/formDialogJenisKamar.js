// app/(dashboard)/master/asuransi/components/formDialogAsuransi.js
'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React from 'react';

const FormDialogAsuransi = ({ visible, onHide, onSubmit, form, setForm, errors }) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={form.IDASURANSI ? 'Edit Asuransi' : 'Tambah Asuransi'}
      visible={visible}
      onHide={onHide}
      style={{ width: '30vw' }}
    >
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div>
          <label>Nama Asuransi</label>
          <InputText
            className={inputClass('NAMAASURANSI')}
            value={form.NAMAASURANSI}
            onChange={(e) => setForm({ ...form, NAMAASURANSI: e.target.value })}
          />
          {errors.NAMAASURANSI && <small className="text-red-500">{errors.NAMAASURANSI}</small>}
        </div>

        <div>
          <label>Keterangan (Opsional)</label>
          <InputText
            className={inputClass('KETERANGAN')}
            value={form.KETERANGAN}
            onChange={(e) => setForm({ ...form, KETERANGAN: e.target.value })}
          />
          {errors.KETERANGAN && <small className="text-red-500">{errors.KETERANGAN}</small>}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogAsuransi;
