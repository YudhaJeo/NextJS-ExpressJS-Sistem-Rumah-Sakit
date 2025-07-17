// app\(dashboard)\(rawat_inap)\rawat_inap\menu\obat_inap\components\formObatInap.js
'use client';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import React from 'react';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';

const FormObatInap = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  errors,
  rawatInapOptions,
  obatOptions
}) => {
  const inputClass = field =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={form.IDOBATINAP ? 'Edit Obat Inap' : 'Tambah Obat Inap'}
      visible={visible}
      onHide={onHide}
      style={{ width: '30vw' }}
    >
      <form
        className="space-y-3"
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div>
          <label>Rawat Inap</label>
          <Dropdown
            className={inputClass('IDRAWATINAP')}
            value={form.IDRAWATINAP}
            options={rawatInapOptions}
            onChange={e => setForm({ ...form, IDRAWATINAP: e.value })}
            placeholder="Pilih Pasien"
            filter
            showClear
            optionLabel="label"
          />
          {errors.IDRAWATINAP && <small className="text-red-500">{errors.IDRAWATINAP}</small>}
        </div>

        <div>
          <label>Obat</label>
          <Dropdown
            className={inputClass('IDOBAT')}
            value={form.IDOBAT}
            options={obatOptions}
            onChange={e => setForm({ ...form, IDOBAT: e.value })}
            placeholder="Pilih Obat"
            filter
            showClear
            optionLabel="label"
          />
          {errors.IDOBAT && <small className="text-red-500">{errors.IDOBAT}</small>}
        </div>

        <div>
          <label>Jumlah</label>
          <InputNumber
            className={inputClass('JUMLAH')}
            value={form.JUMLAH}
            onValueChange={e => setForm({ ...form, JUMLAH: e.value })}
            min={1}
            showButtons
            mode="decimal"
          />
          {errors.JUMLAH && <small className="text-red-500">{errors.JUMLAH}</small>}
        </div>

        <div>
          <label>Tanggal Pemberian</label>
          <Calendar
            className={inputClass('DIBERIKANPADA')}
            value={form.DIBERIKANPADA ? new Date(form.DIBERIKANPADA) : null}
            onChange={e => setForm({ ...form, DIBERIKANPADA: e.value })}
            showIcon
            dateFormat="yy-mm-dd"
          />
        </div>

        <div>
          <label>Catatan</label>
          <InputTextarea
            className={inputClass('CATATAN')}
            value={form.CATATAN || ''}
            onChange={e => setForm({ ...form, CATATAN: e.target.value })}
            rows={3}
          />
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormObatInap;