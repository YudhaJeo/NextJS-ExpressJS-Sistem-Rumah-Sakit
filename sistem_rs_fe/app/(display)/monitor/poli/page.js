"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { ProgressSpinner } from "primereact/progressspinner";
import { Divider } from "primereact/divider";
import { useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || API_URL.replace("http", "ws");

function MonitorAntrianPoli() {
  const [poliList, setPoliList] = useState([]);
  const [antrianList, setAntrianList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [lastNoDipanggil, setLastNoDipanggil] = useState("");
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [time, setTime] = useState(null);
  
  const searchParams = useSearchParams();
  const zona = searchParams.get("zona");

  const toast = useRef(null);
  const ws = useRef(null);

  useEffect(() => {
    fetchData(true);
    const connectWebSocket = () => {
      ws.current = new WebSocket(`${WS_URL}`);
      ws.current.onopen = () => showToast("success", "WebSocket tersambung");
      ws.current.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.type === "update") fetchData(false);
        } catch {}
      };
      ws.current.onclose = () => setTimeout(connectWebSocket, 5000);
      ws.current.onerror = () => startPolling();
    };
    let pollingInterval = null;
    const startPolling = () => {
      if (!pollingInterval)
        pollingInterval = setInterval(() => fetchData(false), 2000);
    };
    connectWebSocket();
    return () => {
      ws.current?.close();
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem("lastPanggilan");
      if (!stored) return;
      const panggilan = JSON.parse(stored);
      if (!panggilan || panggilan.no === lastNoDipanggil) return;
      setLastNoDipanggil(panggilan.no);
      if (userHasInteracted) {
        const ding = new Audio("/sounds/opening.mp3");
        ding.play().catch(() => {});
        ding.onended = () => {
          const suara = new SpeechSynthesisUtterance();
          suara.lang = "id-ID";
          suara.text = `Nomor antrian ${panggilan.no
            .split("")
            .join(" ")}, silakan menuju loket ${panggilan.poli}`;
          suara.rate = 0.9;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(suara);
        };
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastNoDipanggil, userHasInteracted]);

  useEffect(() => {
    const updateTime = () => setTime(new Date());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () =>
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const fetchData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const [poliRes, antrianRes] = await Promise.all([
        axios.get(`${API_URL}/poli`),
        axios.get(`${API_URL}/antrianpoli/data`),
      ]);
      let filteredPoli = poliRes.data || [];
      if (zona) {
        filteredPoli = filteredPoli.filter(
          (p) => p.ZONA?.toLowerCase() === zona.toLowerCase()
        );
      }
      setPoliList(filteredPoli);
      setAntrianList(antrianRes.data.data || []);
    } catch {
      showToast("error", "Gagal memuat data");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const showToast = (severity, detail) => {
    toast.current?.show({
      severity,
      summary: severity === "error" ? "Error" : "Info",
      detail,
      life: 3000,
    });
  };

  const getNomorAntrianDipanggil = (namaPoli) => {
    const filtered = antrianList
      .filter((a) => a.POLI === namaPoli && a.STATUS === "Dipanggil")
      .sort((a, b) => b.ID - a.ID);
    return filtered?.[0]?.NO_ANTRIAN || "-";
  };

  const getResponsiveConfig = (screen, count) => {
    const width = screen.width;
    if (width < 768)
      return { cols: 1, numberSize: "2rem", containerPadding: "1rem" };
    if (width < 1024)
      return { cols: 2, numberSize: "2.5rem", containerPadding: "1rem" };
    if (width < 1440)
      return {
        cols: Math.min(count, 3),
        numberSize: "3rem",
        containerPadding: "1rem",
      };
    return {
      cols: Math.min(count, 4),
      numberSize: "3.5rem",
      containerPadding: "1rem",
    };
  };

  const getCardStyle = (index) => {
    const colors = [
      "#e8f5e9",
      "#e3f2fd",
      "#fffde7",
      "#fce4ec",
      "#ede7f6",
      "#fbe9e7",
    ];
    const borderColors = [
      "#66bb6a",
      "#42a5f5",
      "#fbc02d",
      "#ec407a",
      "#7e57c2",
      "#ff7043",
    ];
    const colorIndex = index % colors.length;
    return {
      backgroundColor: colors[colorIndex],
      borderLeft: `6px solid ${borderColors[colorIndex]}`,
      transition: "transform 0.3s, box-shadow 0.3s",
      cursor: "default",
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

  const config = getResponsiveConfig(screenSize, poliList.length);

  const getJumlahBelumDipanggil = (namaPoli) => {
    return antrianList.filter(
      (a) => a.POLI === namaPoli && a.STATUS === "Belum"
    ).length;
  };

  const renderCard = (poli, index) => {
    const currentNumber = getNomorAntrianDipanggil(poli.NAMAPOLI);
    const hasQueue = currentNumber !== "-";
    const isActive = poli.AKTIF !== false;

    return (
      <div key={index} className={`col-${12 / config.cols}`}>
        <Card
          header={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <i
                  className={`pi pi-circle-fill text-sm ${
                    isActive ? "text-green-500" : "text-red-500"
                  }`}
                />
                <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                  {poli.NAMAPOLI}
                </span>
              </div>
              <Tag
                value={hasQueue ? "Sedang Dipanggil" : "Kosong"}
                severity={hasQueue ? "info" : "warning"}
              />
            </div>
          }
          style={getCardStyle(index)}
        >
          <div style={{ textAlign: "center" }}>
            <small style={{ color: "#757575", fontWeight: "500" }}>
              Poli #{poli.IDPOLI}
            </small>

            <div
              style={{
                fontSize: "0.75rem",
                color: "#757575",
                margin: "0.5rem 0",
              }}
            >
              Nomor Antrian Saat Ini
            </div>
            <div
              style={{
                fontSize: config.numberSize,
                fontWeight: "bold",
                padding: "0.5rem",
                border: "2px dashed #ccc",
                borderRadius: "6px",
              }}
            >
              {currentNumber}
            </div>
            {hasQueue && (
              <div className="mt-2">
                <Badge
                  value="Dipanggil"
                  severity="info"
                  className="animate-pulse text-xs"
                />
              </div>
            )}

            <div style={{ marginTop: "0.5rem" }}>
              <Tag
                value={`Antrian Belum Dipanggil: ${getJumlahBelumDipanggil(
                  poli.NAMAPOLI
                )}`}
                severity="danger"
                className="text-xs"
              />
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden relative bg-white">
      <Toast ref={toast} position="top-right" />

      {!isFullScreen && (
        <div className="fixed bottom-4 right-4 z-[999]">
          <Button
            icon="pi pi-window-maximize"
            onClick={toggleFullScreen}
            rounded
            text
            severity="secondary"
            tooltip="Tampilkan Fullscreen"
            tooltipOptions={{ position: "left" }}
          />
        </div>
      )}

      {!userHasInteracted && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <Button
            label="Mulai Tampilkan Antrian"
            icon="pi pi-play"
            className="p-button-warning"
            onClick={() => setUserHasInteracted(true)}
          />
        </div>
      )}

      {/* Header */}
      <div className="text-black px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src="/layout/images/logo.png" alt="Logo" className="h-[50px]" />
          <h2 className="text-lg font-semibold text-black m-0">RUMAH SAKIT</h2>
        </div>
        <div className="font-bold text-sm">
          {time?.toLocaleString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      </div>

      <div className="bg-blue-100 py-3 overflow-hidden">
        <marquee
          behavior="scroll"
          direction="left"
          scrollamount="2"
          className="text-blue-900 font-semibold text-2xl"
        >
          Selamat datang di RSUD Bayza Medika • Harap menunggu dengan tertib • Gunakan masker • Jaga jarak • 
          Cuci tangan sebelum masuk ruangan • Antrian akan dipanggil sesuai urutan • Terima kasih atas kesabaran Anda 🙏
        </marquee>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 overflow-auto px-[${config.containerPadding}] pt-0`}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="4"
            />
            <p className="text-black font-medium mt-4 text-base">
              <i className="pi pi-spin pi-spinner mr-2" />
              Memuat data...
            </p>
          </div>
        ) : poliList.length === 0 ? (
          <div className="text-center h-full flex flex-col items-center justify-center">
            <i className="pi pi-inbox text-[2rem] text-black mb-4" />
            <h3 className="text-lg font-semibold text-black mb-2">
              Tidak Ada Loket Tersedia
            </h3>
            <p className="text-black">
              Silakan hubungi administrator untuk informasi lebih lanjut
            </p>
          </div>
        ) : (
          <div className="grid">{poliList.map(renderCard)}</div>
        )}
      </div>

      {/* Footer Statistik */}
      {!loading && poliList.length > 0 && (
        <div className={`px-[${config.containerPadding}] pt-2 shrink-0`}>
          <Divider />
          <div className="flex justify-center flex-wrap gap-8 text-center">
            <div className="flex flex-col items-center">
              <Tag
                value={poliList.filter((l) => l.AKTIF !== false).length}
                severity="success"
                className="text-base font-bold mb-1 px-3 py-2"
              />
              <span className="text-sm text-black">Loket Aktif</span>
            </div>
            <div className="flex flex-col items-center">
              <Tag
                value={
                  antrianList.filter((a) => a.STATUS === "Dipanggil").length
                }
                severity="info"
                className="text-base font-bold mb-1 px-3 py-2"
              />
              <span className="text-sm text-black">Antrian Dipanggil</span>
            </div>
            <div className="flex flex-col items-center">
              <Tag
                value={antrianList.filter((a) => a.STATUS === "Belum").length}
                severity="danger"
                className="text-base font-bold mb-1 px-3 py-2"
              />
              <span className="text-sm text-black">
                Antrian Belum Dipanggil
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Tag
                value={poliList.length}
                severity="warning"
                className="text-base font-bold mb-1 px-3 py-2"
              />
              <span className="text-sm text-black">Total Loket</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MonitorAntrianPoli;
