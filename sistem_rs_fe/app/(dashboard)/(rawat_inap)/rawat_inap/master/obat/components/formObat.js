'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

const FormObat = ({ visible, onHide, onSubmit, form, setForm, errors }) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={form.IDOBAT ? 'Edit Obat' : 'Tambah Obat'}
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
          <label>Nama Obat</label>
          <InputText
            className={inputClass('NAMAOBAT')}
            value={form.NAMAOBAT}
            onChange={(e) => setForm({ ...form, NAMAOBAT: e.target.value })}
          />
          {errors.NAMAOBAT && <small className="text-red-500">{errors.NAMAOBAT}</small>}
        </div>

        <div className="mt-2">
          <label>Satuan</label>
          <Dropdown
            className={inputClass('JENISOBAT')}
            options={[
              { label: 'Tablet', value: 'TABLET' },
              { label: 'Kapsul', value: 'KAPSUL' },
              { label: 'Sirup', value: 'SIRUP' },
              { label: 'Botol', value: 'BOTOL' },
              { label: 'Ampul', value: 'AMPUL' },
              { label: 'Tube', value: 'TUBE' },
              { label: 'Biji', value: 'BIJI' },
            ]}
            value={form.JENISOBAT}
            onChange={(e) => setForm({ ...form, JENISOBAT: e.value })}
            placeholder="Pilih"
          />
          {errors.JENISOBAT && <small className="text-red-500">{errors.JENISOBAT}</small>}
        </div>

        <div className="mt-2">
          <label>Stok</label>
          <InputNumber
            inputId="stok"
            className="w-full mt-2"
            inputClassName={errors.STOK ? 'p-invalid' : ''}
            value={form.STOK}
            onValueChange={(e) => setForm({ ...form, STOK: e.value })}
          />
          {errors.STOK && (
            <small className="text-red-500">{errors.STOK}</small>
          )}
        </div>

        <div className="mt-2">
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

        <div className="mt-2">
          <label>Keterangan</label>
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

export default FormObat;
