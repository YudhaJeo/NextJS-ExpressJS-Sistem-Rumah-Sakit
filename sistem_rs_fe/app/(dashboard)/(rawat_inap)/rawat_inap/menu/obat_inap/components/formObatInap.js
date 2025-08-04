'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

const FormObatInap = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  errors,
  pasienOptions,
  obatOptions
}) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';
  return (
    <Dialog
      header={form.IDOBATINAP ? 'Edit Data Obat Pasien' : 'Tambah Obat Pasien'}
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
          <label className="">Pilih Obat</label>
          <Dropdown
            className={inputClass('IDOBAT')}
            value={form.IDOBAT}
            options={obatOptions}
            onChange={(e) => {
              const selected = obatOptions.find((p) => p.value === e.value);
              const harga = selected?.HARGA || 0;
              const jumlah = form.JUMLAH || 0;

              setForm({
                ...form,
                IDOBAT: e.value,
                HARGA: harga,
                TOTAL: harga * jumlah,
              });
            }}
            placeholder="Pilih obat yang diberikan ke pasien"
            filter
            showClear
            optionLabel="label"
          />
          {errors.JUMLAH && (
            <small className="text-red-500">{errors.JUMLAH}</small>
          )}
        </div>

        <div className='mt-2'>
          <label>Harga</label>
          <InputNumber
            className="w-full mt-2"
            value={form.HARGA || ''}
            disabled
            mode='currency'
            currency='IDR'
            locale='id-ID'
          />
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

        <div className='mt-2'>
          <label>Total</label>
          <InputNumber
            className="w-full mt-2"
            value={form.TOTAL || ''}
            disabled
            mode='currency'
            currency='IDR'
            locale='id-ID'
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