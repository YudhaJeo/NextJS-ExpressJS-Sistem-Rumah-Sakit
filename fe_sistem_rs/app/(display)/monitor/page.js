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

function MonitorAntrian() {
  const [loketList, setLoketList] = useState([]);
  const [antrianList, setAntrianList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [lastNoDipanggil, setLastNoDipanggil] = useState('');
  const toast = useRef(null);

  useEffect(() => {
    fetchData(true);

    const interval = setInterval(() => {
      fetchData(false);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'lastPanggilan') {
        try {
          const panggilan = JSON.parse(event.newValue);
          if (!panggilan) return;

          // Hindari pengulangan suara untuk panggilan yang sama
          if (panggilan.no === lastNoDipanggil) return;

          setLastNoDipanggil(panggilan.no);

          const ding = new Audio('/sounds/opening.mp3');
          ding.play();

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
        } catch (err) {
          console.error('Gagal memutar suara:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [lastNoDipanggil]);

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
    const borders = ['#42a5f5', '#fbc02d', '#66bb6a', '#ec407a', '#7e57c2', '#ff7043'];
    const idx = index % colors.length;
    return {
      backgroundColor: colors[idx],
      borderLeft: `6px solid ${borders[idx]}`,
      transition: 'transform 0.3s, box-shadow 0.3s',
    };
  };

  const renderCard = (loket, index) => {
    const nomor = getNomorAntrianDipanggil(loket.NAMALOKET);
    const aktif = !!loket.AKTIF;
    const adaAntrian = nomor !== '-';

    return (
      <div key={loket.NO} className={`${colClass} p-2`}>
        <Card
          header={
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <i className={`pi pi-circle-fill text-sm ${aktif ? 'text-green-500' : 'text-red-500'}`} />
                <span className="font-bold text-lg">{loket.NAMALOKET}</span>
              </div>
              <Tag
                value={aktif ? 'Aktif' : 'Nonaktif'}
                severity={aktif ? 'success' : 'danger'}
                icon="pi pi-bolt"
              />
            </div>
          }
          style={getCardStyle(index)}
          className={`h-full hover:shadow-2xl ${aktif ? '' : 'opacity-60'} ${config.cardPadding}`}
        >
          <div className="text-center">
            <small className="text-600 font-medium">Loket #{loket.NO}</small>
            <div className="text-xs text-600 font-medium my-2">Sedang Dipanggil</div>
            <div className={`${config.numberSize} font-bold p-2 border-2 border-dashed border-round-lg`}>
              {nomor}
            </div>
            {adaAntrian && (
              <Badge
                value="Silakan ke loket"
                severity="success"
                className="animate-pulse text-xs mt-2"
              />
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

  return (
    <div className="h-screen flex flex-column overflow-hidden bg-blue-50">
      <Toast ref={toast} position="top-right" />

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