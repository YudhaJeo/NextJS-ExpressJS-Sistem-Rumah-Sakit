'use client';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const FormDialogPendaftaran = ({
  visible,
  onHide,
  onSubmit,
  form,
  setForm,
  pasienOptions,
}) => {
  return (
    <Dialog
      header={form.IDPENDAFTARAN ? 'Edit Pendaftaran' : 'Tambah Pendaftaran'}
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
          <label>NIK</label>
          <Dropdown
            className="w-full mt-2"
            options={pasienOptions}
            value={form.NIK}
            onChange={(e) => {
              const selected = pasienOptions.find((p) => p.value === e.value);
              setForm({
                ...form,
                NIK: e.value,
                NAMALENGKAP: selected?.NAMALENGKAP || '',
              });
            }}
            placeholder="Pilih NIK"
            filter
            showClear
          />
        </div>

        <div>
          <label>Tanggal Kunjungan</label>
          <Calendar
            className="w-full mt-2"
            dateFormat="yy-mm-dd"
            value={form.TANGGALKUNJUNGAN ? new Date(form.TANGGALKUNJUNGAN) : undefined}
            onChange={(e) =>
              setForm({
                ...form,
                TANGGALKUNJUNGAN: e.value?.toISOString().split('T')[0] || '',
              })
            }
            showIcon
          />
        </div>

        <div>
          <label>Layanan</label>
          <Dropdown
            className="w-full mt-2"
            options={['Rawat Jalan', 'Rawat Inap', 'IGD'].map((val) => ({
              label: val,
              value: val,
            }))}
            value={form.LAYANAN}
            onChange={(e) => setForm({ ...form, LAYANAN: e.value })}
            placeholder="Pilih Layanan"
          />
        </div>

        <div>
          <label>Poli</label>
          <InputText
            className="w-full mt-2"
            value={form.POLI}
            onChange={(e) => setForm({ ...form, POLI: e.target.value })}
          />
        </div>

        <div>
          <label>Nama Dokter</label>
          <InputText
            className="w-full mt-2"
            value={form.NAMADOKTER}
            onChange={(e) => setForm({ ...form, NAMADOKTER: e.target.value })}
          />
        </div>

        <div>
          <label>Status Kunjungan</label>
          <Dropdown
            className="w-full mt-2"
            options={['Diperiksa', 'Batal', 'Selesai'].map((val) => ({
              label: val,
              value: val,
            }))}
            value={form.STATUSKUNJUNGAN}
            onChange={(e) => setForm({ ...form, STATUSKUNJUNGAN: e.value })}
            placeholder="Pilih Status"
          />
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogPendaftaran;
