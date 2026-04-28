"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Asteroid } from "@/components/SpaceScene";

type BuscadorProps = {
  // lista de asteroides
  asteroids: Asteroid[];

  // selecciona asteroide
  onSelect: (asteroid: Asteroid) => void;
};

// componente buscador principal
export default function Buscador({ asteroids, onSelect }: BuscadorProps) {
  // texto del input
  const [query, setQuery] = useState("");

  // estado del dropdown
  const [open, setOpen] = useState(false);

  // referencia contenedor buscador
  const searchRef = useRef<HTMLDivElement>(null);

  // detecta click fuera
  useEffect(() => {
    // cierra si click externo
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // filtra lista asteroides
  const filteredAsteroids = useMemo(() => {
    const text = query.trim().toLowerCase();

    if (!text) return asteroids.slice(0, 8);

    return asteroids
      .filter((asteroid) => asteroid.name.toLowerCase().includes(text))
      .slice(0, 8);
  }, [asteroids, query]);

  // maneja seleccion resultado
  const handleSelect = (asteroid: Asteroid) => {
    onSelect(asteroid);
    setQuery(asteroid.name);
    setOpen(false);
  };

  return (
    <div className="search-wrapper" ref={searchRef}>
      <div className="search-box">
        <Image
          src="/icon/searchIcon.png"
          alt="Buscar"
          width={25}
          height={25}
        />

        <input
          className="search-input"
          type="text"
          placeholder="Buscar"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </div>

      {open && filteredAsteroids.length > 0 && (
        <div className="search-results">
          {filteredAsteroids.map((asteroid) => (
            <button
              key={asteroid.id}
              type="button"
              className="search-result-item"
              onClick={() => handleSelect(asteroid)}
            >
              {asteroid.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}