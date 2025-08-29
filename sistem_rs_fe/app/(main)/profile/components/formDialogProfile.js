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
    if (form.FOTOPROFIL) setPreview(form.FOTOPROFIL)
  }, [form.FOTOPROFIL])

  const validate = () => {
    const newErrors = {}
    if (!form.NAMALENGKAP.trim()) newErrors.NAMALENGKAP = 'Nama wajib diisi'
    if (!form.EMAIL.trim()) newErrors.EMAIL = 'Email wajib diisi'
    if (!form.NOHP?.trim()) newErrors.NOHP = 'No telepon wajib diisi'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onTemplateSelect = (e) => {
    const file = e.files[0]
    if (!file) return

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      toast.current.show({ severity: 'error', summary: 'Format tidak didukung', detail: 'Hanya PNG atau JPG' })
      return
    }

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
    const { className, chooseButton, cancelButton } = options
    const value = totalSize / 50000
    const formattedValue = fileUploadRef.current
      ? fileUploadRef.current.formatSize(totalSize)
      : '0 B'

    return (
      <div className={className} style={{ background: 'transparent', display: 'flex', alignItems: 'center' }}>
        {chooseButton}
        {cancelButton}
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
        accept=".png, .jpg, .jpeg"
        maxFileSize={2000000}
        customUpload
        onUpload={onTemplateUpload}
        onSelect={onTemplateSelect}
        onError={onTemplateClear}
        onClear={onTemplateClear}
        headerTemplate={headerTemplate}
        itemTemplate={itemTemplate}
        emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions}
        cancelOptions={{
          icon: 'pi pi-fw pi-times',
          iconOnly: true,
          className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'
        }}
      />

      <div className="space-y-4 mt-5">
        <div>
          <label className="block">Nama Pengguna</label>
          <InputText
            className={errors.NAMALENGKAP ? 'p-invalid w-full mt-2' : 'w-full mt-2'}
            value={form.NAMALENGKAP}
            onChange={e => setForm({ ...form, NAMALENGKAP: e.target.value })}
          />
          {errors.NAMALENGKAP && <small className="text-red-500">{errors.NAMALENGKAP}</small>}
        </div>

        <div className="mt-3">
          <label className="block">Email</label>
          <InputText
            type="EMAIL"
            className={errors.EMAIL ? 'p-invalid w-full mt-2' : 'w-full mt-2'}
            value={form.EMAIL}
            onChange={e => setForm({ ...form, EMAIL: e.target.value })}
          />
          {errors.EMAIL && <small className="text-red-500">{errors.EMAIL}</small>}
        </div>

        <div className="mt-3">
          <label className="block">No Telepon</label>
          <InputText
            type="NOHP"
            className={errors.NOHP ? 'p-invalid w-full mt-2' : 'w-full mt-2'}
            value={form.NOHP}
            onChange={e => setForm({ ...form, NOHP: e.target.value })}
          />
          {errors.NOHP && <small className="text-red-500">{errors.NOHP}</small>}
        </div>

        <div className="text-right pt-3">
          <Button label="Simpan" icon="pi pi-save" onClick={handleSubmit} />
        </div>
      </div>
    </Dialog>
  )
}
