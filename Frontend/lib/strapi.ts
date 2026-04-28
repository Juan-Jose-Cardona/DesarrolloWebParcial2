const BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

/** 
 * Función sencilla para obtener datos de Strapi cada vez que se refresca la página.
 * @param path - La ruta del endpoint de Strapi (ej: /api/home-page)
 */
export async function getStrapiData(path: string) {
  const url = `${BASE_URL}${path}`;
  
  console.log(`📡 Fetching from Strapi: ${url}`);

  try {
    const response = await fetch(url, {
      // Con 'no-store' le decimos a Next.js que NO guarde nada en caché, 
      // para que siempre pida los datos frescos de Strapi al recargar.
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`❌ Fetch failed: ${response.status} ${response.statusText}`);
      throw new Error(`Error fetching data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("⚠️ Error en getStrapiData:", error);
    return null;
  }
}