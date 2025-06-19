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
    e.preventDefault(); // Mencegah reload halaman

    try {
      // Kirim request login ke backend
      const res = await axios.post("http://localhost:4000/login", {
        username,
        password,
      });

      // Simpan token ke cookie
      Cookies.set("token", res.data.token);

      // Redirect ke halaman dashboard
      router.push("/dashboard");
    } catch (err) {
      alert("Login gagal. Username atau password salah.");
      console.error("Login error:", err);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f5f5f5",
    }}>
      <form
        onSubmit={handleLogin}
        style={{
          padding: "2rem",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          minWidth: "300px"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.5rem",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
