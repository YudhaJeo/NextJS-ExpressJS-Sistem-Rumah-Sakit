// D:\MARSTECH\NextJS-ExpressJS-Final-System\sistem_rs_fe\app\(dashboard)\(rawat_inap)\rawat_inap\menu\rawat_inap\components\formRawatInap.js
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { TabMenu } from 'primereact/tabmenu';
import Cookies from 'js-cookie';
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
  mode = 'edit',
}) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  const isEditMode = !!form.IDRAWATINAP;

  const tabMenuEdit = [
    { label: 'Data Pasien', icon: 'pi pi-address-book' },
    { label: 'Ruangan', icon: 'pi pi-objects-column' },
  ];

  const tabMenuVisit = [
    { label: 'Pemberian Tindakan', icon: 'pi pi-briefcase' },
    { label: 'Pemberian Obat', icon: 'pi pi-chart-pie' },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [mode]);

  useEffect(() => {
    if (visible && form.IDRAWATINAP) {
      Cookies.set('idRawatInap', form.IDRAWATINAP, { path: '/' });
    }
    if (!visible) {
      Cookies.remove('idRawatInap', { path: '/' });
    }
  }, [visible, form.IDRAWATINAP]);

  const currentTabMenu = mode === 'edit' ? tabMenuEdit : tabMenuVisit;

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
          model={currentTabMenu}
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        />

        {mode === 'edit' && activeIndex === 0 && (
          <TabDataPasien
            form={form}
            setForm={setForm}
            errors={errors}
            rawatJalanOptions={rawatJalanOptions}
            isEditMode={isEditMode}
            inputClass={inputClass}
          />
        )}
        {mode === 'edit' && activeIndex === 1 && (
          <TabRuangan
            form={form}
            setForm={setForm}
            errors={errors}
            bedOptions={bedOptions}
            isEditMode={isEditMode}
            inputClass={inputClass}
          />
        )}

        {mode === 'visit' && activeIndex === 0 && (
          <TabTindakan
            form={form}
            setForm={setForm}
            idRawatInap={Cookies.get('IDRAWATINAP')}
            tindakanInapData={form.tindakanInap || []}
            tenagaMedisOptions={tenagaMedisOptions}
            statusRawat={form.STATUS}
          />
        )}
        {mode === 'visit' && activeIndex === 1 && (
          <TabObat
            form={form}
            setForm={setForm}
            idRawatInap={Cookies.get('IDRAWATINAP')}
            obatInapData={form.obatInap || []}
            tenagaMedisOptions={tenagaMedisOptions}
            statusRawat={form.STATUS}
          />
        )}

        {mode === 'edit' && form.STATUS === "AKTIF" && (
          <div className="text-right pt-3">
            <Button type="submit" label="Simpan" icon="pi pi-save" />
          </div>
        )}
      </form>
    </Dialog>
  );
};

export default FormRawatInap;