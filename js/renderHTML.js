const typeImages = {
    "grass": "img/grass.png",
    "fire": "img/fire.png",
    "water": "img/water.png",
    "poison": "img/poison.png",
    "flying": "img/flying.png",
    "bug": "img/bug.png",
    "normal": "img/normal.png",
    "electric": "img/electric.png",
    "ground": "img/ground.png",
    "psychic": "img/psychic.png",
    "rock": "img/rock.png",
    "ghost": "img/ghost.png",
    "fairy": "img/fairy.png",
    "fighting": "img/fighting.png",
    "ice": "img/ice.png",
    "dragon": "img/dragon.png",
    "dark": "img/dark.png",
    "steel": "img/steel.png",
};

function renderShow(i) {
    const pokemon = allPokemon[i];
    const typesHTML = pokemon.types.map(typeInfo => {
        const typeName = typeInfo.type.name;
        const imageUrl = typeImages[typeName];
        return `<div><img src="${imageUrl}" alt="${typeName}"></div>`;
    }).join('');

    return `
        <div class="pokemon" onclick="showPopup(${i})">
            <div>
                <h3>#${pokemon.id} ${pokemon.forms[0].name}</h3>
            </div>
            <div class="pokeImg ${pokemon.types[0].type.name}">
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.forms[0].name}">
            </div>
            <div class="types">
                ${typesHTML}
            </div>
        </div>`;
}

function renderShowDetails(i) {
    const pokemon = allPokemon[i];
    if (!pokemon || !pokemon.types || !pokemon.forms || !pokemon.sprites) {
        return '<div>Error loading Pokémon details. Please try again.</div>';
    }

    const typesHTML = pokemon.types.map(typeInfo => {
        const typeName = typeInfo.type.name;
        const imageUrl = typeImages[typeName];
        return `<div><img src="${imageUrl}" alt="${typeName}"></div>`;
    }).join('');

    const mainContentHTML = `
        <div class="tab-content-stats">
            <p class="tab-content-main">Height:</p>
            <p class="tab-content-second">${pokemon.height} m</p>
        </div>
        <div class="tab-content-stats">
            <p class="tab-content-main">Weight:</p>
            <p class="tab-content-second">${pokemon.weight} kg</p>
        </div>
        <div class="tab-content-stats">
            <p class="tab-content-main">Base Experience:</p>
            <p class="tab-content-second">${pokemon.base_experience} ep</p>
        </div>
        <div class="tab-content-stats">
            <p class="tab-content-main">Abilities:</p>
            <p class="tab-content-second">${pokemon.abilities[0].ability.name}</p>
        </div>`;

    return `
        <div class="mediaNoneHidden">
            <img src="./img/left-arrow.png" id="prev-pokemon" onclick="showPreviousPokemon(currentPokemonIndex)" class="arrows">
        </div>
        <div class="popup-content">
        <div>
            <h3>#${pokemon.id} ${pokemon.forms[0].name}</h3>
        </div>
        <div class="pokeImg ${pokemon.types[0].type.name}">
            <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.forms[0].name}">
        </div>
        <div class="types">
            ${typesHTML}
        </div>
        <div class="tabs">
            <button onclick="showTabContent('main', ${i})">Main</button>
            <button onclick="showTabContent('stats', ${i})">Stats</button>
            <button onclick="showTabContent('evolution', ${i})">Evolution</button>
        </div>
        <div id="tab-content-${i}" class="tab-content">
        ${mainContentHTML}
        </div>
        </div>
        <div class="mediaNoneHidden">
            <img src="./img/right-arrow.png" id="next-pokemon" onclick="showNextPokemon(currentPokemonIndex)" class="arrows">
        </div>
        <div class="mediaHidden">
            <img src="./img/left-arrow.png" id="prev-pokemon" onclick="showPreviousPokemon(currentPokemonIndex)" class="arrows">
            <img src="./img/right-arrow.png" id="next-pokemon" onclick="showNextPokemon(currentPokemonIndex)" class="arrows">
        </div>
    `;
}

const showTabContent = (tabName, index) => {
    const pokemon = allPokemon[index];
    const tabContent = document.getElementById(`tab-content-${index}`);
    if (!tabContent) {
        console.error(`Tab content element for Pokémon index ${index} not found`);
        return;
    }
    if (!pokemon) {
        console.error(`Pokémon data for index ${index} not found`);
        return;
    }

    let contentHTML = '';

    switch (tabName) {
        case 'main':
            contentHTML = `
                <div class="tab-content-stats">
                    <p class="tab-content-main">Height:</p>
                    <p class="tab-content-second">${pokemon.height} m</p>
                </div>
                <div class="tab-content-stats">
                    <p class="tab-content-main">Weight:</p>
                    <p class="tab-content-second">${pokemon.weight} kg</p>
                </div>
                <div class="tab-content-stats">
                    <p class="tab-content-main">Base Experience:</p>
                    <p class="tab-content-second">${pokemon.base_experience} ep</p>
                </div>
                <div class="tab-content-stats">
                    <p class="tab-content-main">Abilities:</p>
                    <p class="tab-content-second">${pokemon.abilities[0].ability.name}</p>
                </div>`;
            break;
        case 'stats':
            const stats = [
                { name: 'HP', value: pokemon.stats[0].base_stat },
                { name: 'Attack', value: pokemon.stats[1].base_stat },
                { name: 'Defense', value: pokemon.stats[2].base_stat },
                { name: 'Special-Attack', value: pokemon.stats[3].base_stat },
                { name: 'Special-Defense', value: pokemon.stats[4].base_stat },
                { name: 'Speed', value: pokemon.stats[5].base_stat },
            ];

            contentHTML = `<div class="stats-container">`;
            stats.forEach(stat => {
                const percentage = (stat.value / 80) * 50;
                const typeColor = getTypeColor(pokemon.types[0].type.name);
                contentHTML += `
                    <div class="stat-row">
                        <span class="stat-name">${stat.name}:</span>
                        <svg viewBox="0 0 100 10" class="stats-svg">
                            <rect x="0" y="0" width="100" height="10" fill="#eee"></rect>
                            <rect x="0" y="0" width="0" height="10" class="stat-bar" data-value="${percentage}">
                                <title>${stat.value}</title>
                            </rect>
                            <text x="50%" y="50%" fill="#000" dy=".35em" text-anchor="middle">${stat.value}</text>
                        </svg>
                    </div>
                `;
            });
            contentHTML += `</div>`;
            break;

        case 'evolution':
            const redBlueSprite = pokemon.sprites.versions?.['generation-i']?.['red-blue']?.front_transparent || 'default_image.png';
            const crystalSprite = pokemon.sprites.versions?.['generation-ii']?.crystal?.front_transparent || 'default_image.png';
            const fireRedLeafGreenSprite = pokemon.sprites.versions?.['generation-iii']?.['firered-leafgreen']?.front_default || 'default_image.png';
            
            contentHTML = `
                <div class="evolution">
                    <img class="evolution-img" src="${redBlueSprite}">
                    <img class="evolution-img" src="${crystalSprite}">
                    <img class="evolution-img" src="${fireRedLeafGreenSprite}">
                <div>`;
            break;
    }

    tabContent.innerHTML = contentHTML;

    if (tabName === 'stats') {
        const bars = tabContent.querySelectorAll('.stat-bar');
        bars.forEach(bar => {
            const value = bar.getAttribute('data-value');
            bar.animate([{ width: '0%' }, { width: `${value}%` }], {
                duration: 1000,
                fill: 'forwards'
            });
            const typeColor = getTypeColor(pokemon.types[0].type.name);
            bar.style.fill = typeColor;
        });
    }
};

document.getElementById('popupDetails').innerHTML = renderShowDetails(0);