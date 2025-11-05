"use client";

import Link from "next/link";
import { classNames } from "primereact/utils";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import { LayoutContext } from "./context/layoutcontext";
import Cookies from "js-cookie";
import { Avatar } from "primereact/avatar";
import axios from "axios";

const AppTopbar = forwardRef((props, ref) => {
  const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
    useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);

  // === State ===
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [profile, setProfile] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const MINIO_URL = process.env.NEXT_PUBLIC_MINIO_URL;

  // === Fetch Profil RS ===
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

  // === Ambil cookies user ===
  useEffect(() => {
    const name = Cookies.get("username");
    if (name) setUsername(name);

    const roleData = Cookies.get("role");
    if (roleData) setRole(roleData);

    const profileData = Cookies.get("profile");
    if (profileData && profileData !== "null" && profileData !== "undefined") {
      setProfile(profileData);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));

  // === Render data RS ===
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
    <div className="layout-topbar">
      <Link href="/" className="layout-topbar-logo flex align-items-center gap-2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Logo RS"
            className="border-circle w-3rem h-3rem object-cover shadow-1"
          />
        ) : (
          <div className="w-3rem h-3rem border-circle surface-100 flex align-items-center justify-content-center shadow-1">
            <span className="pi pi-hospital text-lg text-500"></span>
          </div>
        )}
        <span className="font-bold text-lg">{profile_rs.NAMARS}</span>
      </Link>

      <button
        ref={menubuttonRef}
        type="button"
        className="p-link layout-menu-button layout-topbar-button"
        onClick={onMenuToggle}
      >
        <i className="pi pi-bars" />
      </button>

      <button
        ref={topbarmenubuttonRef}
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={showProfileSidebar}
      >
        <i className="pi pi-ellipsis-v" />
      </button>

      <div
        ref={topbarmenuRef}
        className={classNames("layout-topbar-menu", {
          "layout-topbar-menu-mobile-active": layoutState.profileSidebarVisible,
        })}
      >
        <p className="text-base md:text-xl font-medium text-right flex flex-col">
          <span>{username}</span>
          {role && <span className="text-sm text-right text-gray-400">{role}</span>}
        </p>

        <Link href="/profile">
          <button type="button" className="p-link layout-topbar-button">
            <Avatar
              image={
                profile && profile !== "null" && profile !== "undefined"
                  ? profile
                  : undefined
              }
              icon={
                !profile || profile === "null" || profile === "undefined"
                  ? "pi pi-user"
                  : undefined
              }
              className="topbar-avatar"
              size="xlarge"
              shape="circle"
              style={{
                objectFit: "cover",
                width: "3rem",
                height: "3rem",
                background: "transparent",
              }}
              onImageError={(e) => {
                e.target.src = "";
                e.target.classList.add("pi", "pi-user");
              }}
            />
            <span>Profile</span>
          </button>
        </Link>
      </div>
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";
export default AppTopbar;
