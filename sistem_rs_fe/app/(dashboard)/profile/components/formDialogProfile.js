'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { FileUpload } from 'primereact/fileupload'
import { Toast } from 'primereact/toast'
import { ProgressBar } from 'primereact/progressbar'
import { Tag } from 'primereact/tag'

export default function FormDialogProfile({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  errors,
  setErrors
}) {
  const [preview, setPreview] = useState(null)
  const [totalSize, setTotalSize] = useState(0)
  const toast = useRef(null)
  const fileUploadRef = useRef(null)

  useEffect(() => {
    if (form.profile) setPreview(form.profile)
  }, [form.profile])

  const validate = () => {
    const newErrors = {}
    if (!form.username.trim()) newErrors.username = 'Nama wajib diisi'
    if (!form.email.trim()) newErrors.email = 'Email wajib diisi'
    if (!form.nohp?.trim()) newErrors.nohp = 'No telepon wajib diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onTemplateSelect = (e) => {
    const file = e.files[0]
    if (!file) return

    setTotalSize(file.size)
    setForm({ ...form, file })

    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const onTemplateUpload = (e) => {
    const file = e.files[0]
    setTotalSize(file ? file.size : 0)
    toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' })
  }

  const onTemplateClear = () => {
    setTotalSize(0)
    setPreview(null)
    setForm({ ...form, file: null })
  }

  const headerTemplate = (options) => {
    const { className, chooseButton } = options
    const value = totalSize / 50000
    const formattedValue = fileUploadRef.current
      ? fileUploadRef.current.formatSize(totalSize)
      : '0 B'

    return (
      <div className={className} style={{ background: 'transparent', display: 'flex', alignItems: 'center' }}>
        {chooseButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formattedValue} / 5 MB</span>
          <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }} />
        </div>
      </div>
    )
  }

  const itemTemplate = (file, props) => {
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: '40%' }}>
          <img alt={file.name} role="presentation" src={file.objectURL} width={80} className="rounded" />
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
      </div>
    )
  }

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: '5em',
            borderRadius: '50%',
            backgroundColor: 'var(--surface-b)',
            color: 'var(--surface-d)'
          }}
        />
        <span className="my-5" style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }}>
          Tarik file gambar kesini
        </span>
      </div>
    )
  }

  const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' }

  const handleSubmit = () => {
    if (validate()) onSubmit(form)
  }

  return (
    <Dialog header="Edit Profil" visible={visible} onHide={onHide} style={{ width: '30vw' }}>
      <Toast ref={toast} />

      <div className="flex flex-col items-center space-y-4 mb-4">
        <div className="relative">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: '120px', maxHeight: '120px', objectFit: 'cover', borderRadius: '50%' }}
              className="w-24 h-24 rounded-full object-cover border shadow"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-100 border border-gray-300 shadow-inner">
              <i className="pi pi-user text-4xl text-gray-500"></i>
            </div>
          )}
        </div>
      </div>

      <FileUpload
        ref={fileUploadRef}
        name="demo[]"
        accept="image/*"
        maxFileSize={5000000}
        customUpload
        onUpload={onTemplateUpload}
        onSelect={onTemplateSelect}
        onError={onTemplateClear}
        onClear={onTemplateClear}
        headerTemplate={headerTemplate}
        itemTemplate={itemTemplate}
        emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions}
      />

      <div className="space-y-4 mt-5">
        <div>
          <label className="block">Nama Pengguna</label>
          <InputText
            className={errors.username ? 'p-invalid w-full mt-2' : 'w-full mt-2'}
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          {errors.username && <small className="text-red-500">{errors.username}</small>}
        </div>

        <div className="mt-3">
          <label className="block">Email</label>
          <InputText
            type="email"
            className={errors.email ? 'p-invalid w-full mt-2' : 'w-full mt-2'}
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <small className="text-red-500">{errors.email}</small>}
        </div>

        <div className="mt-3">
          <label className="block">No Telepon</label>
          <InputText
            type="nohp"
            className={errors.nohp ? 'p-invalid w-full mt-2' : 'w-full mt-2'}
            value={form.nohp}
            onChange={e => setForm({ ...form, nohp: e.target.value })}
          />
          {errors.nohp && <small className="text-red-500">{errors.nohp}</small>}
        </div>

        <div className="text-right pt-3">
          <Button label="Simpan" icon="pi pi-save" onClick={handleSubmit} />
        </div>
      </div>
    </Dialog>
  )
}
