'use client';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

export default function FormDialogKartu({ visible, onHide, onSubmit, form, setForm, obatOptions, alkesOptions }) {
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog header="Form Kartu Stok" visible={visible} style={{ width: '500px' }} onHide={onHide} modal>
      <div className="p-fluid">
        Dropdown Obat
        <label>Nama Obat</label>
        <Dropdown
          value={form?.IDOBAT || ''}
          options={obatOptions}
          onChange={(e) => updateField('IDOBAT', e.value)}
          placeholder="Pilih Obat"
          className="w-full mb-3"
        />

        <label>Nama Alat Kesehatan</label>
        <Dropdown
          value={form?.IDALKES || ''}
          options={alkesOptions}
          onChange={(e) => updateField('IDALKES', e.value)}
          placeholder="Pilih Obat"
          className="w-full mb-3"
        />

        {/* Tanggal */}
        <label>Tanggal</label>
        <Calendar
          value={form?.TANGGAL ? new Date(form.TANGGAL) : null}
          onChange={(e) => updateField('TANGGAL', e.value?.toISOString().split('T')[0] || '')}
          dateFormat="yy-mm-dd"
          className="w-full mb-3"
        />

        {/* Jenis Transaksi */}
        <label>Jenis Transaksi</label>
        <Dropdown
          value={form?.JENISTRANSAKSI || ''}
          options={[
            { label: 'MASUK', value: 'MASUK' },
            { label: 'KELUAR', value: 'KELUAR' }
          ]}
          onChange={(e) => updateField('JENISTRANSAKSI', e.value)}
          placeholder="Pilih Jenis Transaksi"
          className="w-full mb-3"
        />

        {/* Jumlah */}
        <label>Jumlah Obat</label>
        <InputNumber
          value={Number(form?.JUMLAHOBAT) || 0}
          onValueChange={(e) => updateField('JUMLAHOBAT', e.value)}
          className="w-full mb-3"
        />

        <label>Jumlah Alat Kesehatan</label>
        <InputNumber
          value={Number(form?.JUMLAHALKES) || 0}
          onValueChange={(e) => updateField('JUMLAHALKES', e.value)}
          className="w-full mb-3"
        />

        {/* Sisa Stok */}
        <label>Sisa Stok</label>
        <InputNumber
          value={Number(form?.SISASTOK) || 0}
          onValueChange={(e) => updateField('SISASTOK', e.value)}
          className="w-full mb-3"
        />

        {/* Keterangan */}
        <label>Keterangan</label>
        <InputText
          value={form?.KETERANGAN || ''}
          onChange={(e) => updateField('KETERANGAN', e.target.value)}
          className="w-full mb-3"
        />

        {/* Button Action */}
        <div className="flex justify-end gap-2 mt-4">
          <Button label="Batal" severity="secondary" onClick={onHide} />
          <Button label="Simpan" severity="success" onClick={onSubmit} />
        </div>
      </div>
    </Dialog>
  );
}
