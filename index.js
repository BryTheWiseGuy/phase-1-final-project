document.addEventListener('DOMContentLoaded', () => {
    getCollectedPokemon();
    fetch('http://localhost:3000/pokemon')
        .then(res => res.json())
        .then(data => {
            createPokemonSelection(data);
            renderSelectedPokemon(data);
            document.querySelector('#addButton').addEventListener('click', (e) => {
                e.preventDefault();
                addToPokemonCollection(data);
        })
    })

    //=> Called on DOM intialization to get "collection" root info from index.json and render already collected cards to the collection interface on page load
    function getCollectedPokemon() {
        fetch('http://localhost:3000/collection')
        .then(res => res.json())
        .then(pokemonData => {
            console.log(pokemonData);
            initializePokemonCollection(pokemonData);
        })
    }

    //=> Iterates over the "collection" root in index.json and calls renderCollectedPokemon function for each pokemon
    function initializePokemonCollection(pokemonData) {
        pokemonData.forEach(pokemon => renderCollectedPokemon(pokemon));
    }

    //=> Whereas the addToPokemonCollection simply duplicates the originally searched for pokemon card and POSTs its json data to the "collection" root, this function re-renders the card on page refresh so cards are persisted on the page
    function renderCollectedPokemon(pokemon) {
        let collectionInterface = document.querySelector('#collectionInterface');
        let pokemonCard = document.createElement('div');
        let pokemonImage = document.createElement('img');
        let pokemonName = document.createElement('h3');
        let pokemonTypeContainer = document.createElement('div');
        pokemonCard.id = 'collectedCard';
        pokemonTypeContainer.id = 'pokemonType';
        pokemonImage.src = pokemon.image;
        pokemonName.innerText = pokemon.name;
        let types = ['Grass', 'Fire', 'Water', 'Electric', 'Normal', 'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Psychic', 'Ice', 'Dragon', 'Dark', 'Fairy'];
        for (let i = 0; i < types.length; i++) {
            if (pokemon.type.includes(types[i])) {
            const typeButton = document.createElement('button');
            typeButton.innerText = types[i];
            typeButton.classList.add(types[i]);
            pokemonTypeContainer.appendChild(typeButton);
            }
        }
        pokemonCard.appendChild(pokemonImage);
        pokemonCard.appendChild(pokemonName);
        pokemonCard.appendChild(pokemonTypeContainer);
        collectionInterface.appendChild(pokemonCard);
    }

    
    //=> Adds the currently selected pokemon's card to the collection interface, as well as adds it to the "collection" root within index.json;
    function addToPokemonCollection(data) {
        let highestId = Math.max(...data.map(pokemon => pokemon.id));
        let interface = document.querySelector('#collectionInterface');
        let selectedPokemon = document.querySelector('#pokemonSelect').value;
        data.forEach(pokemon => {
            let pokemonObj = {...pokemon};
            highestId += 1;
            pokemonObj.id = highestId;
            if (pokemon.name === selectedPokemon) {
                let originalCard = document.querySelector('#pokemonCard');
                let collectedCard = originalCard.cloneNode(true);
                collectedCard.id = 'collectedCard';
                interface.appendChild(collectedCard);
                postCollectedPokemon(pokemonObj);
            }
        })
    }

    //=> Used in the above function to POST the pokemon added to the collection interface to the "collection" root within index.json; allows pokemon in the collection to persist on page refresh
    function postCollectedPokemon(pokemonObj) {
        fetch('http://localhost:3000/collection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pokemonObj)
        })
    }

    //=> Removes the pokemon from the pokemon collection interface, as well as removing the data from the "collection" root of index.json
    function removeFromPokemonCollection(data){}

    //=> Handles DELETE of pokemon from index.json
    function deleteCollectedPokemon(pokemonObj){}

    //=> Handles the details of the event of favoriting a pokemon in the collection interface
    function favoritePokemon(data){}

    //=> Handles PATCH of the favorite key/value pair in the "collection" root of index.json
    function patchFavorite(pokemonObj){}
    
    //=> Renders the pokemon selected from the drop down menu on the pokedex interface when the search button is clicked
    function renderSelectedPokemon (data) {
        let selectCard = document.querySelector('#searchButton')
        selectCard.addEventListener('click', (e) => {
            e.preventDefault();
            renderPokedexCard(data);
            renderPokemonStats(data);
        })
    }

    //=> Creates the initial pokemon selection options within the dropdown menu
    function createPokemonSelection(data) {
        data.forEach((pokemon) => {
            let pokemonSelection = document.querySelector('#pokemonSelect');
            let option = document.createElement('option');
            option.innerText = pokemon.name;
            pokemonSelection.appendChild(option);
        });
    };

    //=> Renders the card displayed on the Pokedex Interface; includes the pokemon image, name, and pokemon types
    function renderPokedexCard(data) {
        resetCard();
        resetStats();
        let pokemonCard = document.querySelector('#pokemonCard');
        let pokemonTypeContainer = document.createElement('div');
        let pokemonImage = document.createElement('img');
        let pokemonName = document.createElement('h3');
        pokemonTypeContainer.id = 'pokemonType';
        pokemonImage.src = data.find(pokemon => pokemon.name === document.querySelector('#pokemonSelect').value).image;
        pokemonName.innerText = data.find(pokemon => pokemon.name === document.querySelector('#pokemonSelect').value).name;
        pokemonCard.appendChild(pokemonImage);
        pokemonCard.appendChild(pokemonName);
        pokemonCard.appendChild(pokemonTypeContainer);
        createTypeButtons(data);
    }

    //=> Creates the pokemon types displayed on the pokemon card; types created as buttons for potential implementation of additional pokemon data or sorting pokemon by type
    function createTypeButtons(data) {
        let selectedPokemon = document.querySelector('#pokemonSelect');
        let pokemonTypeContainer = document.querySelector('#pokemonType');
        let types = ['Grass', 'Fire', 'Water', 'Electric', 'Normal', 'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Psychic', 'Ice', 'Dragon', 'Dark', 'Fairy'];
        let selectedPokemonType = data.find(pokemon => pokemon.name === selectedPokemon.value).type;
        for (let i = 0; i < types.length; i++) {
            if (selectedPokemonType.includes(types[i])) {
            const typeButton = document.createElement('button');
            typeButton.innerText = types[i];
            typeButton.classList.add(types[i]);
            pokemonTypeContainer.appendChild(typeButton);
            }
        }
    }

    //=> Renders the pokemon statistics seen on the pokedex interface; include the pokemon height, weight, category, weaknesses, and description
    function renderPokemonStats(data) {
        let pokemonStats = document.querySelector('#pokemonStats');
        let pokemonHeight = document.createElement('h4');
        let pokemonWeight = document.createElement('h4');
        let pokemonCategory = document.createElement('h4');
        let pokemonWeakness = document.createElement('h4');
        let pokemonAbility = document.createElement('h4');
        let pokemonAbilityButtons = document.createElement('div');
        let pokemonWeaknessButtons = document.createElement('div');
        pokemonAbilityButtons.id = 'pokemonAbilities';
        pokemonWeaknessButtons.id = 'pokemonWeaknessButtons';
        pokemonAbility.innerText = 'Abilities:';
        pokemonWeakness.innerText = 'Weaknesses:';
        pokemonHeight.innerText = `Height: ${data.find(pokemon => pokemon.name === document.querySelector('#pokemonSelect').value).height}`;
        pokemonWeight.innerText = `Weight: ${data.find(pokemon => pokemon.name === document.querySelector('#pokemonSelect').value).weight}`;
        pokemonCategory.innerText = `Category: ${data.find(pokemon => pokemon.name === document.querySelector('#pokemonSelect').value).category}`;
        pokemonStats.appendChild(pokemonHeight);
        pokemonStats.appendChild(pokemonWeight);
        pokemonStats.appendChild(pokemonCategory);
        pokemonStats.appendChild(pokemonWeakness);
        pokemonStats.appendChild(pokemonWeaknessButtons);
        pokemonStats.appendChild(pokemonAbility);
        pokemonStats.appendChild(pokemonAbilityButtons);
        renderPokemonWeakness(data);
        renderPokemonAbility(data);
        renderPokemonDescription(data);
    }

    //=> W.I.P!! This functions purpose is to render the pokemon abilities seen within the statistics side of the pokemon interface; intended functionality not fully implemented
    function renderPokemonAbility(data) {
        let selectedPokemon = document.querySelector('#pokemonSelect');
        let pokemonAbilityContainer = document.querySelector('#pokemonAbilities');
        let abilities = [...new Set(data.map(pokemon => pokemon.abilities).flat())];
        let selectedPokemonAbilities = data.find(pokemon => pokemon.name === selectedPokemon.value).abilities;
        let overlay = document.createElement('div');
        overlay.id = 'overlay';
        pokemonAbilityContainer.appendChild(overlay);
        for (let i = 0; i < abilities.length; i++) {
            if (selectedPokemonAbilities.includes(abilities[i])) {
                let abilityButton = document.createElement('button');
                let abilityInfoBox = document.createElement('div');
                let abilityInfo = document.createElement('p');
                abilityInfo.innerText = abilities[i];
                abilityButton.innerText = abilities[i];
                abilityInfoBox.id = 'infoBox';
                abilityButton.id = 'abilityButton';
                pokemonAbilityContainer.appendChild(abilityButton);
                abilityInfoBox.appendChild(abilityInfo);
                pokemonAbilityContainer.appendChild(abilityInfoBox);
                abilityButton.addEventListener('mouseover', (e) => {
                    overlay.style.display = 'block';
                    abilityInfoBox.style.display = 'block';
                    e.stopPropagation();
                })
                abilityButton.addEventListener('mouseout', () => {
                    overlay.style.display = 'none';
                    abilityInfoBox.style.display = 'none';
                });
            }
        }
    }

    //=> Renders the Pokemon Weaknesses seen on the statistics side of the Pokedex Interface; weaknesses rendered as buttons for future implementation of displaying additional pokemon implementation or sorting pokemon by weakness
    function renderPokemonWeakness(data) {
        let selectedPokemon = document.querySelector('#pokemonSelect');
        let pokemonWeaknessContainer = document.querySelector('#pokemonWeaknessButtons');
        let weaknesses = ['Grass', 'Fire', 'Water', 'Electric', 'Normal', 'Fighting', 'Flying', 'Poison', 'Ground', 'Rock', 'Bug', 'Ghost', 'Steel', 'Psychic', 'Ice', 'Dragon', 'Dark', 'Fairy'];
        let selectedPokemonWeakness = data.find(pokemon => pokemon.name === selectedPokemon.value).weaknesses;
        for (let i = 0; i < weaknesses.length; i++) {
            if (selectedPokemonWeakness.includes(weaknesses[i])) {
            const weaknessButton = document.createElement('button');
            weaknessButton.innerText = weaknesses[i];
            weaknessButton.classList.add(weaknesses[i]);
            pokemonWeaknessContainer.appendChild(weaknessButton);
            }
        }
    }

    //=> Renders the description of the pokemon seen on the statistics side of the Pokedex Interface
    function renderPokemonDescription(data) {
        let pokemonStats = document.querySelector('#pokemonStats');
        let pokemonDescription = document.createElement('p');
        pokemonDescription.id = 'pokemonDescription';
        pokemonDescription.innerText = data.find(pokemon => pokemon.name === document.querySelector('#pokemonSelect').value).description;
        pokemonStats.appendChild(pokemonDescription);
    }

    //=> Resets Pokemon Statistics on the Pokedex Interface when a new Pokemon is searched
    function resetStats() {
        const originalStats = document.querySelector('#pokemonStats');
        while (originalStats.firstChild) {
            originalStats.removeChild(originalStats.firstChild);
        }
    }

    //=> Resets Pokemon Card on the Pokedex Interface when a new Pokemon is searched
    function resetCard() {
        const originalCard = document.querySelector('#pokemonCard');
        while (originalCard.firstChild) {
            originalCard.removeChild(originalCard.firstChild);
        }
    }
})