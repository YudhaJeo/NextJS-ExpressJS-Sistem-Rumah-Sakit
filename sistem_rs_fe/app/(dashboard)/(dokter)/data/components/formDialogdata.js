'use client';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const FormDialogData = ({
  visible,
  onHide,
  formData,
  onChange,
  onSubmit,
  dokterOptions,
  poliOptions,
  jadwalOptions,
  allJadwal,
}) => {
  const filteredJadwal = allJadwal
    .filter((j) => j.IDDOKTER === formData.IDDOKTER)
    .map((j) => ({
      label: j.HARI, 
      value: j.IDJADWAL,
    }));
  return (
    <Dialog
      header={formData.IDDATA ? 'Edit Data Dokter' : 'Tambah Data Dokter'}
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
          <label>Nama Dokter</label>
          <Dropdown
            className="w-full mt-1"
            options={dokterOptions}
            value={formData.IDDOKTER}
            onChange={(e) => onChange({ ...formData, IDDOKTER: e.value, IDJADWAL: "", })}
            placeholder="Pilih Dokter"
          />
        </div>

        <div>
          <label>Poli</label>
          <Dropdown
            className="w-full mt-1"
            options={poliOptions}
            value={formData.IDPOLI}
            onChange={(e) => onChange({ ...formData, IDPOLI: e.value })}
            placeholder="Pilih Poli"
          />
        </div>

        <div>
          <label>Jadwal Praktek</label>
          <Dropdown
            className="w-full mt-1"
            options={filteredJadwal}
            value={formData.IDJADWAL}
            onChange={(e) => onChange({ ...formData, IDJADWAL: e.value })}
            placeholder={
              formData.IDDOKTER ? "Pilih Jadwal Dokter" : "Pilih Dokter Terlebih Dahulu"
            }
            disabled={!formData.IDDOKTER}
          />
        </div>

        <div>
          <label>No. Telepon</label>
          <InputText
            className="w-full mt-1"
            value={formData.NO_TELEPON}
            onChange={(e) => onChange({ ...formData, NO_TELEPON: e.target.value })}
            placeholder="Contoh: 08123456789"
          />
        </div>

        <div>
          <label>Email</label>
          <InputText
            className="w-full mt-1"
            value={formData.EMAIL}
            onChange={(e) => onChange({ ...formData, EMAIL: e.target.value })}
            placeholder="Contoh: email@dokter.com"
          />
        </div>

        <div>
          <label>Alamat</label>
          <InputText
            className="w-full mt-1"
            value={formData.ALAMAT}
            onChange={(e) => onChange({ ...formData, ALAMAT: e.target.value })}
            placeholder="Alamat Lengkap"
          />
        </div>

        <div>
          <label>Jenis Kelamin</label>
          <Dropdown
            className="w-full mt-1"
            value={formData.JENIS_KELAMIN}
            options={[
              { label: 'Laki-laki', value: 'Laki-Laki' },
              { label: 'Perempuan', value: 'Perempuan' },
            ]}
            onChange={(e) => onChange({ ...formData, JENIS_KELAMIN: e.value })}
            placeholder="Pilih Jenis Kelamin"
          />
        </div>

        <div className="text-right pt-2">
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogData;
