// app\(dashboard)\(rawat_inap)\rawat_inap\menu\rawat_inap\components\formTindakan.js
'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import React from 'react';
import { InputNumber } from 'primereact/inputnumber';

const FormTindakanInap = ({ 
  visible, 
  onHide, 
  onSubmit, 
  form, 
  setForm,
  errors,
  pasienOptions,
  tindakanOptions
}) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';
  return (
    <Dialog
      header={form.IDTINDAKANINAP ? 'Edit Data Tindakan pada Pasien' : 'Tambah Tindakan pada Pasien'}
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
        <div className="mt-2">
          <label>Pasien</label>
          <Dropdown
            className={inputClass('IDRAWATINAP')}
            value={form.IDRAWATINAP}
            options={pasienOptions}
            onChange={(e) => setForm({ ...form, IDRAWATINAP: e.target.value })}
            placeholder="Pilih pasien yang sedang dirawat"
            filter
            showClear
            optionLabel="label"
          />
          {errors.IDRAWATINAP && <small className="text-red-500">{errors.IDRAWATINAP}</small>}
        </div>

        <div className='mt-2'>
          <label className="">Pilih tindakan untuk pasien</label>
          <Dropdown
            className={inputClass('IDTINDAKAN')}
            value={form.IDTINDAKAN}
            options={tindakanOptions}
            onChange={(e) => {
              setForm({
                ...form,
                IDTINDAKAN: e.value, 
              });
            }}            
            placeholder="Pilih tindakan yang diberikan ke pasien"
            filter
            showClear
            optionLabel="label"
          />
          {errors.JUMLAH && (
            <small className="text-red-500">{errors.JUMLAH}</small>
          )}
        </div>

        <div className="">
          <label htmlFor="stok">Jumlah</label>
          <InputNumber
            inputId="stok"
            className="w-full mt-2"
            inputClassName={errors.JUMLAH ? 'p-invalid' : ''}
            value={form.JUMLAH}
            onValueChange={(e) => {
              setForm({ ...form, JUMLAH: e.value });
            }}

          />
          {errors.JUMLAH && (
            <small className="text-red-500">{errors.JUMLAH}</small>
          )}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormTindakanInap;