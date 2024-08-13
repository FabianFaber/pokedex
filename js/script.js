const LIMIT = 1024;
const BATCH_SIZE = 20;
const allPokemon = [];
let fetchPromises = [];
let currentBatch = 0;
let currentPokemonIndex = 0;

async function fetchData(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

function loadPokemon() {
    for (let i = 1; i <= LIMIT; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}/`;
        fetchPromises.push(fetchData(url));
    }

    Promise.all(fetchPromises).then(results => {
        results.forEach(pokemon => {
            if (pokemon) {
                allPokemon.push(pokemon);
            }
        });

        allPokemon.sort((a, b) => a.id - b.id);
        renderBatch(currentBatch);
    });
}

function renderPokemon(index) {
    if (allPokemon[index]) {
        let content = document.getElementById('content');
        content.innerHTML += renderShow(index);
    }
}

function renderPokemon(index) {
    if (allPokemon[index]) {
        let content = document.getElementById('content');
        if (content) {
            content.innerHTML += renderShow(index);
        } else {
            console.error("Content element not found");
        }
    }
}

function showPopup(index) {
    currentPokemonIndex = index;
    let popup = document.getElementById('pokemonPopup');
    let popupDetails = document.getElementById('popupDetails');
    let body = document.querySelector('body');

    if (popup && popupDetails && body && allPokemon[index]) {
        popupDetails.innerHTML = renderShowDetails(index);
        popup.classList.remove('hidden');
        body.classList.add('popup-open');
    } else {
        console.error("Popup elements or body not found, or Pokémon data is missing");
    }
}

function closePopup() {
    let popup = document.getElementById('pokemonPopup');
    let body = document.querySelector('body');

    popup.classList.add('hidden');
    body.classList.remove('popup-open');
}

function renderBatch(batch) {
    let start = batch * BATCH_SIZE;
    let end = start + BATCH_SIZE;
    for (let i = start; i < end && i < allPokemon.length; i++) {
        renderPokemon(i);
    }
}

function showPreviousPokemon(index) {
    const batchSize = BATCH_SIZE;
    const startIndex = Math.floor(index / batchSize) * batchSize;
    const endIndex = startIndex + batchSize - 1;

    if (index > startIndex) {
        closePopup();
        showPopup(index - 1);
        currentPokemonIndex = index - 1;
    } else {
        closePopup();
        showPopup(endIndex);
        currentPokemonIndex = endIndex;
    }
}

function showNextPokemon(index) {
    const batchSize = BATCH_SIZE;
    const startIndex = Math.floor(index / batchSize) * batchSize;
    const endIndex = startIndex + batchSize - 1;

    if (index < endIndex) {
        closePopup();
        showPopup(index + 1);
        currentPokemonIndex = index + 1;
    } else {
        closePopup();
        showPopup(startIndex);
        currentPokemonIndex = startIndex;
    }
}

function loadMore() {
    currentBatch++;
    renderBatch(currentBatch);
}

function searchPokemon(){
    let search = document.getElementById('searchPokemon').value.toLowerCase();
    if (search.length >= 2) {
        allPokemon.forEach((pokemon, index) => {
            let pokemonElement = document.querySelectorAll('.pokemon')[index];
            if (pokemonElement) {
                if (pokemon.forms[0].name.toLowerCase().includes(search)) {
                    pokemonElement.style.display = 'block';
                } else {
                    pokemonElement.style.display = 'none';
                }
            }
        });
    } else {
        allPokemon.forEach((pokemon, index) => {
            let pokemonElement = document.querySelectorAll('.pokemon')[index];
            if (pokemonElement) {
                pokemonElement.style.display = 'block';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', loadPokemon);

document.addEventListener('DOMContentLoaded', () => {
    const popupOverlay = document.querySelector('.popup');
    popupOverlay.addEventListener('click', (e) => {
      if (e.target === popupOverlay) {
        closePopup();
      }
    });
  });