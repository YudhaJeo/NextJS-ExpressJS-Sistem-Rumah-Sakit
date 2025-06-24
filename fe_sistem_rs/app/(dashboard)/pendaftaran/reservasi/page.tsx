"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

interface Reservasi {
  id?: number;
  waktu_konsul: string;
  slot: string;
  pasien: string;
  poli: string;
  dokter: string;
  status: string;
}

const ReservasiPasien = () => {
  const [reservasiList, setReservasiList] = useState<Reservasi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [formData, setFormData] = useState<Reservasi>({
    waktu_konsul: "",
    slot: "",
    pasien: "",
    poli: "",
    dokter: "",
    status: "Reservasi",
  });

  const fetchReservasi = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/reservasi");
      setReservasiList(res.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const isEdit = !!formData.id;
    const url = isEdit
      ? `http://localhost:4000/api/reservasi/${formData.id}`
      : "http://localhost:4000/api/reservasi";

    try {
      if (isEdit) {
        await axios.put(url, formData);
      } else {
        await axios.post(url, formData);
      }
      fetchReservasi();
      setDialogVisible(false);
      resetForm();
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      waktu_konsul: "",
      slot: "",
      pasien: "",
      poli: "",
      dokter: "",
      status: "Reservasi",
    });
  };

  const handleEdit = (row: Reservasi) => {
    setFormData(row);
    setDialogVisible(true);
  };

  const handleDelete = async (row: Reservasi) => {
    try {
      await axios.delete(`http://localhost:4000/api/reservasi/${row.id}`);
      fetchReservasi();
    } catch (err) {
      console.error("Gagal menghapus data:", err);
    }
  };

  useEffect(() => {
    fetchReservasi();
  }, []);

  return (
    <div className="card">
      <h3 className="text-xl font-semibold">Reservasi Pasien</h3>

      <div className="flex justify-content-end my-3">
        <Button
          label="Tambah Reservasi"
          icon="pi pi-plus"
          onClick={() => setDialogVisible(true)}
        />
      </div>

      <DataTable
        value={reservasiList}
        paginator
        rows={10}
        loading={isLoading}
        scrollable
        size="small"
      >
        <Column field="waktu_konsul" header="Waktu Konsul" />
        <Column field="slot" header="Slot" />
        <Column field="pasien" header="Pasien" />
        <Column field="poli" header="Poli" />
        <Column field="dokter" header="Dokter" />
        <Column field="status" header="Status" />
        <Column
          header="Aksi"
          body={(row: Reservasi) => (
            <div className="flex gap-2">
              <Button
                icon="pi pi-pencil"
                size="small"
                severity="warning"
                onClick={() => handleEdit(row)}
              />
              <Button
                icon="pi pi-trash"
                size="small"
                severity="danger"
                onClick={() => handleDelete(row)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        header={formData.id ? "Edit Reservasi" : "Tambah Reservasi"}
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          resetForm();
        }}
        style={{ width: "40vw" }}
      >
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            <label>Waktu Konsul</label>
            <InputText
              className="w-full mt-2"
              value={formData.waktu_konsul}
              onChange={(e) =>
                setFormData({ ...formData, waktu_konsul: e.target.value })
              }
            />
          </div>
          <div>
            <label>Slot</label>
            <InputText
              className="w-full mt-2"
              value={formData.slot}
              onChange={(e) =>
                setFormData({ ...formData, slot: e.target.value })
              }
            />
          </div>
          <div>
            <label>Pasien</label>
            <InputText
              className="w-full mt-2"
              value={formData.pasien}
              onChange={(e) =>
                setFormData({ ...formData, pasien: e.target.value })
              }
            />
          </div>
          <div>
            <label>Poli</label>
            <InputText
              className="w-full mt-2"
              value={formData.poli}
              onChange={(e) =>
                setFormData({ ...formData, poli: e.target.value })
              }
            />
          </div>
          <div>
            <label>Dokter</label>
            <InputText
              className="w-full mt-2"
              value={formData.dokter}
              onChange={(e) =>
                setFormData({ ...formData, dokter: e.target.value })
              }
            />
          </div>
          <div>
            <label>Status</label>
            <InputText
              className="w-full mt-2"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            />
          </div>

          <div className="text-right pt-3">
            <Button type="submit" label="Simpan" icon="pi pi-save" />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default ReservasiPasien;
