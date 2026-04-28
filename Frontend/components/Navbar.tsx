"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Asteroid } from "@/components/SpaceScene";
import Menu from "@/components/Menu";
import { FiSearch } from "react-icons/fi";

type NavbarProps = {
  asteroids: Asteroid[];
  onSelect: (asteroid: Asteroid) => void;
};

export default function Navbar({ asteroids, onSelect }: NavbarProps) {
  // estado menu
  const [openMenu, setOpenMenu] = useState(false);

  // estado buscador
  const [openSearch, setOpenSearch] = useState(false);

  // texto buscador
  const [search, setSearch] = useState("");

  // referencia input
  const inputRef = useRef<HTMLInputElement>(null);

  // filtra asteroides
  const filteredAsteroids = asteroids.filter((asteroid) =>
    asteroid.name.toLowerCase().includes(search.toLowerCase())
  );

  // busca asteroide
  const handleSearch = () => {
    const foundAsteroid = filteredAsteroids[0];

    if (foundAsteroid) {
      onSelect(foundAsteroid);
      setSearch("");
      setOpenSearch(false);
    }
  };

  // abrir buscador (MÓVIL)
  const handleOpenSearch = () => {
    setOpenSearch(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <>
      <nav className="navbar">
        {/* izquierda */}
        <div className="nav-left">
          <Image
            src="/icon/nasaIcon.png"
            alt="NASA logo"
            width={42}
            height={42}
            priority
          />

          <h1>NeoWs</h1>
        </div>

        {/* derecha */}
        <div className="nav-right">
          {/* buscador */}
          <div
            className={`search-box ${openSearch ? "search-open" : ""}`}
          >
            {/* icono lupa */}
            <FiSearch
              className="search-icon"
              onClick={handleOpenSearch}
            />

            <div className="search-wrapper">
              <input
                ref={inputRef}
                className="search-input"
                placeholder="Buscar"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setOpenSearch(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }

                  if (event.key === "Escape") {
                    setOpenSearch(false);
                    setSearch("");
                  }
                }}
                onBlur={() => {
                  // pequeño delay para permitir click en resultados
                  setTimeout(() => {
                    if (search.length === 0) {
                      setOpenSearch(false);
                    }
                  }, 200);
                }}
              />

              {/* resultados */}
              {openSearch && search.length > 0 && (
                <div className="search-results">
                  {filteredAsteroids.length === 0 && (
                    <button className="search-result-item" type="button">
                      Sin resultados
                    </button>
                  )}

                  {filteredAsteroids.slice(0, 8).map((asteroid) => (
                    <button
                      key={asteroid.id}
                      type="button"
                      className="search-result-item"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        onSelect(asteroid);
                        setSearch("");
                        setOpenSearch(false);
                      }}
                    >
                      {asteroid.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* menu */}
          <button
            type="button"
            className="menu-btn"
            onClick={() => setOpenMenu(true)}
          >
            <span>⋯</span>
            Menu
          </button>
        </div>
      </nav>

      {/* menu desplegable */}
      {openMenu && (
        <Menu
          asteroids={asteroids}
          isOpen={true} 
          onSelect={(asteroid) => {
            onSelect(asteroid);
            setOpenMenu(false);
          }}
          onClose={() => setOpenMenu(false)}
        />
      )}
    </>
  );
}