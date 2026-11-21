import "@fontsource-variable/inter";
import "./globals.css";

export const metadata = {
  title: {
    default: "Vinculación Universitaria",
    template: "%s | Vinculación Universitaria",
  },
  description:
    "Plataforma de vinculación entre estudiantes universitarios y empresas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
