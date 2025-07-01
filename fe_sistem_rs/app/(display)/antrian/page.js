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
    return () =>
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
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
          ...prev.filter(
            (a) => a.LOKET !== loketName || a.STATUS !== 'Belum'
          ),
          {
            ID: Date.now(),
            NO_ANTRIAN: nomorBaru,
            LOKET: loketName,
            STATUS: 'Belum',
            LOKET_ID: loket.NO,
            CREATED_AT: new Date().toISOString(),
          },
        ]);
        showToast(
          'success',
          `Tiket ${loketName} berhasil diambil. Nomor: ${nomorBaru}`
        );
      }
    } catch {
      showToast('error', 'Gagal mengambil tiket.');
    }
  };

  const getAntrianByLoket = (namaLoket) => {
    const item = antrianList.find(
      (a) => a.LOKET === namaLoket && a.STATUS === 'Belum'
    );
    return typeof item?.NO_ANTRIAN === 'string' ? item.NO_ANTRIAN : '-';
  };

  const config = getResponsiveConfig(screenSize, loketList.length);
  const colClass = `col-${12 / config.cols}`;
  const needsCentering = loketList.length < config.cols;

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
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <i
                  className={`pi pi-circle-fill text-sm ${
                    isActive ? 'text-green-500' : 'text-red-500'
                  }`}
                />
                <span className="font-bold text-lg">{loket.NAMALOKET}</span>
              </div>
              <Tag
                value={hasQueue ? 'Tersedia' : 'Kosong'}
                severity={hasQueue ? 'success' : 'warning'}
                icon={hasQueue ? 'pi pi-check' : 'pi pi-exclamation-triangle'}
              />
            </div>
          }
          footer={
            <div className="flex justify-center mt-2">
              <Button
                label="Ambil Tiket"
                icon="pi pi-ticket"
                onClick={() => handleAmbilTiket(loket.NAMALOKET)}
                disabled={loading || !isActive}
                loading={loading}
                className="w-full"
                size="small"
                severity={hasQueue ? 'success' : 'info'}
              />
            </div>
          }
          style={getCardStyle(index)}
          className={`h-full hover:shadow-2 ${isActive ? '' : 'opacity-60'} ${config.cardPadding}`}
        >
          <div className="text-center">
            <small className="text-600 font-medium">Loket #{loket.NO}</small>
            <div className="text-xs text-600 font-medium my-2">Nomor Antrian Saat Ini</div>
            <div className={`${config.numberSize} font-bold p-2 border-2 border-dashed border-round-lg`}>
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

  return (
    <div className="h-screen flex flex-column overflow-hidden relative">
      {/* Fullscreen Button (pojok kanan atas) */}
      <div className="fixed top-3 right-3 z-50">
        <Button
          icon={isFullScreen ? 'pi pi-window-minimize' : 'pi pi-window-maximize'}
          onClick={toggleFullScreen}
          rounded
          text
          severity="secondary"
          tooltip={isFullScreen ? 'Keluar Fullscreen (Esc)' : 'Fullscreen'}
          tooltipOptions={{ position: 'left' }}
        />
      </div>

      <Toast ref={toast} position="top-right" />

      <div className={`text-center ${config.containerPadding} pb-2 flex-shrink-0`}>
        <h1 className={`${config.headerSize} font-bold text-800 mb-2`}>
          <i className="pi pi-desktop mr-2 text-blue-600" /> Sistem Antrian Digital
        </h1>
        <p className={`${config.subtitleSize} text-600 mb-2`}>
          Ambil nomor antrian Anda dengan mudah dan cepat
        </p>
        <Divider className="my-2" />
      </div>

      <div className={`flex-1 overflow-hidden ${config.containerPadding} pt-0`}>
        {loading ? (
          <LoadingState />
        ) : loketList.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={`h-full ${needsCentering ? 'flex align-items-center justify-content-center' : ''}`}>
            <div className={`grid ${needsCentering ? 'justify-content-center' : ''}`}>
              {loketList.map(renderCard)}
            </div>
          </div>
        )}
      </div>

      {!loading && loketList.length > 0 && (
        <div className={`flex-shrink-0 ${config.containerPadding} pt-2`}>
          <Divider className="my-2" />
          <div className="flex justify-content-center gap-6 text-center">
            <Stats count={loketList.filter((l) => l.AKTIF !== false).length} label="Loket Aktif" color="success" />
            <Stats count={antrianList.filter((a) => a.STATUS === 'Belum').length} label="Antrian Aktif" color="info" />
            <Stats count={loketList.length} label="Total Loket" color="warning" />
          </div>
        </div>
      )}
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
      numberSize: 'text-3xl',
      cardPadding: 'p-2',
      containerPadding: 'p-2',
    });
  else if (width < 1024)
    Object.assign(config, {
      cols: Math.min(count, 2),
      headerSize: 'text-3xl',
      subtitleSize: 'text-base',
      numberSize: 'text-4xl',
      cardPadding: 'p-3',
      containerPadding: 'p-3',
    });
  else if (width < 1440)
    Object.assign(config, {
      cols: Math.min(count, count <= 3 ? 3 : 4),
      headerSize: 'text-4xl',
      subtitleSize: 'text-lg',
      numberSize: 'text-5xl',
      cardPadding: 'p-4',
      containerPadding: 'p-4',
    });
  else
    Object.assign(config, {
      cols: Math.min(count, count <= 4 ? 4 : 6),
      headerSize: 'text-5xl',
      subtitleSize: 'text-xl',
      numberSize: 'text-6xl',
      cardPadding: 'p-4',
      containerPadding: 'p-6',
    });

  return config;
}

const LoadingState = () => (
  <div className="flex flex-column align-items-center justify-content-center h-full">
    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
    <p className="text-lg text-600 font-medium mt-3">
      <i className="pi pi-spin pi-spinner mr-2" /> Memuat data...
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

const Stats = ({ count, label, color }) => (
  <div className="flex flex-column align-items-center">
    <Tag value={count} severity={color} className="text-base font-bold mb-1 px-3 py-2" />
    <span className="text-xs text-600">{label}</span>
  </div>
);

export default DisplayAntrian;
