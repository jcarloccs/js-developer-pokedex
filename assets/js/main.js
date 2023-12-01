const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const containerModal = document.getElementById('container-modal');

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li id="${pokemon.number}" class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function convertPokemonDetails(pokemon) {
    return `
    <div id="modal" class="${pokemon.types[0]}">
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.photo}" alt="${pokemon.name}">
        <ul>
            <li>Number: <span class="descriptions">${pokemon.number}</span></li>
            <li>Weight: <span class="descriptions">${pokemon.weight}</span></li>
            <li>Height: <span class="descriptions">${pokemon.height}</span></li>
            <li>Types: <span class="descriptions">${pokemon.types.map((type) => `${type} `).join(', ')}</span></li>
            <li>Abilities: <span class="descriptions">${pokemon.abilities.map((ability) => `${ability}`).join(', ')}</span></li>
        </ul>
        <button onclick="closeModal()">Close</button>
    </div>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
        const poke = document.querySelectorAll('.pokemon')
        poke.forEach((x) => {
            x.addEventListener('click', async (e) => {
                pokeApi.getOnePokemon(e.currentTarget.id)
                    .then(convertPokemonDetails)
                    .then((detalhes) => {
                        containerModal.innerHTML = detalhes
                        openModal()
                    })
            })
        })
    })

}


function openModal() {
    containerModal.style.display = 'block';
}
function closeModal() {
    containerModal.style.display = 'none';
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})