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
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [currentTime, setCurrentTime] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => {
      fetchData(false);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
    
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Add fullscreen change listener
  useEffect(() => {
    if (!isClient) return;

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Check initial state
    handleFullscreenChange();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    
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
  }, [lastNoDipanggil, userHasInteracted, isClient]);

  useEffect(() => {
    if (!isClient) return;
    
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient]);

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

  const getCardStyle = (index, aktif, adaAntrian, namaLoket) => {
    // Determine if it's BPJS or Umum based on loket name
    const isBPJS = namaLoket && namaLoket.toLowerCase().includes('bpjs');
    
    const blueThemes = [
      { bg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', border: '#3b82f6', shadow: 'rgba(59, 130, 246, 0.4)' },
      { bg: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)', border: '#1e40af', shadow: 'rgba(30, 64, 175, 0.4)' },
      { bg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', border: '#0ea5e9', shadow: 'rgba(14, 165, 233, 0.4)' },
      { bg: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: '#6366f1', shadow: 'rgba(99, 102, 241, 0.4)' },
      { bg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', border: '#2563eb', shadow: 'rgba(37, 99, 235, 0.4)' },
      { bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '#334155', shadow: 'rgba(51, 65, 85, 0.4)' }
    ];

    const greenThemes = [
      { bg: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', border: '#22c55e', shadow: 'rgba(34, 197, 94, 0.4)' },
      { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: '#10b981', shadow: 'rgba(16, 185, 129, 0.4)' },
      { bg: 'linear-gradient(135deg, #15803d 0%, #166534 100%)', border: '#15803d', shadow: 'rgba(21, 128, 61, 0.4)' },
      { bg: 'linear-gradient(135deg, #65a30d 0%, #4d7c0f 100%)', border: '#65a30d', shadow: 'rgba(101, 163, 13, 0.4)' },
      { bg: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', border: '#0d9488', shadow: 'rgba(13, 148, 136, 0.4)' },
      { bg: 'linear-gradient(135deg, #047857 0%, #064e3b 100%)', border: '#047857', shadow: 'rgba(4, 120, 87, 0.4)' }
    ];
    
    const themes = isBPJS ? greenThemes : blueThemes;
    const theme = themes[index % themes.length];
    
    return {
      background: aktif ? theme.bg : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      border: `3px solid ${aktif ? theme.border : '#dee2e6'}`,
      borderRadius: '20px',
      boxShadow: aktif 
        ? `0 20px 40px ${theme.shadow}, 0 10px 25px rgba(0,0,0,0.1)` 
        : '0 10px 25px rgba(0,0,0,0.05)',
      transform: adaAntrian && aktif ? 'scale(1.02)' : 'scale(1)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
    };
  };

  const renderCard = (loket, index) => {
    const nomor = getNomorAntrianDipanggil(loket.NAMALOKET);
    const aktif = !!loket.AKTIF;
    const adaAntrian = nomor !== '-';
    const isBPJS = loket.NAMALOKET && loket.NAMALOKET.toLowerCase().includes('bpjs');

    return (
      <div key={loket.NO} className={`${colClass} p-2`} style={{ 
        animation: `slideInUp 0.6s ease-out ${index * 0.1}s both` 
      }}>
        <Card
          header={
            <div className="flex justify-between items-center mb-3 relative">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <i className={`pi pi-circle-fill text-lg ${aktif ? 'text-white animate-pulse' : 'text-gray-400'}`} />
                  {aktif && (
                    <div className="absolute inset-0 pi pi-circle-fill text-lg text-white opacity-40 animate-ping" />
                  )}
                </div>
                <div className="flex flex-column gap-1">
                  <span className={`font-bold text-xl ${aktif ? 'text-white' : 'text-gray-600'}`}>
                    {loket.NAMALOKET}
                  </span>
                  {isBPJS && (
                    <div className="flex align-items-center gap-1">
                      <i className="pi pi-shield text-xs text-white text-opacity-80" />
                      <span className="text-xs text-white text-opacity-80 font-semibold">BPJS Kesehatan</span>
                    </div>
                  )}
                  {!isBPJS && (
                    <div className="flex align-items-center gap-1">
                      <i className="pi pi-users text-xs text-white text-opacity-80" />
                      <span className="text-xs text-white text-opacity-80 font-semibold">Layanan Umum</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-column gap-2">
                <Tag
                  value={aktif ? 'Aktif' : 'Nonaktif'}
                  severity={aktif ? 'success' : 'danger'}
                  icon="pi pi-bolt"
                  className={`${aktif ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500'} text-white font-semibold px-3 py-1 border-round-full`}
                />
                <small className={`text-xs font-medium ${aktif ? 'text-white text-opacity-80' : 'text-gray-500'} text-center`}>
                  Loket #{loket.NO}
                </small>
              </div>
            </div>
          }
          style={getCardStyle(index, aktif, adaAntrian, loket.NAMALOKET)}
          className={`h-full hover:shadow-2xl ${aktif ? '' : 'opacity-70'} ${config.cardPadding} border-none relative overflow-hidden`}
        >
          {/* Decorative elements */}
          {aktif && (
            <>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 border-round-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 border-round-full -ml-12 -mb-12" />
            </>
          )}
          
          <div className="text-center relative z-1">
            <div className={`text-sm font-semibold mb-3 ${aktif ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
              <i className="pi pi-megaphone mr-2" />
              Sedang Dipanggil
            </div>
            
            <div className={`${config.numberSize} font-bold p-4 mb-4 relative`}
                 style={{
                   background: aktif ? 'rgba(255,255,255,0.95)' : 'rgba(248,249,250,0.9)',
                   color: aktif ? '#1a1a1a' : '#6c757d',
                   borderRadius: '16px',
                   border: aktif ? '3px solid rgba(255,255,255,0.3)' : '3px solid rgba(0,0,0,0.1)',
                   boxShadow: aktif ? 'inset 0 2px 10px rgba(0,0,0,0.1)' : 'inset 0 2px 5px rgba(0,0,0,0.05)',
                   letterSpacing: '2px',
                   textShadow: aktif ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                 }}>
              {nomor === '-' ? (
                <div className="flex flex-column align-items-center gap-2">
                  <i className="pi pi-clock text-4xl opacity-50" />
                  <span className="text-lg">Menunggu</span>
                </div>
              ) : (
                <div className="relative">
                  {nomor}
                  {adaAntrian && aktif && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 border-round-full animate-bounce" />
                  )}
                </div>
              )}
            </div>
            
            {adaAntrian && (
              <div className="relative">
                <Badge
                  value="🔔 Silakan ke loket"
                  severity="success"
                  className="animate-pulse text-sm font-semibold px-4 py-2 border-round-full"
                  style={{
                    background: isBPJS 
                      ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                      : 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                    boxShadow: isBPJS 
                      ? '0 4px 15px rgba(5, 150, 105, 0.4)'
                      : '0 4px 15px rgba(29, 78, 216, 0.4)',
                    border: 'none'
                  }}
                />
                <div className={`absolute inset-0 border-round-full animate-ping opacity-20 ${
                  isBPJS ? 'bg-green-400' : 'bg-blue-400'
                }`} />
              </div>
            )}

            {!adaAntrian && aktif && (
              <div className={`text-sm font-medium ${aktif ? 'text-white text-opacity-70' : 'text-gray-500'}`}>
                <i className="pi pi-hourglass mr-2" />
                Siap melayani
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  const handleFullscreen = () => {
    if (!isClient) return;
    
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };

  const handleExitFullscreen = () => {
    if (!isClient) return;
    
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  };

  const handleStart = () => {
    setUserHasInteracted(true);
  };

  const formatTime = (date) => {
    if (!date || !isClient) return '--:--:--';
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date) => {
    if (!date || !isClient) return 'Loading...';
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="h-screen flex flex-column overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #047857 100%)',
      position: 'relative'
    }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white opacity-5 border-round-full animate-pulse" 
             style={{ animation: 'float 20s ease-in-out infinite' }} />
        <div className="absolute -bottom-1/2 -right-1/2 w-3/4 h-3/4 bg-white opacity-5 border-round-full" 
             style={{ animation: 'float 25s ease-in-out infinite reverse' }} />
      </div>

      <Toast ref={toast} position="top-right" />

      {!userHasInteracted && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-50 flex flex-column align-items-center justify-content-center"
             style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)' }}>
          <div className="text-center mb-6">
            <i className="pi pi-volume-up text-6xl text-white mb-4 animate-bounce" />
            <h2 className="text-3xl font-bold text-white mb-2">Sistem Monitor Antrian</h2>
            <p className="text-white text-opacity-80">Klik tombol di bawah untuk mengaktifkan audio</p>
          </div>
          <Button
            label="🔊 Mulai Tampilkan Antrian"
            icon="pi pi-play"
            className="p-button-lg font-bold px-6 py-3 border-round-full"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              border: 'none',
              boxShadow: '0 10px 25px rgba(251, 191, 36, 0.4)',
              transform: 'scale(1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            onClick={handleStart}
          />
        </div>
      )}

      <div className={`text-center ${config.containerPadding} pb-2 flex-shrink-0 relative z-1`}>
        <div className="flex justify-between align-items-center mb-4">
          <div className="flex flex-column align-items-start">
            <div className="text-white text-opacity-90 font-semibold text-lg">
              {formatTime(currentTime)}
            </div>
            <div className="text-white text-opacity-70 text-sm">
              {formatDate(currentTime)}
            </div>
          </div>
          {isClient && !isFullscreen && (
            <Button
              icon="pi pi-external-link"
              label="Layar Penuh"
              className="p-button-sm border-round-full font-semibold"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}
              onClick={handleFullscreen}
            />
          )}
          {isClient && isFullscreen && (
            <Button
              icon="pi pi-times"
              label="Keluar"
              className="p-button-sm border-round-full font-semibold"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}
              onClick={handleExitFullscreen}
            />
          )}
        </div>
        
        <div className="text-center mb-4">
          <h1 className={`${config.headerSize} font-bold text-white mb-2 flex align-items-center justify-content-center gap-3`}>
            <i className="pi pi-bell animate-pulse" /> 
            Monitor Antrian
            <i className="pi pi-bell animate-pulse" />
          </h1>
          <p className={`${config.subtitleSize} text-white text-opacity-80 mb-2`}>
            Informasi nomor antrian aktif di setiap loket pelayanan
          </p>
          <div className="flex align-items-center justify-content-center gap-2 text-white text-opacity-70">
            <i className="pi pi-sync animate-spin text-sm" />
            <span className="text-sm">Update otomatis setiap 2 detik</span>
          </div>
        </div>
        
        <Divider className="my-4" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
      </div>

      <div className={`flex-1 overflow-hidden ${config.containerPadding} pt-0 relative z-1`}>
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

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
          50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
        }
        
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
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
      cardPadding: 'p-3',
      containerPadding: 'p-3',
    });
  else if (width < 1024)
    Object.assign(config, {
      cols: Math.min(count, 2),
      headerSize: 'text-3xl',
      subtitleSize: 'text-base',
      numberSize: 'text-5xl',
      cardPadding: 'p-4',
      containerPadding: 'p-4',
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
      cardPadding: 'p-5',
      containerPadding: 'p-6',
    });

  return config;
}

const LoadingState = () => (
  <div className="flex flex-column align-items-center justify-content-center h-full">
    <div className="relative mb-4">
      <ProgressSpinner 
        style={{ width: '60px', height: '60px' }} 
        strokeWidth="3" 
        animationDuration="1s"
      />
      <div className="absolute inset-0 border-round-full border-2 border-white border-opacity-20 animate-pulse" />
    </div>
    <p className="text-xl text-white font-semibold mt-3 flex align-items-center gap-2">
      <i className="pi pi-spin pi-spinner" /> 
      Memuat data antrian...
    </p>
    <p className="text-white text-opacity-70 text-sm mt-2">
      Mohon tunggu sebentar
    </p>
  </div>
);

const EmptyState = () => (
  <div className="text-center h-full flex flex-column align-items-center justify-content-center">
    <div className="mb-4 p-4 border-round-full bg-white bg-opacity-10">
      <i className="pi pi-inbox text-5xl text-white text-opacity-70" />
    </div>
    <h3 className="text-2xl font-bold text-white mb-3">Tidak Ada Loket Tersedia</h3>
    <p className="text-white text-opacity-80 text-lg mb-3">
      Sistem sedang dalam pemeliharaan
    </p>
    <p className="text-white text-opacity-60">
      Silakan hubungi administrator untuk informasi lebih lanjut
    </p>
  </div>
);

export default MonitorAntrian;