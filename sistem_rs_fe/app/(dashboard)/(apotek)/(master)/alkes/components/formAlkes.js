'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';

const FormAlkes = ({ visible, onHide, onSubmit, form, setForm, errors, supplierOptions }) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={form.IDALKES ? 'Edit Alat Kesehatan' : 'Tambah Alat Kesehatan'}
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
          <label>Kode Alat Kesehatan</label>
          <InputText
            className={inputClass('KODEALKES')}
            value={form.KODEALKES}
            onChange={(e) => setForm({ ...form, KODEALKES: e.target.value })}
          />
          {errors.KODEALKES && <small className="text-red-500">{errors.KODEALKES}</small>}
        </div>

        <div className="mt-2">
          <label>Nama Alat Kesehatan</label>
          <InputText
            className={inputClass('NAMAALKES')}
            value={form.NAMAALKES}
            onChange={(e) => setForm({ ...form, NAMAALKES: e.target.value })}
          />
          {errors.NAMAALKES && <small className="text-red-500">{errors.NAMAALKES}</small>}
        </div>

        <div className="mt-2">
          <label>Merk Alat Kesehatan</label>  
          <InputText
            className={inputClass('MERKALKES')}
            value={form.MERKALKES || ''}
            onChange={(e) => setForm({ ...form, MERKALKES: e.target.value })}
          />
          {errors.MERKALKES && <small className="text-red-500">{errors.MERKALKES}</small>}
        </div>

        <div className="mt-2">
            <label>Jenis Alat Kesehatan</label>
            <InputText
                className={inputClass('JENISALKES')}
                value={form.JENISALKES || ''}
                onChange={(e) => setForm({ ...form, JENISALKES: e.target.value })}
            />
            {errors.JENISALKES && <small className="text-red-500">{errors.JENISALKES}</small>}
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
          {errors.STOK && <small className="text-red-500">{errors.STOK}</small>}
        </div>

        <div className="mt-2">
          <label>Harga Beli</label>
          <InputNumber
            inputId="hargaBeli"
            className="w-full mt-2"
            value={form.HARGABELI}
            onValueChange={(e) => setForm({ ...form, HARGABELI: e.value })}
            mode="currency"
            currency="IDR"
            locale="id-ID"
          />
          {errors.HARGABELI && <small className="text-red-500">{errors.HARGABELI}</small>}
        </div>

        <div className="mt-2">
          <label>Harga Jual</label>
          <InputNumber
            inputId="hargaJual"
            className="w-full mt-2"
            value={form.HARGAJUAL}
            onValueChange={(e) => setForm({ ...form, HARGAJUAL: e.value })}
            mode="currency"
            currency="IDR"
            locale="id-ID"
          />
          {errors.HARGAJUAL && <small className="text-red-500">{errors.HARGAJUAL}</small>}
        </div>

        <div className="mt-2">
          <label>Tanggal Kadaluarsa</label>
            <Calendar
              className={classNames('w-full mt-2', { 'p-invalid': errors.TGLKADALUARSA })}
              dateFormat="yy-mm-dd"
              value={form.TGLKADALUARSA ? new Date(form.TGLKADALUARSA) : undefined}
              onChange={(e) =>
                setForm({
                  ...form,
                  TGLKADALUARSA: e.value?.toISOString().split('T')[0] || '',
                })
              }
              showIcon
            />
          {errors.TGLKADALUARSA && (
            <small className="text-red-500">{errors.TGLKADALUARSA}</small>
          )}
        </div>

        <div className="mt-2">
          <label>Lokasi</label>
          <InputText
            className={inputClass('LOKASI')}
            value={form.LOKASI || ''}
            onChange={(e) => setForm({ ...form, LOKASI: e.target.value })}
          />
          {errors.LOKASI && <small className="text-red-500">{errors.LOKASI}</small>}
        </div>
        
        <div className="mt-2">
          <label>Supplier</label>
          <Dropdown
            className={classNames('w-full mt-2', { 'p-invalid': errors.SUPPLIERID })}
            options={supplierOptions}
            value={form.SUPPLIERID}
            onChange={(e) => setForm({ ...form, SUPPLIERID: e.value })}
            placeholder="Pilih Supplier"
          />
          {errors.SUPPLIERID && <small className="text-red-500">{errors.SUPPLIERID}</small>}
        </div>

        <div className="mt-2">
          <label>Keterangan</label>
          <InputText
            className={inputClass('KETERANGAN')}
            value={form.KETERANGAN || ''}
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

export default FormAlkes;