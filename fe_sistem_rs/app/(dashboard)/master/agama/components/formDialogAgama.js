// app/(dashboard)/master/agama/components/formDialogAgama.js
'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React from 'react';

const FormDialogAgama = ({ visible, onHide, onSubmit, form, setForm, errors }) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={form.IDAGAMA ? 'Edit Agama' : 'Tambah Agama'}
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
        <div>
          <label>Nama Agama</label>
          <InputText
            className={inputClass('AGAMA')}
            value={form.AGAMA}
            onChange={(e) => setForm({ ...form, AGAMA: e.target.value })}
          />
          {errors.AGAMA && <small className="text-red-500">{errors.AGAMA}</small>}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogAgama;
