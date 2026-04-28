"use client";
import React, { useEffect, useState } from "react";

// Configuración de tipos para evitar errores de TypeScript con etiquetas personalizadas
declare namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }

  
/**
 * COMPONENTE VISOR 3D (MODEL VIEWER)
 * Recibe 'src' (URL del archivo .glb) y 'alt' (texto alternativo)
 */
export default function ModelViewer3D({ src, alt }: { src: string, alt?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Importamos el script de model-viewer solo en el cliente
    import("@google/model-viewer").then(() => setMounted(true));
  }, []);

  // Si aún no está montado (SSR), no renderizamos nada para evitar errores
  if (!mounted) return <div className="h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Cargando 3D...</div>;

  return (
    <div className="w-full h-80 bg-gray-50 rounded-xl overflow-hidden shadow-inner">
      <model-viewer
        src={src}
        alt={alt || "Modelo 3D"}
        auto-rotate
        camera-controls
        ar
        style={{ width: "100%", height: "100%" }}
      ></model-viewer>
    </div>
  );
}
