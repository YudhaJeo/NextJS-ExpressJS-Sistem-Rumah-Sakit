'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Toast } from 'primereact/toast';
import { io } from 'socket.io-client'; 
import TabelAntrianPoli from './components/tabelAntrianPoli';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

function DataAntrianPoli() {
  const [data, setData] = useState([]);
  const [poliList, setPoliList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [selectedZona, setSelectedZona] = useState(null);
  const [unitKerja, setUnitKerja] = useState(null);

  const toastRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const poliUser = Cookies.get('unitKerja'); 
    setUnitKerja(poliUser || null);
  }, []);

  useEffect(() => {
    if (unitKerja !== null) {
    fetchData();
    fetchPoli();

    const savedId = localStorage.getItem('currentAntrianPoliId');
    if (savedId) setCurrentId(parseInt(savedId));

    // Ganti WebSocket → Socket.IO
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 Socket.IO tersambung:', socket.id);
    });

    socket.on('antrian-update', () => {
      console.log('📥 Update antrian diterima');
      fetchData();
    });

    socket.on('disconnect', () => {
      console.warn('❌ Socket.IO terputus');
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
    }
  }, [unitKerja]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/antrian_poli/data`);
      let allData = res.data.data || [];

      if (unitKerja) {
        allData = allData.filter((item) => item.POLI === unitKerja);
      }

      setData(allData);
    } catch (err) {
      console.error('Gagal fetch antrian poli:', err);
    } finally {
      setLoading(false);
    }
  };


const fetchPoli = async () => {
  try {
    const res = await axios.get(`${API_URL}/poli`);
    let list = res.data || [];

    if (unitKerja) {
      list = list.filter((p) => p.NAMAPOLI === unitKerja);
    }

    setPoliList(list);
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