"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, useGLTF } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { getAsteroids } from "@/lib/nasaApi";

// tipo del asteroide
export type Asteroid = {
  // identificador unico
  id: string;
  // nombre visible
  name: string;
  // magnitud absoluta
  absoluteMagnitudeH: number;
  // indica peligro
  isPotentiallyHazardous: boolean;
  // diametro estimado
  estimatedDiameter: {
    meters: {
      // valor minimo
      min: number;
      // valor maximo
      max: number;
    };
  };
  // datos aproximacion
  closeApproach: {
    // distancia aproximada
    missDistanceKm: string;
    // velocidad aproximada
    velocityKmH: string;
  };
};

// objeto tierra seleccionable
export const EARTH_OBJECT: Asteroid = {
  id: "earth",
  name: "La Tierra",
  absoluteMagnitudeH: 0,
  isPotentiallyHazardous: false,
  estimatedDiameter: {
    meters: {
      min: 0,
      max: 0,
    },
  },
  closeApproach: {
    missDistanceKm: "0",
    velocityKmH: "0",
  },
};

// propiedades de escena
type SpaceSceneProps = {
  // asteroide seleccionado
  selectedAsteroid: Asteroid | null;
  // cambia seleccion
  onSelectAsteroid: (asteroid: Asteroid | null) => void;
  // envia asteroides cargados
  onAsteroidsLoaded?: (asteroids: Asteroid[]) => void;
};

// calcula posicion orbital
function getAsteroidPosition(index: number): THREE.Vector3 {
  const angle = index * 0.8;
  const radius = 5 + (index % 6) * 0.8;

  return new THREE.Vector3(
    Math.cos(angle) * radius,
    Math.sin(index * 1.3) * 1.5,
    Math.sin(angle) * radius
  );
}

// desactiva seleccion modelo
function disableRaycast(object: THREE.Object3D) {
  object.traverse((child) => {
    child.raycast = () => {};
  });
}

// controla enfoque camara
function CameraFocusController({ target }: { target: THREE.Vector3 }) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const activeRef = useRef(true);

  useEffect(() => {
    activeRef.current = true;
  }, [target.x, target.y, target.z]);

  useFrame(() => {
    if (!activeRef.current) return;

    const offset =
      target.length() < 0.1
        ? new THREE.Vector3(0, 0.8, 4.2)
        : new THREE.Vector3(1.4, 0.9, 1.8);

    const desiredPosition = target.clone().add(offset);

    camera.position.lerp(desiredPosition, 0.045);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(target, 0.055);
      controlsRef.current.update();
    } else {
      camera.lookAt(target);
    }

    const targetDistance =
      controlsRef.current?.target.distanceTo(target) ?? 0;

    if (
      camera.position.distanceTo(desiredPosition) < 0.05 &&
      targetDistance < 0.05
    ) {
      activeRef.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableRotate
      enableZoom
      enablePan
      rotateSpeed={0.6}
      zoomSpeed={0.7}
      panSpeed={0.5}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
    />
  );
}

// renderiza la tierra
function Earth({ onSelectEarth }: { onSelectEarth: () => void }) {
  const { scene } = useGLTF("/models/earth.glb");
  const ref = useRef<THREE.Group>(null);

  const earthScene = useMemo(() => {
    const clone = scene.clone(true);

    disableRaycast(clone);

    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());

    clone.position.sub(center);

    return clone;
  }, [scene]);


  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={ref} scale={0.1}>
      <primitive object={earthScene} />

      {/* zona click invisible */}
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelectEarth();
        }}
      >
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

// renderiza brillo terrestre
function EarthGlow() {
  return (
    <mesh scale={1.18}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial
        color="#2f80ff"
        transparent
        opacity={0.18}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

// renderiza sol

function Sun() {
  const { scene } = useGLTF("/models/sun.glb");
  const ref = useRef<THREE.Group>(null);

  const sunScene = useMemo(() => {
    const clone = scene.clone(true);

    disableRaycast(clone);

    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());

    clone.position.sub(center);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        mesh.material = new THREE.MeshBasicMaterial({
          color: "#ffb300",
          fog: false,
        });
      }
    });

    return clone;
  }, [scene]);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0004;
    }
  });

  return (
    <group ref={ref} position={[35, 8, 28]} scale={0.05}>
      <pointLight color="#ffb300" intensity={8} distance={164} />
      <primitive object={sunScene} />

      <mesh scale={2.4}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ff6a6a"
          transparent
          opacity={0.18}
          fog={false}
        />
      </mesh>
    </group>
  );
}


// renderiza modelo asteroide
function AsteroidModel({
  asteroid,
  index,
  onSelect,
}: {
  // datos del asteroide
  asteroid: Asteroid;
  // indice visual
  index: number;
  // selecciona asteroide
  onSelect: (asteroid: Asteroid) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const modelPath =
    index % 2 === 0 ? "/models/asteroid1.glb" : "/models/asteroid2.glb";

  const { scene } = useGLTF(modelPath);
  const ref = useRef<THREE.Group>(null);

  const asteroidScene = useMemo(() => {
    const clone = scene.clone(true);

    disableRaycast(clone);

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        mesh.material = new THREE.MeshStandardMaterial({
          color: asteroid.isPotentiallyHazardous ? "#705a4a" : "#4f4f4f",
          roughness: 0.95,
          metalness: 0.05,
        });
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    clone.position.sub(center);

    const maxAxis = Math.max(size.x, size.y, size.z);

    if (maxAxis > 0) {
      clone.scale.setScalar(1 / maxAxis);
    }

    return clone;
  }, [scene, asteroid.isPotentiallyHazardous]);

  const position = getAsteroidPosition(index);
  const asteroidSize = asteroid.isPotentiallyHazardous ? 0.7 : 0.45;

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.0015;
      ref.current.rotation.y += 0.001;
    }
  });

  return (
    <group
      ref={ref}
      position={position}
      scale={hovered ? asteroidSize * 1.25 : asteroidSize}
    >
      <primitive object={asteroidScene} />

      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(asteroid);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1.25, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

// agrupa asteroides
function AsteroidsGroup({
  onSelectAsteroid,
  onAsteroidsLoaded,
}: {
  // selecciona asteroide
  onSelectAsteroid: (asteroid: Asteroid) => void;
  // envia datos cargados
  onAsteroidsLoaded?: (asteroids: Asteroid[]) => void;
}) {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const onAsteroidsLoadedRef = useRef(onAsteroidsLoaded);

  useEffect(() => {
    onAsteroidsLoadedRef.current = onAsteroidsLoaded;
  }, [onAsteroidsLoaded]);

  useEffect(() => {
    getAsteroids()
      .then((data) => {
        const loadedAsteroids: Asteroid[] = data.items?.slice(0, 20) ?? [];
        setAsteroids(loadedAsteroids);
        onAsteroidsLoadedRef.current?.(loadedAsteroids);
      })
      .catch((error) => {
        console.log("Error cargando asteroides:", error);
        setAsteroids([]);
        onAsteroidsLoadedRef.current?.([]);
      });
  }, []);

  return (
    <>
      {asteroids.map((asteroid, index) => (
        <AsteroidModel
          key={asteroid.id}
          asteroid={asteroid}
          index={index}
          onSelect={onSelectAsteroid}
        />
      ))}
    </>
  );
}

// renderiza escena espacial
export default function SpaceScene({
  selectedAsteroid,
  onSelectAsteroid,
  onAsteroidsLoaded,
}: SpaceSceneProps) {
  const [loadedAsteroids, setLoadedAsteroids] = useState<Asteroid[]>([]);

  const focusTarget = useMemo(() => {
    if (!selectedAsteroid) {
      return new THREE.Vector3(0, 0, 0);
    }

    const asteroidIndex = loadedAsteroids.findIndex(
      (asteroid) => asteroid.id === selectedAsteroid.id
    );

    if (asteroidIndex === -1) {
      return new THREE.Vector3(0, 0, 0);
    }

    return getAsteroidPosition(asteroidIndex);
  }, [selectedAsteroid, loadedAsteroids]);

  const handleAsteroidsLoaded = (asteroids: Asteroid[]) => {
    setLoadedAsteroids(asteroids);
    onAsteroidsLoaded?.(asteroids);
  };

  return (
    <Canvas
      camera={{ position: [0, 0.8, 4.2] }}
      style={{
        width: "100vw",
        height: "100vh",
        background: "black",
        display: "block",
      }}
    >
      <color attach="background" args={["black"]} />
      <fog attach="fog" args={["#000000", 8, 28]} />

      <ambientLight intensity={0.08} />

      <directionalLight
        position={[8, 3, 6]}
        intensity={2.8}
        color="#ffffff"
      />

      <pointLight position={[-6, -3, -8]} intensity={0.4} color="#2f6bff" />

      <Stars
        radius={120}
        depth={70}
        count={7000}
        factor={4.5}
        saturation={0}
        fade
      />

      <EarthGlow />
      
      <Earth onSelectEarth={() => onSelectAsteroid(EARTH_OBJECT)} />

      <Sun />

      <AsteroidsGroup
        onSelectAsteroid={onSelectAsteroid}
        onAsteroidsLoaded={handleAsteroidsLoaded}
      />

      <CameraFocusController target={focusTarget} />
    </Canvas>
  );
}

useGLTF.preload("/models/earth.glb");
useGLTF.preload("/models/asteroid1.glb");
useGLTF.preload("/models/asteroid2.glb");
useGLTF.preload("/models/sun.glb");