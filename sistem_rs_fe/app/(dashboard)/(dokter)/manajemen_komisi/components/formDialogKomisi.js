'use client';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';

const statusOptions = [
  { label: 'Belum Dibayar', value: 'Belum Dibayar' },
  { label: 'Sudah Dibayar', value: 'Sudah Dibayar' },
];

const FormDialogKomisi = ({
  visible,
  formData,
  onHide,
  onChange,
  onSubmit,
  onDelete,
  dokterOptions,
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
        {/* Dokter */}
        <div>
          <label>Nama Dokter</label>
          <Dropdown
            className="w-full mt-1"
            options={dokterOptions}
            value={formData.IDDOKTER}
            onChange={(e) => onChange({ ...formData, IDDOKTER: e.value })}
            placeholder="Pilih Dokter"
          />
        </div>

        {/* Tanggal Layanan */}
        <div>
          <label>Tanggal Layanan</label>
          <Calendar
            value={formData.TANGGAL_LAYANAN ? new Date(formData.TANGGAL_LAYANAN) : null}
            onChange={(e) =>
              onChange({
                ...formData,
                TANGGAL_LAYANAN: e.value.toISOString(),
              })
            }
            dateFormat="yy-mm-dd"
            showIcon
            className="w-full"
          />
        </div>

        {/* Nama Layanan */}
        <div>
          <label>Nama Layanan</label>
          <InputText
            className="w-full"
            value={formData.NAMA_LAYANAN}
            onChange={(e) => onChange({ ...formData, NAMA_LAYANAN: e.target.value })}
            placeholder="Tulis nama layanan"
          />
        </div>

        {/* Biaya Layanan */}
        <div>
          <label>Biaya Layanan</label>
          <InputNumber
            className="w-full"
            value={formData.BIAYA_LAYANAN}
            onValueChange={(e) => onChange({ ...formData, BIAYA_LAYANAN: e.value })}
            mode="currency"
            currency="IDR"
            locale="id-ID"
          />
        </div>

        {/* Persentase Komisi */}
        <div>
          <label>Persentase Komisi (%)</label>
          <InputNumber
            className="w-full"
            value={formData.PERSENTASE_KOMISI}
            onValueChange={(e) =>
              onChange({ ...formData, PERSENTASE_KOMISI: e.value })
            }
            suffix="%"
            min={0}
            max={100}
            maxFractionDigits={2}
          />
        </div>

        {/* Nilai Komisi */}
        <div>
          <label>Nilai Komisi</label>
          <InputNumber
            className="w-full"
            value={formData.NILAI_KOMISI}
            onValueChange={(e) =>
              onChange({ ...formData, NILAI_KOMISI: e.value })
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

        {/* Tanggal Pembayaran */}
        <div>
          <label>Tanggal Pembayaran</label>
          <Calendar
            value={
              formData.TANGGAL_PEMBAYARAN
                ? new Date(formData.TANGGAL_PEMBAYARAN)
                : null
            }
            onChange={(e) =>
              onChange({
                ...formData,
                TANGGAL_PEMBAYARAN: e.value?.toISOString() || null,
              })
            }
            dateFormat="yy-mm-dd"
            showIcon
            className="w-full"
          />
        </div>

        {/* Keterangan */}
        <div>
          <label>Keterangan</label>
          <InputText
            value={formData.KETERANGAN}
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
