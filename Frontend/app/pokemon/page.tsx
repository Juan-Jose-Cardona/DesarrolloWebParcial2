/* conexión pagina de pokemon */

import Image from "next/image";




export default async function pokemonPage() {
    
    /* obtener los daros de la api */

    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20")

    const data = await response.json();

    /* detalles del pokemon  */

    const pokemonList = await Promise.all (

        data.results.map(async (p: any) => {
            const res = await fetch (p.url)
            return res.json()
        })

    );

    return(

        <main>
            <h1> pokedex </h1>
            <p> Datos de la pole Abril </p>

            {/* grid pokemon */}

            <div>
                {pokemonList.map((pokemon: any) => (
                    <div key = {pokemon.id}>
                        <div>
                            <img 
                            src={pokemon.sprites.other["official-artwork"].front_defauñt}
                            alt = {pokemon.name}
                            className= ""
                            />
                        </div>
                        <span>
                            #{pokemon.id.toString().padStart(3, '0')}
                        </span>
                        <h3>{pokemon.name}</h3>

                        <div>
                            {pokemon.types.map((t: any) => (
                                <span key = {t.type.name}></span>
                            ))}
                        </div>

                    </div>
                ))}

                
            </div>

        </main>

    )

}