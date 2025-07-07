
// app/(dashboard)/profile/components/FormDialogProfile.js
'use client';

import React from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const FormDialogProfile = ({ visible, onHide, onSubmit, form, setForm, errors, setErrors }) => {
  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Nama wajib diisi';
    if (!form.email.trim()) newErrors.email = 'Email wajib diisi';
    if (!form.role.trim()) newErrors.role = 'Role wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  const inputClass = (field) => errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog header="Edit Profil" visible={visible} onHide={onHide} style={{ width: '30vw' }}>
      <div className="space-y-4">
        <div>
          <label className="block">Nama Pengguna</label>
          <InputText
            className={inputClass('username')}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          {errors.username && <small className="text-red-500">{errors.username}</small>}
        </div>
        <div>
          <label className="block">Email</label>
          <InputText
            type="email"
            className={inputClass('email')}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <small className="text-red-500">{errors.email}</small>}
        </div>
        <div>
          <label className="block">Role</label>
          <InputText
            className={inputClass('role')}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          {errors.role && <small className="text-red-500">{errors.role}</small>}
        </div>
        <div className="text-right pt-3">
          <Button label="Simpan" icon="pi pi-save" onClick={handleSubmit} />
        </div>
      </div>
    </Dialog>
  );
};

export default FormDialogProfile;
