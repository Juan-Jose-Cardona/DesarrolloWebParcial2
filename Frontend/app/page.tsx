"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import SpaceScene, { Asteroid } from "@/components/SpaceScene";
import Navbar from "@/components/Navbar";
import InfoPanel from "@/components/infoPanel";

// pagina principal app
export default function Page() {
  // posicion del cursor
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // lista de asteroides
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);

  // asteroide seleccionado
  const [selectedAsteroid, setSelectedAsteroid] =
    useState<Asteroid | null>(null);

  // estado de carga
  const [loading, setLoading] = useState(true);

  // estado de error
  const [error, setError] = useState("");

  // detecta movimiento mouse
  useEffect(() => {
    // actualiza posicion cursor
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // recupera ultimo asteroide
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedAsteroid = localStorage.getItem("lastAsteroid");

      if (savedAsteroid) {
        setSelectedAsteroid(JSON.parse(savedAsteroid));
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // selecciona asteroide
  const focusAsteroid = (asteroid: Asteroid | null) => {
    setSelectedAsteroid(asteroid);

    if (asteroid) {
      localStorage.setItem("lastAsteroid", JSON.stringify(asteroid));
    } else {
      localStorage.removeItem("lastAsteroid");
    }
  };

  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflowX: "hidden",
        overflowY: "hidden",
      }}
    >
      {/* barra navegacion */}
      <Navbar asteroids={asteroids} onSelect={focusAsteroid} />

      {/* panel informacion */}
      <InfoPanel
        selected={selectedAsteroid}
        onClose={() => focusAsteroid(null)}
      />

      {/* escena 3d principal */}
      <SpaceScene
        selectedAsteroid={selectedAsteroid}
        onSelectAsteroid={focusAsteroid}
        onAsteroidsLoaded={(loadedAsteroids) => {
          setAsteroids(loadedAsteroids);
          setLoading(false);

          if (loadedAsteroids.length === 0) {
            setError("No se pudieron cargar los asteroides");
          } else {
            setError("");
          }
        }}
      />

      {/* mensaje carga */}
      {loading && (
        <div className="status-card">Cargando datos de NASA...</div>
      )}

      {/* mensaje error */}
      {error && !loading && (
        <div className="status-card error-card">{error}</div>
      )}

      {/* cursor personalizado */}
      <Image
        src="/icon/satelliteIcon.png"
        alt="satellite cursor"
        width={42}
        height={42}
        style={{
          position: "fixed",
          left: mouse.x,
          top: mouse.y,
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
        }}
      />
    </main>
  );
}