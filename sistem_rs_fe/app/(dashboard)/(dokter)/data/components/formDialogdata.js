'use client';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

const jenisKelaminOptions = [
  { label: 'Laki-laki', value: 'Laki-laki' },
  { label: 'Perempuan', value: 'Perempuan' },
];

const FormDialogData = ({ visible, formData, onHide, onChange, onSubmit, poliOptions }) => {
  return (
    <Dialog header={formData.IDDOKTER ? 'Edit Dokter' : 'Tambah Dokter'} visible={visible} onHide={onHide} style={{ width: '40vw' }}>
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <div>
          <label>Nama Dokter</label>
          <InputText className="w-full mt-1" value={formData.NAMA_DOKTER} onChange={(e) => onChange({ ...formData, NAMA_DOKTER: e.target.value })} />
        </div>

        <div>
          <label>ID Poli</label>
          <Dropdown className="w-full mt-1" options={poliOptions} value={formData.IDPOLI} onChange={(e) => onChange({ ...formData, IDPOLI: e.value })} placeholder="Pilih Poli" />
        </div>

        <div>
          <label>Jadwal Praktek</label>
          <InputText className="w-full mt-1" value={formData.JADWALPRAKTEK} onChange={(e) => onChange({ ...formData, JADWALPRAKTEK: e.target.value })} />
        </div>

        <div>
          <label>No Telepon</label>
          <InputText className="w-full mt-1" value={formData.NO_TELEPON} onChange={(e) => onChange({ ...formData, NO_TELEPON: e.target.value })} />
        </div>

        <div>
          <label>Email</label>
          <InputText className="w-full mt-1" value={formData.EMAIL} onChange={(e) => onChange({ ...formData, EMAIL: e.target.value })} />
        </div>

        <div>
          <label>Alamat</label>
          <InputText className="w-full mt-1" value={formData.ALAMAT} onChange={(e) => onChange({ ...formData, ALAMAT: e.target.value })} />
        </div>

        <div>
          <label>Jenis Kelamin</label>
          <Dropdown className="w-full mt-1" options={jenisKelaminOptions} value={formData.JENIS_KELAMIN} onChange={(e) => onChange({ ...formData, JENIS_KELAMIN: e.value })} placeholder="Pilih Jenis Kelamin" />
        </div>

        <div className="text-right pt-2">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogData;
