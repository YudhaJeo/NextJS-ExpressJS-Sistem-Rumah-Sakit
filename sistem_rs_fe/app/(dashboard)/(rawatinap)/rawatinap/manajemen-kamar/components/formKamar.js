// app\(dashboard)\(rawatinap)\rawatinap\manajemen-kamar\components\formKamar.js
'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import React from 'react';

const FormKamar = ({ 
  visible, 
  onHide, 
  onSubmit, 
  form, 
  setForm,
  errors,
  bangsalOptions,
}) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={form.IDKAMAR ? 'Edit Kamar' : 'Tambah Kamar'}
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
          <label>Nama Kamar</label>
          <InputText
            className={inputClass('NAMAKAMAR')}
            value={form.NAMAKAMAR}
            onChange={(e) => setForm({ ...form, NAMAKAMAR: e.target.value })}
            placeholder="Masukkan nama kamar"
          />
          {errors.NAMAKAMAR && <small className="text-red-500">{errors.NAMAKAMAR}</small>}
        </div>

        <div>
          <label>Bangsal</label>
          <Dropdown
            className={inputClass('IDBANGSAL')}
            options={bangsalOptions}
            value={form.IDBANGSAL}
            onChange={(e) => setForm({ ...form, IDBANGSAL: e.value })}
            placeholder="Pilih Bangsal"
          />
          {errors.IDBANGSAL && <small className="text-red-500">{errors.IDBANGSAL}</small>}
        </div>

        <div>
          <label>Kapasitas</label>
          <InputText
            keyfilter="pint"
            className={inputClass('KAPASITAS')}
            value={form.KAPASITAS}
            onChange={(e) => setForm({ ...form, KAPASITAS: e.target.value })}
            placeholder="Masukkan kapasitas kamar"
          />
          {errors.KAPASITAS && <small className="text-red-500">{errors.KAPASITAS}</small>}
        </div>

        <div>
          <label>Keterangan</label>
          <InputText
            className={inputClass('KETERANGAN')}
            value={form.KETERANGAN}
            onChange={(e) => setForm({ ...form, KETERANGAN: e.target.value })}
            placeholder="Opsional"
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

export default FormKamar;
