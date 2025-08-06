'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';


const FormObat = ({ visible, onHide, onSubmit, form, setForm, errors, supplierOptions }) => {
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
          <label>Kode Obat</label>
          <InputText
            className={inputClass('KODEOBAT')}
            value={form.KODEOBAT}
            onChange={(e) => setForm({ ...form, KODEOBAT: e.target.value })}
          />
          {errors.KODEOBAT && <small className="text-red-500">{errors.KODEOBAT}</small>}
        </div>

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
          <label>Merek</label>
          <InputText
            className={inputClass('MEREK')}
            value={form.MEREK}
            onChange={(e) => setForm({ ...form, MEREK: e.target.value })}
          />
          {errors.MEREK && <small className="text-red-500">{errors.MEREK}</small>}
        </div>

        <div className="mt-2">
          <label>Jenis Obat</label>
          <Dropdown
            className={inputClass('JENISOBAT')}
            options={[
              { label: 'Tablet', value: 'TABLET' },
              { label: 'Kapsul', value: 'KAPSUL' },
              { label: 'Sirup', value: 'SIRUP' },
              { label: 'Oles', value: 'OLES' },
              { label: 'Larutan', value: 'LARUTAN' },
              { label: 'Puyer', value: 'PUYER' },
              { label: 'Pil', value: 'PIL' }
            ]}
            value={form.JENISOBAT}
            onChange={(e) => setForm({ ...form, JENISOBAT: e.value })}
            placeholder="Pilih Jenis Obat"
          />
          {errors.SATUAN && <small className="text-red-500">{errors.SATUAN}</small>}
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
          <label>Harga Beli</label>
            <InputNumber
              inputId="hargaBeli"
              className="w-full mt-2"
              value={form.HARGABELI}
              onValueChange={(e) => setForm({ ...form, HARGABELI: e.value })}
              mode="currency" currency="IDR" locale="id-ID"
            />
          {errors.HARGABELI && (
            <small className="text-red-500">{errors.HARGABELI}</small>  
          )}
        </div>

        <div className="mt-2">
          <label>Harga Jual</label>
            <InputNumber
              inputId="hargaJual"
              className="w-full mt-2"
              value={form.HARGAJUAL}
              onValueChange={(e) => setForm({ ...form, HARGAJUAL: e.value })}
              mode="currency" currency="IDR" locale="id-ID"
            />
          {errors.HARGAJUAL && (
            <small className="text-red-500">{errors.HARGAJUAL}</small>  
          )}
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
          <label>Lokasi Rak</label>
          <InputText
            className={inputClass('LOKASIRAK')}
            value={form.LOKASIRAK}
            onChange={(e) => setForm({ ...form, LOKASIRAK: e.target.value })}
          />
          {errors.LOKASIRAK && <small className="text-red-500">{errors.LOKASIRAK}</small>}
        </div>

        <div className="mt-2">
          <label>Supplier</label> 
            <Dropdown
              className={classNames('w-full mt-2', { 'p-invalid': errors.SUPPLIERID })}
              options={supplierOptions} 
              value={form.SUPPLIERID}
              onChange={(e) => setForm({ ...form, SUPPLIERID: e.value })}
              placeholder="Pilih Supplier"
              filter
              showClear
            />
            {errors.SUPPLIERID && (
              <small className="text-red-500">{errors.SUPPLIERID}</small>
            )}
        </div>

        <div className="mt-2">
          <label>Deskripsi</label>
          <InputText
            className={inputClass('DESKRIPSI')}
            value={form.DESKRIPSI}
            onChange={(e) => setForm({ ...form, DESKRIPSI: e.target.value })}
          />
          {errors.DESKRIPSI && <small className="text-red-500">{errors.DESKRIPSI}</small>}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormObat;