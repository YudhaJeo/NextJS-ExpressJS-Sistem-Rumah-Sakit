// "use client";

// import { AppSidebar } from "./components/AppSidebar";
// import { AppTopbar } from "./components/AppTopbar";
// import { AppFooter } from "./components/AppFooter";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";

// export default function Layout({ children }: { children: React.ReactNode }) {
//   const router = useRouter();

//   useEffect(() => {
//     const token = Cookies.get("token");
//     if (!token) router.push("/login");
//   }, []);

//   return (
//     <div className="flex flex-col min-h-screen">
//       <AppTopbar />
//       <div className="flex flex-grow">
//         <AppSidebar />
//         <main className="flex-grow p-4 bg-gray-50">{children}</main>
//       </div>
//       <AppFooter />
//     </div>
//   );
// }
