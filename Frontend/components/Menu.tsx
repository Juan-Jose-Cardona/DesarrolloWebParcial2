/*

Autores: Victor Manuel Pedroza
        Juan Jose Cardona Serna

        Desarrollo Web

*/


"use client";

import type { Asteroid } from "@/components/SpaceScene";

type MenuProps = {
  // lista completa asteroides
  asteroids: Asteroid[];

  // estado del menu
  isOpen: boolean;

  // cierra el menu
  onClose: () => void;

  // selecciona asteroide
  onSelect: (asteroid: Asteroid) => void;
};

// componente menu overlay
export default function Menu({
  asteroids,
  isOpen,
  onClose,
  onSelect,
}: MenuProps) {
  if (!isOpen) return null;

  // filtra asteroides peligrosos
  const hazardousAsteroids = asteroids.filter(
    (asteroid) => asteroid.isPotentiallyHazardous
  );

  // filtra asteroides seguros
  const safeAsteroids = asteroids.filter(
    (asteroid) => !asteroid.isPotentiallyHazardous
  );

  // divide lista segura
  const middleIndex = Math.ceil(safeAsteroids.length / 2);

  // primera mitad segura
  const nearEarthAsteroids = safeAsteroids.slice(0, middleIndex);

  // segunda mitad segura
  const otherAsteroids = safeAsteroids.slice(middleIndex);

  // maneja seleccion
  const handleSelect = (asteroid: Asteroid) => {
    onSelect(asteroid);
    onClose();
  };

  return (
    <div className="menu-overlay">
      {/* boton cerrar */}
      <button type="button" className="menu-close" onClick={onClose}>
        ×
      </button>

      <div className="menu-content">
        {/* columna cercanos */}
        <div className="menu-column">
          <h3>Cercanos a la Tierra</h3>

          {nearEarthAsteroids.map((asteroid) => (
            <button
              key={asteroid.id}
              type="button"
              className="menu-item"
              onClick={() => handleSelect(asteroid)}
            >
              {asteroid.name}
            </button>
          ))}
        </div>

        {/* columna otros */}
        <div className="menu-column">
          <h3>Otros Asteroides</h3>

          {otherAsteroids.map((asteroid) => (
            <button
              key={asteroid.id}
              type="button"
              className="menu-item"
              onClick={() => handleSelect(asteroid)}
            >
              {asteroid.name}
            </button>
          ))}
        </div>

        {/* columna peligrosos */}
        <div className="menu-column menu-column-border">
          <h3>Con Mayor Riesgo</h3>

          {hazardousAsteroids.map((asteroid) => (
            <button
              key={asteroid.id}
              type="button"
              className="menu-item"
              onClick={() => handleSelect(asteroid)}
            >
              ⚠ {asteroid.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}