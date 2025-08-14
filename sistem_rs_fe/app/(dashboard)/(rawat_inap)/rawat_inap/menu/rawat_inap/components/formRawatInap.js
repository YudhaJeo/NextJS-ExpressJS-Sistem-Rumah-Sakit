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

  const tabMenu =[
    { label: 'Data Pasien', icon: 'pi pi-address-book' },
    { label: 'Ruangan', icon: 'pi pi-objects-column' },
    { label: 'Riwayat Tindakan', icon: 'pi pi-briefcase' },
    { label: 'Riwayat Obat', icon: 'pi pi-chart-pie' },
  ]
  
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
        {activeIndex === 0 && (
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
        {activeIndex === 1 && (
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
         {activeIndex === 2 && (
           <TabTindakan
             form={form}
             setForm={setForm}
             tindakanInapData={form.tindakanInap || []}
             tenagaMedisOptions={tenagaMedisOptions}
           />
         )}

         {/* TAB 3: Riwayat Obat */}
         {activeIndex === 3 && (
           <TabObat
             form={form}
             setForm={setForm}
             idRawatInap={form.IDRAWATINAP}
             obatInapData={form.obatInap || []}
             tenagaMedisOptions={tenagaMedisOptions}
           />
         )}
        
        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormRawatInap;