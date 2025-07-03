'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || API_URL.replace('http', 'ws');

function MonitorAntrian() {
  const [loketList, setLoketList] = useState([]);
  const [antrianList, setAntrianList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [lastNoDipanggil, setLastNoDipanggil] = useState('');
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const toast = useRef(null);
  const ws = useRef(null);
  const audioRef = useRef(null); 

  useEffect(() => {
    fetchData(true);

    const connectWebSocket = () => {
      const wsUrl = `${WS_URL}`;
      console.log('Mencoba menyambung ke WebSocket:', wsUrl);
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('WebSocket tersambung');
        showToast('success', 'Koneksi WebSocket berhasil');
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Pesan WebSocket diterima:', message);
          if (message.type === 'update') {
            fetchData(false);
          }
        } catch (err) {
          console.error('Gagal memproses pesan WebSocket:', err);
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket terputus. Mencoba rekoneksi dalam 5 detik...');
        setTimeout(connectWebSocket, 5000);
      };

      ws.current.onerror = (error) => {
        console.error('Kesalahan WebSocket:', error);
        showToast('error', 'Koneksi WebSocket gagal. Menggunakan polling sebagai cadangan.');
        startPolling();
      };
    };

    let pollingInterval = null;
    const startPolling = () => {
      if (!pollingInterval) {
        pollingInterval = setInterval(() => {
          fetchData(false);
        }, 2000);
      }
    };

    connectWebSocket();

    return () => {
      ws.current?.close();
      if (pollingInterval) clearInterval(pollingInterval);
    };
    }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const stored = localStorage.getItem('lastPanggilan');
        if (!stored) return;

        const panggilan = JSON.parse(stored);
        if (!panggilan || panggilan.no === lastNoDipanggil) return;

        setLastNoDipanggil(panggilan.no);

        if (userHasInteracted) {
          const ding = new Audio('/sounds/opening.mp3');
          ding.play().catch((e) => console.warn('Gagal play audio:', e));

          ding.onended = () => {
            if ('speechSynthesis' in window) {
              const suara = new SpeechSynthesisUtterance();
              suara.lang = 'id-ID';
              suara.text = `Nomor antrian ${panggilan.no.split('').join(' ')}, silakan menuju loket ${panggilan.loket}`;
              suara.rate = 0.9;
              window.speechSynthesis.cancel();
              window.speechSynthesis.speak(suara);
            }
          };
        }
      } catch (err) {
        console.error('Gagal memutar suara:', err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastNoDipanggil, userHasInteracted]);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const [loketRes, antrianRes] = await Promise.all([
        axios.get(`${API_URL}/loket`),
        axios.get(`${API_URL}/antrian/data`),
      ]);

      const newLoket = loketRes?.data?.data || [];
      const newAntrian = antrianRes?.data?.data || [];

      if (JSON.stringify(newLoket) !== JSON.stringify(loketList)) {
        setLoketList(newLoket);
      }
      if (JSON.stringify(newAntrian) !== JSON.stringify(antrianList)) {
        setAntrianList(newAntrian);
      }
    } catch (err) {
      console.error('Gagal memuat data:', err);
      showToast('error', 'Gagal memuat data antrian');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const showToast = (severity, detail) => {
    toast.current?.show({
      severity,
      summary: severity === 'error' ? 'Error' : 'Info',
      detail,
      life: 3000,
    });
  };

  const getNomorAntrianDipanggil = (namaLoket) => {
    const filtered = antrianList
      .filter((a) => a.LOKET === namaLoket && a.STATUS === 'Dipanggil')
      .sort((a, b) => b.ID - a.ID);
    return filtered?.[0]?.NO_ANTRIAN || '-';
  };

  const config = getResponsiveConfig(screenSize, loketList.length);
  const colClass = `col-${12 / config.cols}`;
  const centerCards = loketList.length < config.cols;

  const getCardStyle = (index) => {
    const colors = ['#e3f2fd', '#fffde7', '#e8f5e9', '#fce4ec', '#ede7f6', '#fbe9e7'];
    const borders = ['#42a5f5', '#fbc02d', '#66bb6a', '#ec407a', '#7e57c2e', '#ff7043'];
    const idx = index % colors.length;
    return {
      backgroundColor: colors[idx],
      borderLeft: `6px solid ${borders[idx]}`,
      transition: 'transform 0.3s, box-shadow 0.3s',
    };
  };

  const renderCard = (loket, index) => {
    const currentNumber = getNomorAntrianDipanggil(loket.NAMALOKET);
    const hasQueue = currentNumber !== '-';
    const isActive = loket.AKTIF !== false;

    return (
      <div key={index} className={`col-${12 / config.cols} p-2`}>
        <Card
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className={`pi pi-circle-fill text-sm ${isActive ? 'text-green-500' : 'text-red-500'}`} />
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{loket.NAMALOKET}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '0.3rem' }}>
                <Tag
                  value={isActive ? 'Aktif' : 'Nonaktif'}
                  severity={isActive ? 'success' : 'danger'}
                  icon="pi pi-bolt"
                  className="text-xs"
                />
              </div>
            </div>
          }
          style={{
            ...getCardStyle(index),
            opacity: isActive ? 1 : 0.6,
            pointerEvents: isActive ? 'auto' : 'none',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <small style={{ color: '#757575', fontWeight: '500' }}>Loket #{loket.NO}</small>
            <div style={{ fontSize: '0.75rem', color: '#757575', margin: '0.5rem 0' }}>
              Nomor Antrian Saat Ini
            </div>
            <div
              style={{
                fontSize: config.numberSize,
                fontWeight: 'bold',
                padding: '0.5rem',
                border: '2px dashed #ccc',
                borderRadius: '6px',
              }}
            >
              {currentNumber}
            </div>
            {hasQueue && (
              <Badge value="Sedang Dipanggil" severity="info" className="animate-pulse text-xs mt-2" />
            )}
          </div>
        </Card>
      </div>
    );
  };

  const handleFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  const handleStart = () => {
  setUserHasInteracted(true);
  };

  return (
    <div className="h-screen flex flex-column overflow-hidden bg-blue-50">
      <Toast ref={toast} position="top-right" />

      {!userHasInteracted && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-50 flex flex-column align-items-center justify-content-center bg-black-alpha-70">
          <Button
            label="Mulai Tampilkan Antrian"
            icon="pi pi-play"
            className="p-button-lg p-button-warning"
            onClick={handleStart}
          />
        </div>
      )}

      <div className={`text-center ${config.containerPadding} pb-2 flex-shrink-0`}>
        <div className="flex justify-end mb-2">
          <Button
            icon="pi pi-external-link"
            label="Fullscreen"
            className="p-button-sm p-button-secondary"
            onClick={handleFullscreen}
          />
        </div>
        <h1 className={`${config.headerSize} font-bold text-800 mb-2`}>
          <i className="pi pi-bell mr-2 text-blue-600" /> Monitor Antrian
        </h1>
        <p className={`${config.subtitleSize} text-600 mb-2`}>
          Informasi nomor antrian aktif di setiap loket
        </p>
        <Divider className="my-2" />
      </div>

      <div className={`flex-1 overflow-hidden ${config.containerPadding} pt-0`}>
        {loading ? (
          <LoadingState />
        ) : loketList.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={`h-full ${centerCards ? 'flex align-items-center justify-content-center' : ''}`}>
            <div className={`grid ${centerCards ? 'justify-content-center' : ''}`}>
              {loketList.map(renderCard)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getResponsiveConfig(screen, count) {
  const { width } = screen;
  const config = {
    headerSize: '',
    subtitleSize: '',
    numberSize: '',
    cardPadding: '',
    containerPadding: '',
    cols: 1,
  };

  if (width < 768)
    Object.assign(config, {
      cols: Math.min(count, 1),
      headerSize: 'text-2xl',
      subtitleSize: 'text-sm',
      numberSize: 'text-4xl',
      cardPadding: 'p-2',
      containerPadding: 'p-2',
    });
  else if (width < 1024)
    Object.assign(config, {
      cols: Math.min(count, 2),
      headerSize: 'text-3xl',
      subtitleSize: 'text-base',
      numberSize: 'text-5xl',
      cardPadding: 'p-3',
      containerPadding: 'p-3',
    });
  else if (width < 1440)
    Object.assign(config, {
      cols: Math.min(count, count <= 3 ? 3 : 4),
      headerSize: 'text-4xl',
      subtitleSize: 'text-lg',
      numberSize: 'text-6xl',
      cardPadding: 'p-4',
      containerPadding: 'p-4',
    });
  else
    Object.assign(config, {
      cols: Math.min(count, count <= 4 ? 4 : 6),
      headerSize: 'text-5xl',
      subtitleSize: 'text-xl',
      numberSize: 'text-7xl',
      cardPadding: 'p-4',
      containerPadding: 'p-6',
    });

  return config;
}

const LoadingState = () => (
  <div className="flex flex-column align-items-center justify-content-center h-full">
    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
    <p className="text-lg text-600 font-medium mt-3">
      <i className="pi pi-spin pi-spinner mr-2" /> Memuat data antrian...
    </p>
  </div>
);

const EmptyState = () => (
  <div className="text-center h-full flex flex-column align-items-center justify-content-center">
    <i className="pi pi-inbox text-4xl text-400 mb-3" />
    <h3 className="text-xl font-semibold text-700 mb-2">Tidak Ada Loket Tersedia</h3>
    <p className="text-600">Silakan hubungi administrator untuk informasi lebih lanjut</p>
  </div>
);

export default MonitorAntrian;