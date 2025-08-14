// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_fe\app\(dashboard)\(rawat_inap)\rawat_inap\menu\rawat_inap\components\formRawatInap.js
'use client';

import { Dropdown } from 'primereact/dropdown';
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { TabMenu } from 'primereact/tabmenu';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import {
  TabDataPasien,
  TabRuangan,
  TabTindakan,
  TabObat,
} from './tabs';

const FormRawatInap = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  errors,
  rawatJalanOptions,
  bedOptions,
  tenagaMedisOptions,
}) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  const isEditMode = !!form.IDRAWATINAP;

  let tabMenu;

  if (isEditMode){
    tabMenu = [
        { label: 'Data Pasien', icon: 'pi pi-address-book' },
        { label: 'Ruangan', icon: 'pi pi-objects-column' },
        { label: 'Riwayat Tindakan', icon: 'pi pi-briefcase' },
        { label: 'Riwayat Obat', icon: 'pi pi-chart-pie' },
      ];
    } else {
      tabMenu = [
        { label: 'Tambah Rawat Inap Baru', icon: 'pi pi-th-large' },
      ];
    }
  
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Dialog
      header={form.IDRAWATINAP ? 'Edit Rawat Inap' : 'Tambah Rawat Inap'}
      visible={visible}
      onHide={onHide}
      style={{ width: '80vw' }}
    >
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >

        <TabMenu 
          model={tabMenu} 
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}  
        />
        
        {/* TAB 0: Data Pasien */}
        {isEditMode && activeIndex === 0 && (
          <TabDataPasien
            form={form}
            setForm={setForm}
            errors={errors}
            rawatJalanOptions={rawatJalanOptions}
            isEditMode={isEditMode}
            inputClass={inputClass}
          />
        )}
        
        {/* TAB 1: Data Ruangan  */}
        {isEditMode && activeIndex === 1 && (
          <TabRuangan
            form={form}
            setForm={setForm}
            errors={errors}
            bedOptions={bedOptions}
            isEditMode={isEditMode}
            inputClass={inputClass}
          />
        )}

         {/* TAB 2: Riwayat Tindakan */}
         {isEditMode && activeIndex === 2 && (
           <TabTindakan
             form={form}
             setForm={setForm}
             tindakanInapData={form.tindakanInap || []}
             tenagaMedisOptions={tenagaMedisOptions}
           />
         )}

         {/* TAB 3: Riwayat Obat */}
         {isEditMode && activeIndex === 3 && (
           <TabObat
             form={form}
             setForm={setForm}
             idRawatInap={form.IDRAWATINAP}
             obatInapData={form.obatInap || []}
             tenagaMedisOptions={tenagaMedisOptions}
           />
         )}

        {/* TAB 4: Tambah Ranap Baru */}
        {!isEditMode && activeIndex === 0 && (
          <>
            <div className="mt-2">
              <label>Rawat Inap</label>
              <Dropdown
                className={inputClass('IDRAWATJALAN')}
                value={form.IDRAWATJALAN}
                options={rawatJalanOptions}
                onChange={(e) => setForm({ ...form, IDRAWATJALAN: e.value })}
                placeholder="Pilih Rawat Inap"
                filter
                showClear
                optionLabel="label"
              />
              {errors.IDRAWATJALAN && <small className="text-red-500">{errors.IDRAWATJALAN}</small>}
            </div>

            <div className="mt-2">
              <label>Bed</label>
              <Dropdown
                className={inputClass('IDBED')}
                value={form.IDBED}
                options={bedOptions}
                onChange={(e) => setForm({ ...form, IDBED: e.value })}
                placeholder="Pilih Bed"
                filter
                showClear
                optionLabel="label"
              />
              {errors.IDBED && <small className="text-red-500">{errors.IDBED}</small>}
            </div>

            <div className="mt-2">
              <label>Tanggal Masuk</label>
              <Calendar
                className={inputClass('TANGGALMASUK')}
                value={form.TANGGALMASUK ? new Date(form.TANGGALMASUK) : null}
                onChange={(e) => setForm({ ...form, TANGGALMASUK: e.value })}
                showIcon
                dateFormat="yy-mm-dd"
                showButtonBar
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
                  showButtonBar
                />
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