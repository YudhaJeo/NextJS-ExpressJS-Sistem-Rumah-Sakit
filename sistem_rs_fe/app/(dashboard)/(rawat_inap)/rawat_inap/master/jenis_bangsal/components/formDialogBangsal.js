// app/(dashboard)/master/jenis_bangsal/components/formDialogBangsal.js
'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import React from 'react';

const FormDialog = ({ visible, onHide, onSubmit, form, setForm, errors }) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={form.IDJENISBANGSAL ? 'Edit Jenis Bangsal' : 'Tambah Jenis Bangsal'}
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
          <label>Jenis Bangsal</label>
          <InputText
            className={inputClass('NAMAJENIS')}
            value={form.NAMAJENIS}
            onChange={(e) => setForm({ ...form, NAMAJENIS: e.target.value })}
          />
          {errors.NAMAJENIS && <small className="text-red-500">{errors.NAMAJENIS}</small>}
        </div>
        <div>
          <label>Harga per Hari (Rupiah)</label>
          <InputNumber
            inputId="harga"
            className="w-full mt-2"
            inputClassName={errors.HARGA_PER_HARI ? 'p-invalid' : ''}
            value={form.HARGA_PER_HARI}
            onValueChange={(e) => setForm({ ...form, HARGA_PER_HARI: e.value })}
            mode="currency"
            currency="IDR"
            locale="id-ID"
          />
          {errors.HARGA_PER_HARI && (
            <small className="text-red-500">{errors.HARGA_PER_HARI}</small>
          )}
        </div>
        <div>
          <label>Fasilitas</label>
          <InputText
            className={inputClass('FASILITAS')}
            value={form.FASILITAS}
            onChange={(e) => setForm({ ...form, FASILITAS: e.target.value })}
          />
          {errors.FASILITAS && <small className="text-red-500">{errors.FASILITAS}</small>}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialog;
