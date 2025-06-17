export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <div style={{ border: "1px solid #ccc", padding: "2rem", borderRadius: "8px", minWidth: "300px" }}>
            <h2>Login</h2>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
