'use client';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const FormDialogRole = ({ visible, formData, onHide, onChange, onSubmit, errors }) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={formData.IDROLE ? 'Edit Role' : 'Tambah Role'}
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
        <div className ="mt-2">
          <label>Nama Role</label>
          <InputText
            className={inputClass('NAMAROLE')}
            value={formData.NAMAROLE || ''}
            onChange={(e) => onChange({ ...formData, NAMAROLE: e.target.value })}
          />
          {errors.NAMAROLE && (
            <small className="text-red-500">{errors.NAMAROLE}</small>
          )}
        </div>

        <div className ="mt-2">
          <label>Jenis Role</label>
          <Dropdown
            className={inputClass('JENISROLE')}
            value={formData.JENISROLE || ''}
            options={[
              { label: 'Tenaga Medis', value: 'Tenaga Medis' },
              { label: 'Non Medis', value: 'Non Medis' },
            ]}
            onChange={(e) => onChange({ ...formData, JENISROLE: e.value })}
            placeholder="Pilih Jenis Role"
          />
          {errors.JENISROLE && (
            <small className="text-red-500">{errors.JENISROLE}</small>
          )}
        </div>

        <div className ="mt-2">
          <label>Keterangan</label>
          <InputText
            className={inputClass('KETERANGAN')}
            value={formData.KETERANGAN || ''}
            onChange={(e) => onChange({ ...formData, KETERANGAN: e.target.value })}
          />
          {errors.KETERANGAN && (
            <small className="text-red-500">{errors.KETERANGAN}</small>
          )}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogRole;