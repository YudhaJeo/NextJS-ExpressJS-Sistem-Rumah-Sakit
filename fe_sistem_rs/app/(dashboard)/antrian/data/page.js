'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import TabelAntrian from './components/tabelAntrian';
import { Toast } from 'primereact/toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function DataAntrian() {
  const [data, setData] = useState([]);
  const [loketList, setLoketList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
    fetchLoket();

    const savedId = localStorage.getItem('currentAntrianId');
    if (savedId) setCurrentId(parseInt(savedId));

    const socket = new WebSocket(`${API_URL}/api/ws`);

    socket.onopen = () => {
      console.log("WebSocket tersambung");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'update') {
        console.log("Menerima update dari server");
        fetchData();
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.warn("WebSocket terputus");
    };

    return () => socket.close();
  }, []);

  const checkUpdate = async () => {
    try {
      const res = await axios.get(`${API_URL}/antrian/data`);
      const newData = res.data.data || [];

      if (newData.length !== data.length || JSON.stringify(newData) !== JSON.stringify(data)) {
        setData(newData);
      }
    } catch (err) {
      console.error('Gagal polling data antrian:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/antrian/data`);
      const list = res.data.data || [];
      setData(list);
    } catch (err) {
      console.error('Gagal fetch antrian:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLoket = async () => {
    try {
      const res = await axios.get(`${API_URL}/loket`);
      setLoketList(res.data.data || []);
    } catch (err) {
      console.error('Gagal fetch loket:', err);
    }
  };

  const handlePanggil = async (id) => {
    try {
      const panggilan = data.find((item) => item.ID === id);
      if (!panggilan) return;

      await axios.post(`${API_URL}/antrian/panggil/${id}`);

      toastRef.current.show({
        severity: 'success',
        summary: 'Berhasil',
        detail: `Antrian ${panggilan.NO_ANTRIAN} dipanggil`,
      });

      setCurrentId(panggilan.ID);
      localStorage.setItem('currentAntrianId', panggilan.ID);

      localStorage.setItem('lastPanggilan', JSON.stringify({
        no: panggilan.NO_ANTRIAN,
        loket: panggilan.LOKET,
      }));

      fetchData();
    } catch (err) {
      console.error('Gagal memanggil:', err);
      toastRef.current.show({
        severity: 'error',
        summary: 'Gagal',
        detail: 'Gagal memanggil antrian',
      });
    }
  };

  const handleReset = async (loketName) => {
    try {
      await axios.post(`${API_URL}/antrian/reset`, { loket: loketName });

      toastRef.current.show({
        severity: 'info',
        summary: 'Reset berhasil',
        detail: `Antrian di loket ${loketName} telah direset.`,
      });

      fetchData();
    } catch (err) {
      console.error('Gagal reset antrian:', err);
      toastRef.current.show({
        severity: 'error',
        summary: 'Gagal',
        detail: 'Reset antrian gagal',
      });
    }
  };

  return (
    <div className="card">
      <Toast ref={toastRef} />
      <h3 className="text-xl font-semibold mb-4">Data Antrian Pasien</h3>
      <TabelAntrian
        data={data}
        loketList={loketList}
        loading={loading}
        onPanggil={handlePanggil}
        onReset={handleReset}
        currentId={currentId}
        fetchData={fetchData}
      />
    </div>
  );
}

export default DataAntrian;