'use client';

import React from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';

export default function FormDialogProfile({
  visible, onHide, onSubmit,
  form, setForm, errors, setErrors
}) {

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (form.profile) {
      setPreview(form.profile); 
    }
  }, [form.fotoprofil]);

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Nama wajib diisi';
    if (!form.email.trim()) newErrors.email = 'Email wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  return (
    <Dialog header="Edit Profil"
      visible={visible} onHide={onHide} style={{ width: '30vw' }}
    >

      <div className="space-y-4">
        </div>
        {preview && (
          <div className="flex justify-center">
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border shadow"
            />
          </div>
        )}

        <div>
          <label className="block">Foto Profil</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

      <div className="space-y-4">
        <div>
          <label className="block">Nama Pengguna</label>
          <InputText
            className={errors.username ? 'p-invalid w-full mt-2' : 'w-full mt-2'}
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          {errors.username && <small className="text-red-500">{errors.username}</small>}
        </div>

        <div>
          <label className="block">Email</label>
          <InputText
            type="email"
            className={errors.email ? 'p-invalid w-full mt-2' : 'w-full mt-2'}
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <small className="text-red-500">{errors.email}</small>}
        </div>

        <div className="text-right pt-3">
          <Button label="Simpan" icon="pi pi-save" onClick={handleSubmit} />
        </div>
      </div>
    </Dialog>
  );
}
