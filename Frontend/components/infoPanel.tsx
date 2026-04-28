"use client";

import type { Asteroid } from "@/components/SpaceScene";

interface Props {
  // objeto seleccionado actual
  selected: Asteroid | null;

  // cierra el panel
  onClose: () => void;
}

// descripcion fija de la tierra
const EARTH_DESCRIPTION = `La Tierra, nuestro planeta, es el único lugar que conocemos hasta ahora habitado por seres vivos. También es el único planeta de nuestro sistema solar con agua líquida en su superficie.
La Tierra es el quinto planeta más grande del sistema solar, apenas un poco mayor que Venus, que se encuentra cerca. Es el mayor de los cuatro planetas más cercanos al Sol, todos ellos compuestos de roca y metal. La NASA es la agencia espacial con más misiones operando en nuestro planeta. El Sistema de Observación de la Tierra (EOS) de la NASA es una serie coordinada de satélites en órbita polar y de baja inclinación para la observación global a largo plazo de la superficie terrestre, la biosfera, la Tierra sólida, la atmósfera y los océanos.`;

// panel de informacion
export default function InfoPanel({ selected, onClose }: Props) {
  if (!selected) return null;

  // verifica si es tierra
  const isEarth = selected.id === "earth";

  // renderiza panel tierra
  if (isEarth) {
    return (
      <aside className="info-panel">
        <button className="info-close" type="button" onClick={onClose}>
          ×
        </button>

        <p className="info-kicker">Planeta</p>

        <h2>{selected.name}</h2>

        <p>{EARTH_DESCRIPTION}</p>
      </aside>
    );
  }

  // datos de aproximacion
  const approach = selected.closeApproach;

  // diametro minimo
  const diameterMin = selected.estimatedDiameter?.meters?.min ?? 0;

  // diametro maximo
  const diameterMax = selected.estimatedDiameter?.meters?.max ?? 0;

  // velocidad formateada
  const velocity = Number(approach?.velocityKmH ?? 0).toLocaleString("es-CO");

  // distancia formateada
  const distance = Number(approach?.missDistanceKm ?? 0).toLocaleString(
    "es-CO"
  );

  return (
    <aside className="info-panel">
      <button className="info-close" type="button" onClick={onClose}>
        ×
      </button>

      <p className="info-kicker">NASA NeoWs Object</p>

      <h2>{selected.name}</h2>

      <p>
        <strong>Magnitud:</strong> {selected.absoluteMagnitudeH}
      </p>

      <p>
        <strong>Diámetro:</strong> {diameterMin.toFixed(2)} m -{" "}
        {diameterMax.toFixed(2)} m
      </p>

      <p>
        <strong>Velocidad:</strong> {velocity} km/h
      </p>

      <p>
        <strong>Distancia:</strong> {distance} km
      </p>

      <p
        className={
          selected.isPotentiallyHazardous ? "danger-text" : "safe-text"
        }
      >
        {selected.isPotentiallyHazardous
          ? "⚠ Potencialmente peligroso"
          : "✓ No potencialmente peligroso"}
      </p>
    </aside>
  );
}