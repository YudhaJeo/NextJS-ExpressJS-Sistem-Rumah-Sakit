// app/(dashboard)/master/agama/components/formDialogAgama.js
'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

const FormObat = ({ visible, onHide, onSubmit, form, setForm, errors }) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={form.IDAGAMA ? 'Edit Agama' : 'Tambah Agama'}
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
          <label>Nama Obat</label>
          <InputText
            className={inputClass('NAMAAGAMA')}
            value={form.NAMAAGAMA}
            onChange={(e) => setForm({ ...form, NAMAAGAMA: e.target.value })}
          />
          {errors.NAMAAGAMA && <small className="text-red-500">{errors.NAMAAGAMA}</small>}
        </div>

        <div className="mt-2">
          <label>Status</label>
          <Dropdown
            className={inputClass('SATUAN')}
            options={[
              { label: 'Tablet', value: 'TABLET' },
              { label: 'Kapsul', value: 'KAPSUL' },
              { label: 'Sirup', value: 'SIRUP' },
              { label: 'Botol', value: 'BOTOL' },
              { label: 'Ampul', value: 'AMPUL' },
              { label: 'Tube', value: 'TUBE' },
              { label: 'Biji', value: 'BIJI' },
            ]}
            value={form.SATUAN}
            onChange={(e) => setForm({ ...form, SATUAN: e.value })}
            placeholder="Pilih"
          />
          {errors.SATUAN && <small className="text-red-500">{errors.SATUAN}</small>}
        </div>

        <div>
          <label>Harga (Rupiah)</label>
          <InputNumber
            inputId="harga"
            className="w-full mt-2"
            inputClassName={errors.HARGA ? 'p-invalid' : ''}
            value={form.HARGA}
            onValueChange={(e) => setForm({ ...form, HARGA: e.value })}
            mode="currency"
            currency="IDR"
            locale="id-ID"
          />
          {errors.HARGA && (
            <small className="text-red-500">{errors.HARGA}</small>
          )}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormObat;
