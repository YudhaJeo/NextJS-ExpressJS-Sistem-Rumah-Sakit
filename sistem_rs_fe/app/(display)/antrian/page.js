'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Divider } from 'primereact/divider';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper functions
const getResponsiveConfig = (screen, count) => {
  const { width } = screen;
  const config = {
    numberSize: '2rem',
    cardPadding: '1rem',
    containerPadding: '1rem',
    cols: 1,
  };

  if (width < 768) {
    Object.assign(config, { cols: 1, numberSize: '2rem' });
  } else if (width < 1024) {
    Object.assign(config, { cols: 2, numberSize: '2.5rem' });
  } else if (width < 1440) {
    Object.assign(config, { cols: Math.min(count, 3), numberSize: '3rem' });
  } else {
    Object.assign(config, { cols: Math.min(count, 4), numberSize: '3.5rem' });
  }

  return config;
};

// Component for loading state
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
    <p className="text-black font-medium mt-4 text-base">
      <i className="pi pi-spin pi-spinner mr-2" />
      Memuat data...
    </p>
  </div>
);

// Component for empty state
const EmptyState = () => (
  <div className="text-center h-full flex flex-col items-center justify-center">
    <i className="pi pi-inbox text-[2rem] text-black mb-4" />
    <h3 className="text-lg font-semibold text-black mb-2">Tidak Ada Loket Tersedia</h3>
    <p className="text-black">Silakan hubungi administrator untuk informasi lebih lanjut</p>
  </div>
);

// Component for statistics display
const Stats = ({ count, label, color }) => (
  <div className="flex flex-col items-center">
    <Tag value={count} severity={color} className="text-base font-bold mb-1 px-3 py-2" />
    <span className="text-sm text-black">{label}</span>
  </div>
);

function DisplayAntrian() {
  // State management
  const [loketList, setLoketList] = useState([]);
  const [antrianList, setAntrianList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [time, setTime] = useState(null);
  
  const toast = useRef(null);

  // Initialize QZ Tray script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/qz-tray.js';
    script.async = true;
    script.onload = () => console.log("QZ Tray script loaded");
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Initialize QZ Tray connection
  useEffect(() => {
    if (typeof window !== 'undefined' && window.qz) {
      window.qz.websocket.connect().catch(err => {
        console.error("QZ Tray belum siap:", err);
      });
    }
  }, []);

  // Time update effect
  useEffect(() => {
    const updateTime = () => setTime(new Date());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Screen size tracking
  useEffect(() => {
    const updateSize = () =>
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Fullscreen change tracking
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // API functions
  const fetchData = async () => {
    setLoading(true);
    try {
      const [loketRes, antrianRes] = await Promise.all([
        axios.get(`${API_URL}/loket`),
        axios.get(`${API_URL}/antrian/data`),
      ]);
      setLoketList(loketRes.data.data || []);
      setAntrianList(antrianRes.data.data || []);
    } catch (err) {
      showToast('error', 'Gagal memuat data.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const showToast = (severity, detail) => {
    toast.current?.show({
      severity,
      summary: severity === 'error' ? 'Error' : 'Sukses',
      detail,
      life: 3000,
    });
  };

  const getAntrianByLoket = (namaLoket) => {
    const item = antrianList.find((a) => a.LOKET === namaLoket && a.STATUS === 'Belum');
    return typeof item?.NO_ANTRIAN === 'string' ? item.NO_ANTRIAN : '-';
  };

  const getCardStyle = (index) => {
    const colors = ['#e8f5e9', '#e3f2fd', '#fffde7', '#fce4ec', '#ede7f6', '#fbe9e7'];
    const borderColors = ['#66bb6a', '#42a5f5', '#fbc02d', '#ec407a', '#7e57c2', '#ff7043'];
    const colorIndex = index % colors.length;
    
    return {
      backgroundColor: colors[colorIndex],
      borderLeft: `6px solid ${borderColors[colorIndex]}`,
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer',
    };
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Failed to enter full screen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Print functionality
  const printStruk = async (nomorBaru, loketName) => {
    try {
      if (!window.qz) throw new Error("QZ Tray belum tersedia");

      await window.qz.websocket.connect();
      const config = window.qz.configs.create("POS-58");

      // Formatting
      const now = new Date();
      const jam = now
        .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
        .replace(/\./g, ':');
      const tanggal = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      const data = [
        '\x1B\x40',                
        '\x1B\x61\x01',            

        '\x1B\x21\x08',          
        '*** BAYZA MEDIKA ***\n',
        '--------------------------\n',

        '\x1B\x21\x18',         
        'NOMOR ANTRIAN ANDA\n',

        '\x1B\x21\x30',            
        `${nomorBaru.toString().toUpperCase()}\n`,
        '----------------\n',

        '\x1B\x21\x00',
        '\x1B\x61\x00',
        `LOKET  : ${loketName}\n`,
        `TANGGAL: ${tanggal}\n`,
        `JAM    : ${jam}\n`,

        '\x1B\x61\x01',
        '--------------------------\n',

        'Harap tunggu panggilan\n\n\n',
        '\x1D\x56\x01'            
      ];

      await window.qz.print(config, data);
      await window.qz.websocket.disconnect();
    } catch (err) {
      console.error("Gagal print:", err);
    }
  };

  const handleAmbilTiket = async (loketName) => {
    try {
      const res = await axios.post(`${API_URL}/antrian/store`, {
        LOKET: loketName,
      });

      const nomorBaru = res.data.data.NO_ANTRIAN || res.data.data;
      const loket = loketList.find((l) => l.NAMALOKET === loketName);

      if (loket) {
        setAntrianList((prev) => [
          ...prev.filter((a) => a.LOKET !== loketName || a.STATUS !== 'Belum'),
          {
            ID: Date.now(),
            NO_ANTRIAN: nomorBaru,
            LOKET: loketName,
            STATUS: 'Belum',
            LOKET_ID: loket.NO,
            CREATED_AT: new Date().toISOString(),
          },
        ]);

        showToast('success', `Tiket ${loketName} berhasil diambil. Nomor: ${nomorBaru}`);
        await printStruk(nomorBaru, loketName);
      }
    } catch (err) {
      showToast('error', 'Gagal mengambil tiket.');
      console.error('Error taking ticket:', err);
    }
  };

  // Render functions
  const renderCard = (loket, index) => {
    const currentNumber = getAntrianByLoket(loket.NAMALOKET);
    const hasQueue = currentNumber !== '-';
    const isActive = loket.AKTIF !== false;

    return (
      <div key={index} className={`col-${12 / config.cols}`}>
        <Card
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className={`pi pi-circle-fill text-sm ${isActive ? 'text-green-500' : 'text-red-500'}`} />
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{loket.NAMALOKET}</span>
              </div>
              <Tag
                value={hasQueue ? 'Tersedia' : 'Kosong'}
                severity={hasQueue ? 'success' : 'warning'}
                icon={hasQueue ? 'pi pi-check' : 'pi pi-exclamation-triangle'}
              />
            </div>
          }
          footer={
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
              <Button
                label="Ambil Tiket"
                icon="pi pi-ticket"
                onClick={() => handleAmbilTiket(loket.NAMALOKET)}
                disabled={loading || !isActive}
                loading={loading}
                style={{ width: '100%' }}
                size="small"
                severity={hasQueue ? 'success' : 'info'}
              />
            </div>
          }
          style={getCardStyle(index)}
        >
          <div style={{ textAlign: 'center' }}>
            <small style={{ color: '#757575', fontWeight: '500' }}>Loket #{loket.NO}</small>
            <div style={{ fontSize: '0.75rem', color: '#757575', margin: '0.5rem 0' }}>
              Nomor Antrian Saat Ini
            </div>
            <div style={{
              fontSize: config.numberSize,
              fontWeight: 'bold',
              padding: '0.5rem',
              border: '2px dashed #ccc',
              borderRadius: '6px'
            }}>
              {currentNumber}
            </div>
            {hasQueue && (
              <Badge value="Siap Dilayani" severity="success" className="animate-pulse text-xs" />
            )}
          </div>
        </Card>
      </div>
    );
  };

  const config = getResponsiveConfig(screenSize, loketList.length);

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      {/* Fullscreen Toggle Button */}
      {!isFullScreen && (
        <div className="fixed bottom-4 right-4 z-[999]">
          <Button
            icon="pi pi-window-maximize"
            onClick={toggleFullScreen}
            rounded
            text
            severity="secondary"
            tooltip="Tampilkan Fullscreen"
            tooltipOptions={{ position: 'left' }}
          />
        </div>
      )}

      <Toast ref={toast} position="top-right" />

      {/* Header */}
      <div className="text-black px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src="/layout/images/logo.png" alt="Logo" className="h-[50px]" />
          <h2 className="text-lg font-semibold text-black m-0">RUMAH SAKIT</h2>
        </div>
        <div className="font-bold text-sm">
          {time?.toLocaleString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
      </div>

      <div className={`px-[${config.containerPadding}] pb-2 shrink-0`} />

      {/* Main Content */}
      <div className={`flex-1 overflow-auto px-[${config.containerPadding}] pt-0`}>
        {loading ? (
          <LoadingState />
        ) : loketList.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="h-full">
            <div className="grid">{loketList.map(renderCard)}</div>
          </div>
        )}
      </div>

      {/* Footer Statistics */}
      {!loading && loketList.length > 0 && (
        <div className={`px-[${config.containerPadding}] pt-2 shrink-0`}>
          <Divider />
          <div className="flex justify-center gap-8 text-center">
            <Stats
              count={loketList.filter((l) => l.AKTIF !== false).length}
              label="Loket Aktif"
              color="success"
            />
            <Stats
              count={antrianList.filter((a) => a.STATUS === 'Belum').length}
              label="Antrian Aktif"
              color="info"
            />
            <Stats
              count={loketList.length}
              label="Total Loket"
              color="warning"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayAntrian;