// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_fe\app\(dashboard)\(rawat_inap)\rawat_inap\menu\rawat_inap\components\formRawatInap.js
'use client';

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { TabMenu } from 'primereact/tabmenu';
import { InputText } from 'primereact/inputtext';

const FormRawatInap = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  errors,
  pengobatanOptions,
  bedOptions
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  const items = [
    { label: 'Data Pasien', icon: 'pi pi-id-card' },
    { label: 'Ruang', icon: 'pi pi-objects-column' },
    { label: 'Perawatan', icon: 'pi pi-clone' },
  ];

  const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(value || 0);

  return (
    <Dialog
      header={form.IDRAWATINAP ? 'Edit Rawat Inap' : 'Tambah Rawat Inap'}
      visible={visible}
      onHide={onHide}
      style={{ width: '50vw' }}
    >
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >

        <TabMenu 
          model={items} 
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}  
        />
        
        {/* TAB 0: Data Pasien */}
        {activeIndex === 0 && (
          <>
            <div className="mt-2">
              <label>Rawat Inap</label>
              <Dropdown
                className={inputClass('IDRAWATJALAN')}
                value={form.IDRAWATJALAN}
                options={pengobatanOptions}
                onChange={(e) => {
                  const selected = pengobatanOptions.find((o) => o.value === e.value);
                  setForm({
                    ...form,
                    IDRAWATJALAN: e.value,
                    POLI: selected?.POLI || '',
                    JENISKELAMIN: selected?.JENISKELAMIN || '',
                    NIK: selected?.NIK || '',
                    ALAMAT_PASIEN: selected?.ALAMAT_PASIEN || '',
                  })
                }}
                disabled
                placeholder="Pilih Rawat Inap"
                filter
                showClear
                optionLabel="label"
              />
              {errors.IDRAWATJALAN && <small className="text-red-500">{errors.IDRAWATJALAN}</small>}
            </div>

            <div className="mt-2">
              <label>Poli</label>
              <InputText
                className={inputClass('POLI')}
                value={form.POLI}
                onChange={(e) => setForm({ ...form, POLI: e.value })}
                disabled={!!form.POLI}
              />
            </div>
            
            <div className="mt-2">
              <label>Jenis Kelamin</label>    
              <InputText
                disabled
                className={inputClass('JENISKELAMIN')}
                value={form.JENISKELAMIN}
              />
            </div>
            
            <div className="mt-2">
              <label>NIK</label>
              <InputText
                disabled
                className={inputClass('NIK')}
                value={form.NIK}
              />
            </div>

            <div className="mt-2">
              <label>Alamat</label>
              <InputText
                disabled
                className={inputClass('ALAMAT_PASIEN')}
                value={form.ALAMAT_PASIEN}
              />
            </div>
          </>
        )}
        
        {/* TAB 1: Data Ruangan  */}
        {activeIndex === 1 && (
          <>
            <div className="mt-2">
              <label>Bed</label>
              <Dropdown
                className={inputClass('NOMORBED')}
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
                disabled
                showClear
                optionLabel="label"
              />
              {errors.IDBED && <small className="text-red-500">{errors.IDBED}</small>}
            </div>

            <div className="mt-2">
              <label>Kamar</label>
              <InputText
                disabled
                className={inputClass('NAMAKAMAR')}
                value={form.NAMAKAMAR}
              />
            </div>

            <div className="mt-2">
              <label>Bangsal</label>
              <InputText
                disabled
                className={inputClass('NAMABANGSAL')}
                value={form.NAMABANGSAL}
              />
            </div>
          
            <div className="mt-2">
              <label>Harga Bangsal (Hari)</label>
              <InputText
                disabled
                className={inputClass('HARGAPERHARI')}
                value={formatRupiah(form.HARGAPERHARI)}
                mode='currency'
              />
            </div>
          </>
        )}
        

        {/* TAB 2: Perawatan  */}
        {activeIndex === 2 && (
          <>
            <div className="mt-2">
              <label>Tanggal Masuk</label>
              <Calendar
                className={inputClass('TANGGALMASUK')}
                value={form.TANGGALMASUK ? new Date(form.TANGGALMASUK) : null}
                onChange={(e) => setForm({ ...form, TANGGALMASUK: e.value })}
                showIcon
                dateFormat="yy-mm-dd"
              />
              {errors.TANGGALMASUK && <small className="text-red-500">{errors.TANGGALMASUK}</small>}
            </div>

            <div className="mt-2">
              <label className="mb-1">Tanggal Keluar</label>
              <div className="flex items-center gap-2">
                <Calendar
                  className={inputClass('TANGGALKELUAR')}
                  value={form.TANGGALKELUAR ? new Date(form.TANGGALKELUAR) : null}
                  onChange={(e) => setForm({ ...form, TANGGALKELUAR: e.value })}
                  showIcon
                  dateFormat="yy-mm-dd"
                />
                {form.TANGGALKELUAR && (
                  <Button
                    type="button"
                    icon="pi pi-times"
                    className="p-button-text p-button-danger"
                    tooltip="Hapus Tanggal"
                    onClick={() => setForm({ ...form, TANGGALKELUAR: null })}
                  />
                )}
              </div>
              {errors.TANGGALKELUAR && (
                <small className="text-red-500">{errors.TANGGALKELUAR}</small>
              )}
            </div>


            <div className="mt-2">
              <label>Catatan</label>
              <InputTextarea
                className={inputClass('CATATAN')}
                value={form.CATATAN || ''}
                onChange={(e) => setForm({ ...form, CATATAN: e.target.value })}
                placeholder="Masukkan catatan (Opsional)"
              />
            </div>
          </>
        )}
        
        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormRawatInap;