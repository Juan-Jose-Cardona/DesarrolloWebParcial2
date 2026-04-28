import "./globals.css";

// metadata de la app
export const metadata = {
  title: "NASA Asteroids",
  description: "NeoWs Visualization",
};

// layout principal aplicacion
export default function RootLayout({
  children,
}: {
  // contenido dinamico paginas
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* fuente externa inter */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>{children}</body>
    </html>
  );
}