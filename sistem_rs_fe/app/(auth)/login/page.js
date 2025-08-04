"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "@/styles/gradient.css";
import ToastNotifier from "@/app/components/toastNotifier";
import Image from "next/image";

const URL = process.env.NEXT_PUBLIC_URL;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const toastRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${URL}/login`, {
        email,
        password,
      });

      Cookies.set("token", res.data.token);
      Cookies.set("username", res.data.username);
      Cookies.set("role", res.data.role, { expires: 1 });
      Cookies.set("profile", res.data.profile, { expires: 1 });
      Cookies.set("unitKerja", res.data.unitKerja, { expires: 1 });

      if (toastRef.current) {
        toastRef.current.showToast("00", "Login berhasil!");
      }
      
      setTimeout(() => {
        switch (res.data.role) {
          case "dokter":
            router.push("/dashboard_dokter");
            break;
          case "perawat":
            router.push("/dashboard_perawat");
            break;
          case "admin":
            router.push("/dashboard_admin");
            break;
          case "superadmin":
            router.push("/");
            break;
          case "kasir":
            router.push("/dashboard_kasir");
            break;
          default:
            router.push("/");
        }
      }, 400);
    } catch (err) {
      if (toastRef.current) {
        toastRef.current.showToast(
          "01",
          "Login gagal. Email atau password salah."
        );
      }
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex justify-content-center align-items-center">
      <ToastNotifier ref={toastRef} />

      <div className="animated-gradient-bg w-full">
        <div className="card md:w-1/2 w-4/5 md:h-30rem h-full">
          <div className="grid h-full">
            <div className="col-12 md:col-6 gap-2 flex flex-col justify-between h-full w-full">
              <div className="w-1/2">
                <Image
                  src="/layout/images/logo.png"
                  width={80}
                  height={80}
                  style={{ maxWidth: "100%", height: "auto" }}
                  className="h-4rem md:h-5rem"
                  alt="logo"
                />

                <h3 className="text-2xl text-left font-semibold font-sans mt-2 mb-10">
                  RUMAH SAKIT
                </h3>

                <form onSubmit={handleLogin} className="grid">
                  <div className="col-12">
                    <label htmlFor="email">Email</label>
                    <InputText
                      id="email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full mt-3"
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="password">Password</label>
                    <InputText
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full mt-3"
                    />
                  </div>

                  <div className="col-12 mt-3">
                    <Button label="login" className="w-full" />
                  </div>
                </form>
              </div>

              <div className="hidden md:block h-full overflow-hidden w-1/2">
                <div className="w-full h-full">
                  <Image
                    src="/layout/images/hospital.jpg"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover scale-[1.2]"
                    alt="cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;