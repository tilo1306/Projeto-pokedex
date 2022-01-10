const inputText = document.getElementById("filter-name");
const selectSortValue = document.getElementById("sort-type");
const section = document.querySelector(".pokedex");
const selectType = document.querySelector("#filter-type");
const formControl = document.querySelector(".pokedex-control");

let pokemons = "";
let pokemonTypes = [];
function filterForName(apiPokemon) {
  inputText.addEventListener("keyup", (e) => {
    let warning = document.querySelectorAll(".warning");
    pokemons = "";
    filt(apiPokemon).forEach((pokemon) => (pokemons += pokemonCard(pokemon)));
    if (pokemons.length == 0 && warning.length >= 0) {
      section.insertAdjacentHTML(
        "afterEnd",
        '<div class="warning">Nenhum pokemon foi encontrado</div>'
      );
    }
    if (warning.length >0) {
      document.querySelector(".warning").remove();
      section.innerHTML = pokemons;
    }

    section.innerHTML = pokemons;
  });
}
function createType(pokemon) {
  let type = [];
  pokemon.map((p) => {
    for (const i of p.type) {
      type.push(i);
    }
  });
  const removeDuplicateType = [...new Set(type)];
  removeDuplicateType.forEach((type) => {
    option = new Option(type, type);
    selectType.options[selectType.options.length] = option;
  });
}

function apiFetch(apiPokemon) {
  selectFilter(apiPokemon);
  filterForName(apiPokemon);
  createType(apiPokemon);
  inputText.value = "";
  selectType.selectedIndex = 0;
  selectSortValue.selectedIndex = 0;
  apiPokemon.forEach((pokemon) => (pokemons += pokemonCard(pokemon)));
  section.innerHTML = pokemons;
}
function selectFilter(apiPokemon) {
  formControl.addEventListener("change", (e) => {
    let warning = document.querySelectorAll(".warning");
    e.preventDefault();
    pokemons = "";
    filt(apiPokemon).forEach((pokemon) => (pokemons += pokemonCard(pokemon)));
    section.innerHTML = pokemons;
    if (pokemons.length == 0 && warning.length >= 0) {
      section.insertAdjacentHTML(
        "afterEnd",
        '<div class="warning">Nenhum pokemon foi encontrado</div>'
      );
    }
    if (warning.length >= 1) {
      document.querySelector(".warning").remove();
      section.innerHTML = pokemons;
    }

    section.innerHTML = pokemons;
  });
}

function pokemonCard(pokemon) {
  const types = pokemon.type
    .map((t) => `<span class="pokemon-type background-${t}">${t}</span>`)
    .join("");
  const img = pokemon.name.replace(/['\.]/g, "").replace(/\s/g, "-");
  pokemonTypes = pokemonTypes.concat(pokemon.type);
  return `<div class="pokemon" data-name="${pokemon.name}" data-type="${
    pokemon.type
  }" tabindex="${pokemon.id}">
  <figure class="pokemon-figure">
        <img src="img/${img.toLowerCase()}.png" alt="${pokemon.name}">
      </figure>
      <section class="pokemon-description">
        <span class="pokemon-id">#${Number(pokemon.id)
          .toString()
          .padStart(3, "0")}</span>
        <h1 class="pokemon-name">${pokemon.name}</h1>
        <div class="pokemon-types">${types}</div>
      </section>
      <section class="pokemon-stats">${loadStats(pokemon.stats)}</section>
      </div>`;
}
function loadStats(stats) {
  return Object.entries(stats)
    .filter(([name, value]) => !["total"].includes(name))
    .map(
      ([name, value]) =>
        `<div class="stat-row">
        <div>${name}</div>
        <div class="stat-bar">
        <div class="stat-bar-bg" style="width: ${
          (100 * value) / 250
        }%">${value}</div>
        </div>
        </div>`
    )
    .join("");
}

function filt(pokemons) {
  let optionSelect = selectType.children[selectType.selectedIndex];
  let texto = optionSelect.textContent;
  return pokemons
    .filter((pokemon) =>
      pokemon.name.toUpperCase().includes(inputText.value.toUpperCase())
    )
    .filter((p) => {
      if (texto === "All") {
        return p;
      } else {
        for (const i of p.type) {
          if (i === texto) {
            return p;
          }
        }
      }
    })
    .sort((a, b) =>
      selectSortValue.value === "A-Z"
        ? a.name < b.name
          ? -1
          : 0
        : selectSortValue.value === "Z-A"
        ? a.name > b.name
          ? -1
          : 0
        : selectSortValue.value === "Highest Number (First)"
        ? b.id - a.id
        : selectSortValue.value === "Lowest Number (First)"
        ? a.id - b.id
        : null
    );
}
window.onload = () => {
  fetch("./data/pokedex.json")
    .then((resp) => resp.json())
    .then((data) => {
      apiFetch(data);
    });
};
