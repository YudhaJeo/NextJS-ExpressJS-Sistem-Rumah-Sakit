// app/(auth)/login/page.tsx
"use client";

import { useState, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React from "react";
import "@/styles/gradient.css";
import ToastNotifier, { ToastNotifierHandle } from '@/app/components/toastNotifier';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const toastRef = useRef<ToastNotifierHandle>(null); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:4000/login", {
        email,
        password,
      });

      Cookies.set("token", res.data.token);
      Cookies.set("username", res.data.username);

      toastRef.current?.showToast("00", "Login berhasil!"); 
      setTimeout(() => {
        router.push("/");
      }, 500); // durasi

    } catch (err) {
      toastRef.current?.showToast("01", "Login gagal. Email atau password salah."); 
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex justify-content-center align-items-center">

      {/* TOAST  */}
      <ToastNotifier ref={toastRef} />

      <div className="animated-gradient-bg w-full">
        <div className="card w-11/12 max-w-4xl md:h-30rem h-full">
          <div className="grid h-full">
            <div className="col-12 md:col-6 flex flex-col justify-center h-full px-4">
              <div>
                <img
                  src="/layout/images/logo.png"
                  style={{ maxWidth: "100%" }}
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
            </div>

            <div className="hidden md:block md:col-6 h-full">
              <img
                src="/layout/images/login.png"
                className="w-full h-full object-cover"
                alt="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
