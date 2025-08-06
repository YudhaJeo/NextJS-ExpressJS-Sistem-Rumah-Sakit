'use client';

import { useEffect, useMemo } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

export default function FormDialogKartu({ visible, onHide, onSubmit, form, setForm, obatOptions, alkesOptions }) {
  // Helper update field
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Ambil stok awal dari dropdown obat & alkes yang dipilih
  const stokObat = useMemo(() => {
    const selected = obatOptions.find((o) => o.value === form.IDOBAT);
    return selected ? Number(selected.STOKOBAT) : 0;
  }, [form.IDOBAT, obatOptions]);

  const stokAlkes = useMemo(() => {
    const selected = alkesOptions.find((a) => a.value === form.IDALKES);
    return selected ? Number(selected.STOKALKES) : 0;
  }, [form.IDALKES, alkesOptions]);

  // Hitung SISASTOK otomatis setiap kali stok atau jumlah berubah
  useEffect(() => {
    const jumlahObat = Number(form.JUMLAHOBAT) || 0;
    const jumlahAlkes = Number(form.JUMLAHALKES) || 0;

    // Total stok awal
    const totalStokAwal = stokObat + stokAlkes;

    // Hitung sisa stok setelah dikurangi jumlah input
    const sisaStok = totalStokAwal - (jumlahObat + jumlahAlkes);

    // Update field SISASTOK otomatis
    setForm((prev) => ({
      ...prev,
      SISASTOK: sisaStok < 0 ? 0 : sisaStok // tidak boleh minus
    }));
  }, [stokObat, stokAlkes, form.JUMLAHOBAT, form.JUMLAHALKES, setForm]);

  return (
    <Dialog header="Form Kartu Stok" visible={visible} style={{ width: '500px' }} onHide={onHide} modal>
      <div className="p-fluid">
        {/* Dropdown Obat */}
        <label>Nama Obat</label>
        <Dropdown
          value={form?.IDOBAT || ''}
          options={obatOptions}
          onChange={(e) => updateField('IDOBAT', e.value)}
          placeholder="Pilih Obat"
          className="w-full mb-3"
        />

        {/* Dropdown Alkes */}
        <label>Nama Alat Kesehatan</label>
        <Dropdown
          value={form?.IDALKES || ''}
          options={alkesOptions}
          onChange={(e) => updateField('IDALKES', e.value)}
          placeholder="Pilih Alat Kesehatan"
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

        {/* Jumlah Obat */}
        <label>Jumlah Obat</label>
        <InputNumber
          value={Number(form?.JUMLAHOBAT) || 0}
          onValueChange={(e) => updateField('JUMLAHOBAT', e.value)}
          className="w-full mb-3"
        />

        {/* Jumlah Alkes */}
        <label>Jumlah Alat Kesehatan</label>
        <InputNumber
          value={Number(form?.JUMLAHALKES) || 0}
          onValueChange={(e) => updateField('JUMLAHALKES', e.value)}
          className="w-full mb-3"
        />

        {/* Sisa Stok (Read Only) */}
        <label>Sisa Stok</label>
        <InputNumber
          value={Number(form?.SISASTOK) || 0}
          readOnly
          className="w-full mb-3 p-inputtext-readonly"
        />

        {/* Keterangan */}
        <label>Keterangan</label>
        <InputText
          value={form?.KETERANGAN || ''}
          onChange={(e) => updateField('KETERANGAN', e.target.value)}
          className="w-full mb-3"
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <Button label="Batal" severity="secondary" onClick={onHide} />
          <Button label="Simpan" severity="success" onClick={onSubmit} />
        </div>
      </div>
    </Dialog>
  );
}
