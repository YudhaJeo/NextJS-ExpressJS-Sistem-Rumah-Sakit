// app\(dashboard)\(rawat_inap)\rawat_inap\menu\rawat_inap\components\formTindakan.js
'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import React from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
        

const FormRawatInap = ({ 
  visible, 
  onHide, 
  onSubmit, 
  form, 
  setForm,
  errors,
  pasienOptions,
  kamarOptions,
  bedOptions
}) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';
  return (
    <Dialog
      header={form.IDRAWATINAP ? 'Edit Rawat Inap' : 'Tambah Rawat Inap'}
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
            className={inputClass('IDPASIEN')}
            value={form.IDPASIEN}
            options={pasienOptions}
            onChange={(e) => setForm({ ...form, IDPASIEN: e.target.value })}
            placeholder="Pilih Pasien"
            filter
            showClear
            optionLabel="label"
          />
          {errors.IDPASIEN && <small className="text-red-500">{errors.IDPASIEN}</small>}
        </div>

        <div className="mt-2">
          <label>Bed</label>
          <Dropdown
            className={inputClass('IDBED')}
            value={form.IDBED}
            options={bedOptions}
            onChange={(e) => setForm({ ...form, IDBED: e.value })}
            placeholder="Pilih Bed"
            filter
            showClear
            optionLabel="label"
          />
          {errors.IDBED && <small className="text-red-500">{errors.IDBED}</small>}
        </div>

        <div className="mt-2">
          <label>Tanggal Masuk</label>
          <Calendar
            className={inputClass('TANGGALMASUK')}
            value={form.TANGGALMASUK ? new Date(form.TANGGALMASUK) : null}
            onChange={(e) => setForm({ ...form, TANGGALMASUK: e.value })}
            showIcon
            dateFormat="yy-mm-dd"
          />
          {errors.TANGGALMASUK && <small className="text-red-500">{errors.TANGGALMASUK}</small>}
        </div>

        <div className="mt-2">
          <label className="mb-1">Tanggal Keluar</label>
          <div className="flex items-center gap-2">
            <Calendar
              className={inputClass('TANGGALKELUAR')}
              value={form.TANGGALKELUAR ? new Date(form.TANGGALKELUAR) : null}
              onChange={(e) => setForm({ ...form, TANGGALKELUAR: e.value })}
              showIcon
              dateFormat="yy-mm-dd"
            />
            {form.TANGGALKELUAR && (
              <Button
                type="button"
                icon="pi pi-times"
                className="p-button-text p-button-danger"
                tooltip="Hapus Tanggal"
                onClick={() => setForm({ ...form, TANGGALKELUAR: null })}
              />
            )}
          </div>
          {errors.TANGGALKELUAR && (
            <small className="text-red-500">{errors.TANGGALKELUAR}</small>
          )}
        </div>


        <div className="mt-2">
          <label>Catatan</label>
          <InputTextarea
            className={inputClass('CATATAN')}
            value={form.CATATAN || ''} 
            onChange={(e) => setForm({ ...form, CATATAN: e.target.value })}
            placeholder="Masukkan catatan (Opsional)"
          />
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormRawatInap;