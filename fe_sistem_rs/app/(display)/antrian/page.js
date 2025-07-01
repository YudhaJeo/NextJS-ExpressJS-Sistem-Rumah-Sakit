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

function DisplayAntrian() {
  const [loketList, setLoketList] = useState([]);
  const [antrianList, setAntrianList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toast = useRef(null);
  const [time, setTime] = useState(null);

  useEffect(() => {
    const updateTime = () => setTime(new Date());
    updateTime(); 
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateSize = () =>
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Failed to enter full screen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

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
    } finally {
      setLoading(false);
    }
  };

  const showToast = (severity, detail) => {
    toast.current?.show({
      severity,
      summary: severity === 'error' ? 'Error' : 'Sukses',
      detail,
      life: 3000,
    });
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
      }
    } catch {
      showToast('error', 'Gagal mengambil tiket.');
    }
  };

  const getAntrianByLoket = (namaLoket) => {
    const item = antrianList.find((a) => a.LOKET === namaLoket && a.STATUS === 'Belum');
    return typeof item?.NO_ANTRIAN === 'string' ? item.NO_ANTRIAN : '-';
  };

  const config = getResponsiveConfig(screenSize, loketList.length);
  const colClass = `col-${12 / config.cols}`;

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

  const renderCard = (loket, index) => {
    const currentNumber = getAntrianByLoket(loket.NAMALOKET);
    const hasQueue = currentNumber !== '-';
    const isActive = loket.AKTIF !== false;

    return (
      <div key={index} className={colClass}>
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
            <div style={{ fontSize: '0.75rem', color: '#757575', margin: '0.5rem 0' }}>Nomor Antrian Saat Ini</div>
            <div style={{ fontSize: config.numberSize, fontWeight: 'bold', padding: '0.5rem', border: '2px dashed #ccc', borderRadius: '6px' }}>
              {currentNumber}
            </div>
            {hasQueue && <Badge value="Siap Dilayani" severity="success" className="animate-pulse text-xs" />}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      {!isFullScreen && (
        <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 999 }}>
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

      <div
        style={{
          background: '#1976d2',
          color: '#fff',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/layout/images/logo.png" alt="Logo" style={{ height: '50px' }} />
          <h2 style={{ margin: 0, color: 'white' }}>RUMAH SAKIT</h2>
        </div>
          <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
            {time
              ? time.toLocaleString('id-ID', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })
              : null}
          </div>
      </div>

      <div style={{ padding: config.containerPadding, paddingBottom: '0.5rem', flexShrink: 0 }} />

      <div style={{ flex: 1, overflow: 'auto', padding: config.containerPadding, paddingTop: 0 }}>
        {loading ? (
          <LoadingState />
        ) : loketList.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ height: '100%' }}>
            <div className="grid">
              {loketList.map(renderCard)}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER STATISTIK */}
      {!loading && loketList.length > 0 && (
        <div style={{ padding: config.containerPadding, paddingTop: '0.5rem', flexShrink: 0 }}>
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', textAlign: 'center' }}>
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

// Komponen & helper tambahan
function getResponsiveConfig(screen, count) {
  const { width } = screen;
  const config = {
    numberSize: '2rem',
    cardPadding: '1rem',
    containerPadding: '1rem',
    cols: 1,
  };

  if (width < 768)
    Object.assign(config, { cols: 1, numberSize: '2rem' });
  else if (width < 1024)
    Object.assign(config, { cols: 2, numberSize: '2.5rem' });
  else if (width < 1440)
    Object.assign(config, { cols: Math.min(count, 3), numberSize: '3rem' });
  else Object.assign(config, { cols: Math.min(count, 4), numberSize: '3.5rem' });

  return config;
}

const LoadingState = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
    <p style={{ fontSize: '1rem', color: '#666', fontWeight: '500', marginTop: '1rem' }}>
      <i className="pi pi-spin pi-spinner mr-2" /> Memuat data...
    </p>
  </div>
);

const EmptyState = () => (
  <div style={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <i className="pi pi-inbox" style={{ fontSize: '2rem', color: '#999', marginBottom: '1rem' }} />
    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#444', marginBottom: '0.5rem' }}>Tidak Ada Loket Tersedia</h3>
    <p style={{ color: '#777' }}>Silakan hubungi administrator untuk informasi lebih lanjut</p>
  </div>
);

const Stats = ({ count, label, color }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Tag value={count} severity={color} className="text-base font-bold mb-1 px-3 py-2" />
    <span style={{ fontSize: '0.75rem', color: '#666' }}>{label}</span>
  </div>
);

export default DisplayAntrian;
