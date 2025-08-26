import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';

const TabRuangan = ({
  form,
  setForm,
  errors,
  bedOptions,
  isEditMode,
  inputClass
}) => {
  const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(value || 0);

    const isDisabled = (form?.STATUS || '').toUpperCase() !== 'AKTIF';

  return (
    <>
      <div className="mt-2">
        <label>Bed</label>
        <Dropdown
          readOnly={isDisabled}
          className={inputClass('IDBED')}
          value={form.IDBED}
          options={bedOptions}
          onChange={(e) => {
            const selected = bedOptions.find((o) => o.value === e.value);
            setForm({
              ...form,
              IDBED: e.value,
              NAMAKAMAR: selected?.NAMAKAMAR || '',
              NAMABANGSAL: selected?.NAMABANGSAL || '',
              HARGAPERHARI: selected?.HARGAPERHARI || '',
              STATUSBED: selected?.STATUSBED || '',
            })
          }}
          placeholder="Pilih Bed"
          filter
          showClear
          optionLabel="label"
        />
        {errors.IDBED && <small className="text-red-500">{errors.IDBED}</small>}
      </div>

      <div className="mt-2">
        <label>Tanggal Masuk (Mulai)</label>
        <Calendar
          readOnly={isDisabled}
          className={inputClass('TANGGALMASUK')}
          value={form.TANGGALMASUK ? new Date(form.TANGGALMASUK) : null}
          onChange={(e) => setForm({ ...form, TANGGALMASUK: e.value })}
          showButtonBar
          showIcon
          dateFormat="yy-mm-dd"
          placeholder="Tanggal Masuk"
        />
        {errors.TANGGALMASUK && <small className="text-red-500">{errors.TANGGALMASUK}</small>}
      </div>

      <div className="mt-2">
        <label className="mb-1">Tanggal Keluar (Pulang)</label>
        <div className="flex items-center gap-2">
          <Calendar
            readOnly={isDisabled}
            className={inputClass('TANGGALKELUAR')}
            value={form.TANGGALKELUAR ? new Date(form.TANGGALKELUAR) : null}
            onChange={(e) => setForm({ ...form, TANGGALKELUAR: e.value })}
            showButtonBar
            showIcon
            dateFormat="yy-mm-dd"
            placeholder="Isi jika pasien akan checkout"
          />
        </div>
        {errors.TANGGALKELUAR && (
          <small className="text-red-500">{errors.TANGGALKELUAR}</small>
        )}
      </div>

      <div className="mt-2">
        <label>Catatan</label>
        <InputTextarea
          readOnly={isDisabled}
          className={inputClass('CATATAN')}
          value={form.CATATAN || ''}
          onChange={(e) => setForm({ ...form, CATATAN: e.target.value })}
          placeholder="Masukkan catatan (Opsional)"
        />
      </div>

      <div className="mt-2">
        <label>Kamar</label>
        <InputText
          readOnly={isEditMode}
          className={inputClass('NAMAKAMAR')}
          value={form.NAMAKAMAR}
        />
      </div>

      <div className="mt-2">
        <label>Bangsal</label>
        <InputText
          readOnly={isEditMode}
          className={inputClass('NAMABANGSAL')}
          value={form.NAMABANGSAL}
        />
      </div>
    
      <div className="mt-2">
        <label>Harga Bangsal (Hari)</label>
        <InputText
          readOnly={isEditMode}
          className={inputClass('HARGAPERHARI')}
          value={formatRupiah(form.HARGAPERHARI)}
          mode='currency'
        />
      </div>
    </>
  );
};

export default TabRuangan;
