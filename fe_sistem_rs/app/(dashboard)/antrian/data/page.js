'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import TabelAntrian from './components/tabelAntrian';
import { Toast } from 'primereact/toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Page() {
  const [data, setData] = useState([]);
  const [loketList, setLoketList] = useState([]);
  const [loading, setLoading] = useState(false);
  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
    fetchLoket();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/antrian/data`);
      setData(res.data.data || []);
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

    const ding = new Audio('/sounds/opening.mp3');
    ding.play();

    ding.onended = () => {
      if ('speechSynthesis' in window) {
        const suara = new SpeechSynthesisUtterance();
        suara.lang = 'id-ID';
        suara.text = `Nomor antrian ${panggilan.NO_ANTRIAN.split('').join(' ')}, silakan menuju loket ${panggilan.LOKET}`;
        suara.rate = 0.9;

        console.log('Memanggil suara:', suara.text);
        window.speechSynthesis.cancel(); 
        window.speechSynthesis.speak(suara);
      } else {
        console.warn('Speech Synthesis tidak didukung di browser ini');
      }
    };

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

  return (
    <div className="card">
      <Toast ref={toastRef} />
      <h3 className="text-xl font-semibold mb-4">Data Antrian Pasien</h3>
      <TabelAntrian
        data={data}
        loketList={loketList}
        loading={loading}
        onPanggil={handlePanggil}
      />
    </div>
  );
}

export default Page;