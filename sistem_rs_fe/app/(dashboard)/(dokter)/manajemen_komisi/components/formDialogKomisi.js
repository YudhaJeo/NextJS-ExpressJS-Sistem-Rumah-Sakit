'use client';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

const statusOptions = [
  { label: 'Belum Dibayar', value: 'Belum Dibayar' },
  { label: 'Sudah Dibayar', value: 'Sudah Dibayar' },
];

const formatTanggal = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
};

const FormDialogKomisi = ({
  visible,
  formData,
  onHide,
  onChange,
  onSubmit,
  onDelete,
  riwayatOptions,
  allRiwayatOptions,
}) => {

  return (
    <Dialog
      header={formData.IDKOMISI ? 'Edit Komisi' : 'Tambah Komisi'}
      visible={visible}
      onHide={onHide}
      style={{ width: '45vw' }}
    >
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {/* Pilih Riwayat Pengobatan */}
        <div>
          <label>Riwayat Pengobatan</label>
          <Dropdown
            className="w-full mt-1"
            options={riwayatOptions}
            value={formData.IDPENGOBATAN}
            onChange={(e) => {
              const selected = allRiwayatOptions.find((opt) => opt.value === e.value);
              onChange({
              ...formData,
              IDPENGOBATAN: e.value,
              NIK: selected ? selected.NIK : formData.NIK,
              NAMAPASIEN: selected ? selected.NAMAPASIEN : formData.NAMAPASIEN,
              NAMADOKTER: selected ? selected.NAMADOKTER : formData.NAMADOKTER,
              TANGGAL: selected ? selected.TANGGAL : formData.TANGGAL,
            });

            }}
            placeholder="Pilih Dokter / Pasien / Tanggal"
            filter
            showClear
          />
        </div>

        {/* Info Tambahan Otomatis */}
        <div className="grid-cols-2 gap-3 text-sm text-gray-700">
          <div>
            <label>NIK</label>
            <InputText value={formData.NIK || ''} disabled className="w-full" />
          </div>
          <div>
            <label>Nama Pasien</label>
            <InputText value={formData.NAMAPASIEN || ''} disabled className="w-full" />
          </div>
          <div>
            <label>Nama Dokter</label>
            <InputText value={formData.NAMADOKTER || ''} disabled className="w-full" />
          </div>
          <div>
            <label>Tanggal</label>
            <InputText
              value={formatTanggal(formData.TANGGAL)}
              disabled
              className="w-full"
            />
          </div>
        </div>

        {/* Nilai Komisi */}
        <div>
          <label>Nilai Komisi</label>
          <InputNumber
            className="w-full"
            value={formData.NILAIKOMISI}
            onValueChange={(e) =>
              onChange({ ...formData, NILAIKOMISI: e.value })
            }
            mode="currency"
            currency="IDR"
            locale="id-ID"
          />
        </div>

        {/* Status */}
        <div>
          <label>Status</label>
          <Dropdown
            className="w-full mt-1"
            options={statusOptions}
            value={formData.STATUS}
            onChange={(e) => onChange({ ...formData, STATUS: e.value })}
            placeholder="Pilih Status"
          />
        </div>

        {/* Keterangan */}
        <div>
          <label>Keterangan</label>
          <InputText
            value={formData.KETERANGAN || ''}
            placeholder="Tulis keterangan tambahan"
            className="w-full"
            onChange={(e) =>
              onChange({ ...formData, KETERANGAN: e.target.value })
            }
          />
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-between pt-2">
          {formData.IDKOMISI > 0 && (
            <Button
              type="button"
              label="Hapus"
              icon="pi pi-trash"
              className="p-button-danger"
              onClick={() => onDelete(formData)}
            />
          )}
          <Button type="submit" label="Simpan" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogKomisi;
