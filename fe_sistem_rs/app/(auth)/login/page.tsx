"use client";

import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:4000/login", {
        username,
        password,
      });

      Cookies.set("token", res.data.token);
      router.push("/dashboard");
      alert("Login berhasil!");
    } catch (err) {
      alert("Login gagal. Username atau password salah.");
      console.error("Login error:", err);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif", // ✅ Tambahkan ini
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #1e3c72, #2a5298)", // Biru gradasi
        padding: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#fff",
          borderRadius: "16px",
          overflow: "hidden",
          width: "100%",
          maxWidth: "960px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        {/* Form Section */}
        <div
          style={{
            flex: 1,
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            Sistem Rumah Sakit
          </h2>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="username" style={{ display: "block", marginBottom: "0.5rem" }}>
                Email
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem" }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#007BFF",
                color: "white",
                fontWeight: "bold",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              LOGIN
            </button>
          </form>
        </div>

        {/* Image Section */}
        <div style={{ flex: 1 }}>
          <img
            src="/login.png"
            alt="Login Banner"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
}
