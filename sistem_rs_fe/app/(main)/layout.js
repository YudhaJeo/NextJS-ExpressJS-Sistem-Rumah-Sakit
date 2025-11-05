// app/(main)/layout.js
import Layout from "../../layout/layout";

export async function generateMetadata() {
  try {
    const res = await fetch(`${process.env.API_URL}/profile_mobile`, {
      cache: "no-store",
    });
    const data = await res.json();
    const name = data?.data?.NAMARS || "Memuat...";

    return {
      title: name,
      icons: {
        icon: "/favicon.ico",
      },
    };
  } catch {
    return {
      title: "Rumah Sakit",
      icons: {
        icon: "/favicon.ico",
      },
    };
  }
}

export default function AppLayout({ children }) {
  return <Layout>{children}</Layout>;
}