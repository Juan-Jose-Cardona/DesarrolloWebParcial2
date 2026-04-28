const API_URL = "http://localhost:1337/api/nasa";

export async function getAsteroids() {
  const res = await fetch(
    `${API_URL}/asteroids/feed?start_date=2026-04-21&end_date=2026-04-22`
  );

  if (!res.ok) {
    throw new Error("Error cargando asteroides");
  }

  return res.json();
}