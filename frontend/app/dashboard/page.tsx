"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const token = Cookies.get("token");
      console.log("Token:", token); // debug

      const res = await axios.get("http://localhost:4000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user);
    } catch (err) {
      console.error("Error fetching profile:", err);
      router.push("/login");
    }
  };

  const handleLogout = () => {
    Cookies.remove("token"); // hapus token
    setUser(null);            // reset user
    router.replace("/login"); // pakai replace agar tidak bisa tekan back kembali ke dashboard
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <>
          <p>Welcome, {user.username}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
}
