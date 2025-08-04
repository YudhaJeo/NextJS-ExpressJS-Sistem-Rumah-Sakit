'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';

const FormDialogPasien = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  errors,
  agamaOptions,
  asuransiOptions
}) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={form.IDPASIEN ? 'Edit Pasien' : 'Tambah Pasien'}
      visible={visible}
      onHide={onHide}
      style={{ width: '40vw' }}
    >
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div>
          <label>Nama Lengkap</label>
          <InputText
            className={inputClass('NAMALENGKAP')}
            value={form.NAMALENGKAP}
            onChange={(e) => setForm({ ...form, NAMALENGKAP: e.target.value })}
          />
          {errors.NAMALENGKAP && <small className="text-red-500">{errors.NAMALENGKAP}</small>}
        </div>

        <div>
          <label>NIK</label>
          <InputText
            className={inputClass('NIK')}
            maxLength={16}
            value={form.NIK}
            onChange={(e) => setForm({ ...form, NIK: e.target.value })}
          />
          {errors.NIK && <small className="text-red-500">{errors.NIK}</small>}
        </div>

        <div>
          <label>Tanggal Lahir</label>
          <Calendar
            className={inputClass('TANGGALLAHIR')}
            dateFormat="yy-mm-dd"
            value={form.TANGGALLAHIR ? new Date(form.TANGGALLAHIR) : undefined}
            onChange={(e) =>
              setForm({
                ...form,
                TANGGALLAHIR: e.value?.toISOString().split('T')[0] || '',
              })
            }
            showIcon
          />
          {errors.TANGGALLAHIR && <small className="text-red-500">{errors.TANGGALLAHIR}</small>}
        </div>

        <div>
          <label>Jenis Kelamin</label>
          <Dropdown
            className={inputClass('JENISKELAMIN')}
            options={[
              { label: 'Laki-laki', value: 'L' },
              { label: 'Perempuan', value: 'P' },
            ]}
            value={form.JENISKELAMIN}
            onChange={(e) => setForm({ ...form, JENISKELAMIN: e.value })}
            placeholder="Pilih"
          />
          {errors.JENISKELAMIN && <small className="text-red-500">{errors.JENISKELAMIN}</small>}
        </div>

        <div>
          <label>Alamat</label>
          <InputText
            className={inputClass('ALAMAT')}
            value={form.ALAMAT}
            onChange={(e) => setForm({ ...form, ALAMAT: e.target.value })}
          />
          {errors.ALAMAT && <small className="text-red-500">{errors.ALAMAT}</small>}
        </div>

        <div>
          <label>No HP</label>
          <InputText
            className={inputClass('NOHP')}
            value={form.NOHP}
            maxLength={13}
            onChange={(e) => setForm({ ...form, NOHP: e.target.value })}
          />
          {errors.NOHP && <small className="text-red-500">{errors.NOHP}</small>}
        </div>

        <div>
          <label>Agama</label>
          <Dropdown
            className={inputClass('IDAGAMA')}
            options={agamaOptions}
            value={form.IDAGAMA}
            onChange={(e) => setForm({ ...form, IDAGAMA: e.value })}
            placeholder="Pilih"
          >
          </Dropdown>
          {errors.IDAGAMA && <small className="text-red-500">{errors.IDAGAMA}</small>}
        </div>

        <div>
          <label>Golongan Darah</label>
          <Dropdown
            className={inputClass('GOLDARAH')}
            options={[
              { label: 'A', value: 'A' },
              { label: 'B', value: 'B' },
              { label: 'AB', value: 'AB' },
              { label: 'O', value: 'O' },
            ]}
            value={form.GOLDARAH}
            onChange={(e) => setForm({ ...form, GOLDARAH: e.value })}
            placeholder="Pilih"
          />
          {errors.GOLDARAH && <small className="text-red-500">{errors.GOLDARAH}</small>}
        </div>

        <div>
          <label>Asuransi</label>
          <Dropdown
            className={inputClass('IDASURANSI')}
            options={asuransiOptions}
            value={form.IDASURANSI}
            onChange={(e) => setForm({ ...form, IDASURANSI: e.value })}
            placeholder="Pilih"
          />
          {errors.IDASURANSI && <small className="text-red-500">{errors.IDASURANSI}</small>}
        </div>

        <div>
          <label>No Asuransi</label>
          <InputText
            className="w-full mt-2"
            value={form.NOASURANSI}
            onChange={(e) => setForm({ ...form, NOASURANSI: e.target.value })}
          />
          {errors.NOASURANSI && <small className="text-red-500">{errors.NOASURANSI}</small>}
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogPasien;