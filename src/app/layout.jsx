import "@fontsource-variable/inter";
import "./globals.css";

export const metadata = {
  title: {
    default: "ConectU",
    template: "%s | ConectU",
  },
  description:
    "ConectU: plataforma de vinculación entre estudiantes universitarios y empresas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
