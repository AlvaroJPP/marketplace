import "./login.css";

export default function LoginLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <main className="login-wrapper">
          {children}
        </main>
      </body>
    </html>
  );
}