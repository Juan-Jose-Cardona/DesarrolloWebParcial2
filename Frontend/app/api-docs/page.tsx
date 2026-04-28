import { getStrapiData } from "@/lib/strapi";

export default async function ApiStatusPage(){

    const endpoint = "/api.productos";
    const data = await getStrapiData(endpoint);

    return(

        <main>
        <h1> estado de conexión </h1>
        <div>
        <span> Conectado a Strapi: http://localhost:1337/ </span>
        </div>

        <h2> respuesta endpoint </h2>

        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>

        <p> esta pagina se genera dinamicamente consultando tu backend </p>



        </main>

    );

}
