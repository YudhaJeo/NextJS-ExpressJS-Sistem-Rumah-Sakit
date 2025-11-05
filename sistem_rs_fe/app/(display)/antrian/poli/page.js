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
import { usePrinterManager } from '@/utils/printerManager';
import PrinterSelector from '@/components/PrinterSelector';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
    <p className="text-black font-medium mt-4 text-base">
      <i className="pi pi-spin pi-spinner mr-2" />
      Memuat data...
    </p>
  </div>
);

const EmptyState = () => (
  <div className="text-center h-full flex flex-col items-center justify-center">
    <i className="pi pi-inbox text-[2rem] text-black mb-4" />
    <h3 className="text-lg font-semibold text-black mb-2">Tidak Ada Poli Tersedia</h3>
    <p className="text-black">Silakan hubungi administrator untuk informasi lebih lanjut</p>
  </div>
);

const Stats = ({ count, label, color }) => (
  <div className="flex flex-col items-center">
    <Tag value={count} severity={color} className="text-base font-bold mb-1 px-3 py-2" />
    <span className="text-sm text-black">{label}</span>
  </div>
);

function DisplayAntrianPoli() {
  const [poliList, setPoliList] = useState([]);
  const [antrianList, setAntrianList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [time, setTime] = useState(null);

  const toast = useRef(null);
  const { getPrinterConfig } = usePrinterManager();

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

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.qz) {
      const connectQzTray = async () => {
        try {
          if (window.qz.websocket?.disconnect) {
            try {
              await window.qz.websocket.disconnect();
            } catch (disconnectError) {
              console.log('Gagal disconnect (mungkin tidak ada koneksi aktif):', disconnectError);
            }
          }

          await Promise.race([
            window.qz.websocket.connect(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Koneksi WebSocket timeout')), 5000)
            )
          ]);

          console.log('QZ Tray websocket berhasil tersambung');
        } catch (err) {
          console.error("QZ Tray koneksi gagal:", err);
          
          const connectionErrorMessages = [
            'An open connection with QZ Tray already exists',
            'Connection attempt cancelled by user',
            'WebSocket is closed before the connection is established',
            'Koneksi WebSocket timeout',
            'Cannot read properties of null (reading \'sendData\')'
          ];

          const isConnectionError = connectionErrorMessages.some(msg => 
            err.message.includes(msg)
          );

          if (isConnectionError) {
            console.log('Koneksi bermasalah, abaikan');
          }
        }
      };

      connectQzTray();
    }
  }, []);

  useEffect(() => {
    const updateTime = () => setTime(new Date());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateSize = () => setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [poliRes, antrianRes] = await Promise.all([
        axios.get(`${API_URL}/poli`),
        axios.get(`${API_URL}/antrian_poli/data`),
      ]);
      setPoliList(poliRes.data || []);
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

  const getAntrianByPoli = (namaPoli) => {
    const item = antrianList.find((a) => a.POLI === namaPoli && a.STATUS === 'Belum');
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
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  };

  const printStruk = async (nomorBaru, poliName) => {
    try {
      if (!window.qz) throw new Error("QZ Tray tidak tersedia");

      if (!window.qz.websocket) {
        throw new Error("WebSocket tidak tersedia");
      }

      await Promise.race([
        window.qz.websocket.connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Koneksi WebSocket timeout')), 5000)
        )
      ]);

      const config = window.qz.configs?.create 
        ? window.qz.configs.create("POS-58")
        : null;

      if (!config) {
        throw new Error("Konfigurasi printer tidak dapat dibuat");
      }

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
        '*** STRUK RUMAH SAKIT ***\n',
        '--------------------------\n',

        '\x1B\x21\x18',
        'NOMOR ANTRIAN ANDA\n',

        '\x1B\x21\x30',
        `${nomorBaru.toString().toUpperCase()}\n`,
        '----------------\n',

        '\x1B\x21\x00',
        '\x1B\x61\x00',
        `RUANG  : ${poliName}\n`,
        `TANGGAL: ${tanggal}\n`,
        `JAM    : ${jam}\n`,

        '\x1B\x61\x01',
        '--------------------------\n',

        'Harap tunggu panggilan\n\n\n',
        '\x1D\x56\x01'
      ];

      if (!window.qz.print) {
        throw new Error("Metode print tidak tersedia");
      }

      await window.qz.print(config, data);
      
      try {
        await window.qz.websocket.disconnect();
      } catch (disconnectError) {
        console.log('Gagal disconnect websocket:', disconnectError);
      }
    } catch (err) {
      console.error("Gagal print:", err);
      
      const printErrorMessages = [
        'Cannot read properties of null (reading \'sendData\')',
        'Connection attempt cancelled by user',
        'WebSocket is closed before the connection is established'
      ];

      const isPrintError = printErrorMessages.some(msg => 
        err.message.includes(msg)
      );

      if (isPrintError) {
        console.log('Error pencetakan dapat diabaikan');
      }
    }
  };

  const handleAmbilTiket = async (poliName) => {
    try {
      const res = await axios.post(`${API_URL}/antrian_poli/store`, {
        POLI: poliName,
      });

      const nomorBaru = res.data.data.NO_ANTRIAN || res.data.data;
      const poli = poliList.find((p) => p.NAMAPOLI === poliName);

      if (poli) {
        setAntrianList((prev) => [
          ...prev.filter((a) => a.POLI !== poliName || a.STATUS !== 'Belum'),
          {
            ID: Date.now(),
            NO_ANTRIAN: nomorBaru,
            POLI: poliName,
            STATUS: 'Belum',
            POLI_ID: poli.IDLOKET,
            CREATED_AT: new Date().toISOString(),
          },
        ]);

        showToast('success', `Tiket Poli ${poliName} berhasil diambil. Nomor: ${nomorBaru}`);
        await printStruk(nomorBaru, poliName);
      }
    } catch (err) {
      showToast('error', 'Gagal mengambil tiket.');
      console.error('Error tacking ticket:', err)
    }
  };

  const handleCetakAntrian = async () => {
    try {
      const config = getPrinterConfig();
      
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Kesalahan',
        detail: error.message || 'Printer belum dipilih'
      });
    }
  };

  const renderCard = (poli, index) => {
    const currentNumber = getAntrianByPoli(poli.NAMAPOLI);
    const hasQueue = currentNumber !== '-';
    const isActive = poli.AKTIF !== false;

    const cardStyle = getCardStyle(index);

    return (
      <div key={index} className={`col-${12 / config.cols}`}>
        <Card
          header={
            <div className="flex justify-content-between pt-4 px-4">
              <div className="flex align-items-center gap-2">
                <span className="font-bold text-lg">{poli.NAMAPOLI}</span>
              </div>
              <Tag
                value={hasQueue ? 'Tersedia' : 'Kosong'}
                severity={hasQueue ? 'success' : 'warning'}
                icon={hasQueue ? 'pi pi-check' : 'pi pi-exclamation-triangle'}
              />
            </div>
          }
          footer={
            <div className="flex justify-content-center mt-2">
              <Button
                label="Ambil Tiket"
                icon="pi pi-ticket"
                onClick={() => handleAmbilTiket(poli.NAMAPOLI)}
                disabled={loading || !isActive}
                loading={loading}
                className="w-full"
                size="small"
                severity={hasQueue ? 'success' : 'info'}
              />
            </div>
          }
          className={`h-full ${cardStyle}`}
        >
          <div className="text-center">
            <small className="text-color-secondary font-medium">Poli {poli.IDPOLI}</small>
            <div className="text-xs text-color-secondary mt-1 mb-2">Nomor Antrian Saat Ini</div>
            <div
              className="text-center font-bold py-2 border-2 border-dashed border-300 border-round"
              style={{
                fontSize: config.numberSize,
              }}
            >
              {currentNumber}
            </div>
            {hasQueue && (
              <Badge value="Siap Dilayani" severity="success" className="animate-pulse text-xs mt-2" />
            )}
          </div>
        </Card>
      </div>
    );
  };

  const config = getResponsiveConfig(screenSize, poliList.length);

  const [data, setData] = useState([]);
  const MINIO_URL = process.env.NEXT_PUBLIC_MINIO_URL;

  const fetchProfileRs = async () => {
    try {
      const res = await axios.get(`${API_URL}/profile_mobile`);
      if (res.data?.data) {
        setData([res.data.data]);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Gagal mengambil data profil RS:", err);
    }
  };

  useEffect(() => {
    fetchProfileRs();
  }, []);

  if (!data || data.length === 0)
    return <p className="p-4 text-center">Memuat profil RS...</p>;

  const profile_rs = data[0];
  const cleanPath = profile_rs.FOTOLOGO?.startsWith("/")
    ? profile_rs.FOTOLOGO.substring(1)
    : profile_rs.FOTOLOGO;

  const imageUrl = profile_rs.FOTOLOGO
    ? `${MINIO_URL}/${cleanPath}`
    : null;


  return (
    <div className="h-screen flex flex-column overflow-hidden relative">
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

      <div className="px-6 py-4 flex justify-content-between align-items-center flex-wrap gap-4">
        <div className="flex align-items-center gap-4">
          <img
            src={imageUrl}
            alt="Logo RS"
            className="h-[50px]"
          />
          <h2 className="text-lg font-semibold text-black m-0">{profile_rs.NAMARS}</h2>
        </div>

        {/* Tambahkan PrinterSelector di sini */}
        <PrinterSelector />

        {hydrated && (
          <div className="font-bold text-sm text-right">
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
        )}
      </div>

      <div className={`px-${config.containerPadding} flex-shrink-0`} />

      <div className={`flex-1 overflow-auto px-${config.containerPadding} p-4`}>
        {loading ? (
          <LoadingState />
        ) : poliList.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="h-full">
            <div className="grid">{poliList.map(renderCard)}</div>
          </div>
        )}
      </div>

      {!loading && poliList.length > 0 && (
        <div className={`px-${config.containerPadding} flex-shrink-0`}>
          <Divider />
          <div className="flex justify-content-center gap-8 p-4 text-center">
            <Stats
              count={poliList.filter((p) => p.AKTIF !== false).length}
              label="Poli Aktif"
              color="success"
            />
            <Stats
              count={antrianList.filter((a) => a.STATUS === 'Belum').length}
              label="Antrian Aktif"
              color="info"
            />
            <Stats
              count={poliList.length}
              label="Total Poli"
              color="warning"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayAntrianPoli;