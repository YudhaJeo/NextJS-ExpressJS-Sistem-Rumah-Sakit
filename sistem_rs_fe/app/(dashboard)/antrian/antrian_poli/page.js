'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import TabelAntrianPoli from './components/tabelAntrianPoli';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || API_URL.replace(/^http/, 'ws');

function DataAntrianPoli() {
  const [data, setData] = useState([]);
  const [poliList, setPoliList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [selectedZona, setSelectedZona] = useState(null);

  const toastRef = useRef(null);
  const socketRef = useRef(null);
  const reconnectRef = useRef(null);

  useEffect(() => {
    fetchData();
    fetchPoli();

    const savedId = localStorage.getItem('currentAntrianPoliId');
    if (savedId) setCurrentId(parseInt(savedId));

    function connectSocket() {
      socketRef.current = new WebSocket(`${WS_URL}`);

      socketRef.current.onopen = () => {
        console.log('🔌 WebSocket Poli tersambung');
      };

      socketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'update') {
          fetchData();
        }
      };

      socketRef.current.onerror = (err) => {
        console.error('❌ WebSocket Poli error:', err);
      };

      socketRef.current.onclose = () => {
        console.warn('❌ WebSocket Poli ditutup');
        reconnectRef.current = setTimeout(connectSocket, 1000);
      };
    }

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.close();
      }
      clearTimeout(reconnectRef.current);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/antrian_poli/data`);
      setData(res.data.data || []);
    } catch (err) {
      console.error('Gagal fetch antrian poli:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPoli = async () => {
    try {
      const res = await axios.get(`${API_URL}/poli`);
      setPoliList(res.data || []);
    } catch (err) {
      console.error('Gagal fetch poli:', err);
    }
  };

  const handlePanggil = async (id) => {
    try {
      const panggilan = data.find((item) => item.ID === id);
      if (!panggilan) return;

      await axios.post(`${API_URL}/antrian_poli/panggil/${id}`);

      toastRef.current.show({
        severity: 'success',
        summary: 'Berhasil',
        detail: `Antrian ${panggilan.NO_ANTRIAN} dipanggil`,
      });

      setCurrentId(id);
      localStorage.setItem('currentAntrianPoliId', id);
      localStorage.setItem(
        'lastPanggilan',
        JSON.stringify({ no: panggilan.NO_ANTRIAN, poli: panggilan.POLI })
      );

      fetchData();
    } catch (err) {
      console.error('Gagal memanggil antrian poli:', err);
      toastRef.current.show({
        severity: 'error',
        summary: 'Gagal',
        detail: 'Gagal memanggil antrian poli',
      });
    }
  };

  const handleReset = async (poliName) => {
    try {
      await axios.post(`${API_URL}/antrian_poli/reset`, { poli: poliName });
      toastRef.current.show({
        severity: 'info',
        summary: 'Reset berhasil',
        detail: `Antrian poli ${poliName} telah direset.`,
      });
      fetchData();
    } catch (err) {
      console.error('Gagal reset antrian poli:', err);
    }
  };

  return (
    <div className="card">
      <Toast ref={toastRef} />
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        <h3 className="text-xl font-semibold">Data Antrian Poli</h3>
      </div>
      <TabelAntrianPoli
        data={data}
        poliList={poliList}
        loading={loading}
        onPanggil={handlePanggil}
        onReset={handleReset}
        currentId={currentId}
        fetchData={fetchData}
        selectedZona={selectedZona}
        setSelectedZona={setSelectedZona}
      />
    </div>
  );
}

export default DataAntrianPoli;