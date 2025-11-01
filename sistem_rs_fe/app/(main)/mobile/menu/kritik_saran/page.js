"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import TabelKritikSaran from "./components/TabelKritikSaran";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function PageKritikSaran() {
  const [data, setData] = useState([]);
  const [setDialogVisible] = useState(false);
  const [form, setForm] = useState({ IDKRITIKSARAN: 0, NIK: "1234567890", JENIS: "", PESAN: "" });
  const [errors, setErrors] = useState({});
  const toastRef = useRef(null);

  const showToast = (severity, summary, detail) => toastRef.current?.show({ severity, summary, detail, life: 3000 });

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/kritik_saran`);
      setData(res.data.data.sort((a, b) => b.IDKRITIKSARAN - a.IDKRITIKSARAN));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="card">
      <Toast ref={toastRef} />
      <ConfirmDialog />

      <div className="flex justify-between mb-3">
        <h3 className="text-xl font-semibold">Manajemen Kritik & Saran</h3>
      </div>

      <TabelKritikSaran data={data} loading={false} />

    </div>
  );
}
