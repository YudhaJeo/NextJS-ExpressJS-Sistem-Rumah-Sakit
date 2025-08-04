'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';

const MyForm = ({ visible, onHide, onSubmit, form, setForm, errors }) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={form.IDTINDAKAN ? 'Edit Tindakan Medis' : 'Tambah Tindakan Medis'}
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
          <label>Nama Tindakan Medis</label>
          <InputText
            className={inputClass('NAMATINDAKAN')}
            value={form.NAMATINDAKAN}
            onChange={(e) => setForm({ ...form, NAMATINDAKAN: e.target.value })}
          />
          {errors.NAMATINDAKAN && <small className="text-red-500">{errors.NAMATINDAKAN}</small>}
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
          <label>Kategori</label>
          <Dropdown
            className={inputClass('KATEGORI')}
            options={[
              { label: 'Operasi', value: 'OPERASI' },
              { label: 'Perawatan', value: 'PERAWATAN' },
              { label: 'Diagnosis', value: 'DIAGNOSTIK' },
              { label: 'Lainnya', value: 'LAINNYA' },
            ]}
            value={form.KATEGORI}
            onChange={(e) => setForm({ ...form, KATEGORI: e.value })}
            placeholder="Pilih"
          />
          {errors.KATEGORI && <small className="text-red-500">{errors.KATEGORI}</small>}
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

export default MyForm;
