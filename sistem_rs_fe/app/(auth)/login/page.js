"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "@/styles/gradient.css";
import ToastNotifier from "@/app/components/toastNotifier";

const URL = process.env.NEXT_PUBLIC_URL;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const toastRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${URL}/login`, { email, password });

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

      <div className="animated-gradient-bg w-full h-full flex justify-content-center align-items-center">
        <div className="card w-10 h-full md:h-30rem shadow-3">
          <div className="grid h-full">
            <div className="col-12 md:col-6 flex flex-col justify-center h-full px-4">
              <div>
                <h3 className="text-2xl text-center font-semibold mb-5">
                  {process.env.NEXT_PUBLIC_APP_NAME || "RUMAH SAKIT"}
                </h3>

                <form onSubmit={handleLogin} className="grid">
                  <div className="col-12">
                    <label htmlFor="email">Email</label>
                    <InputText
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full mt-3"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="password">Password</label>
                    <InputText
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full mt-3"
                      required
                    />
                  </div>

                  <div className="col-12 mt-3">
                    <Button type="submit" label="Login" className="w-full" />
                  </div>
                </form>
              </div>
            </div>

            <div className="hidden md:block md:col-6 h-full">
              <img
                src="/layout/images/hospital.jpg"
                className="w-full h-full object-cover"
                alt="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;