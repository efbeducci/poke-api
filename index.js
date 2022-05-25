const cards = document.querySelector('.cards'),
    PAGE_VIEW = '12' //Pokemons por página
API_URL = `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=${PAGE_VIEW}`,
    buttons = document.getElementById('buttons');
previous = document.getElementById('previous');
next = document.getElementById('next');
info_container = document.getElementById('info_container');
info = document.getElementById('info');
info_content = document.getElementById('info_content');


previous.addEventListener("click", () => fetchPokemons(previous.getAttribute('url')))
next.addEventListener("click", () => fetchPokemons(next.getAttribute('url')))
//Estilos para imágenes
const typeColors = {
    electric: '#FFEA70',
    normal: '#B09398',
    fire: '#FF675C',
    water: '#0596C7',
    ice: '#AFEAFD',
    rock: '#999799',
    flying: '#7AE7C7',
    grass: '#4A9681',
    psychic: '#FFC6D9',
    ghost: '#561D25',
    bug: '#A2FAA3',
    poison: '#795663',
    ground: '#D2B074',
    dragon: '#DA627D',
    steel: '#1D8A99',
    fighting: '#2F2F2F',
    default: '#2A1A1F',
};
const fetchPokemons = async (URL) => {
    try {
        const response = await fetch(URL);
        const result = await response.json();
        createPokemons(result.results);
        updateButtons(result);
        linkButtons(result);
    }
    catch (error) {
        console.log(error)
    }

}

fetchPokemons(API_URL)

/**
 * Creación de la página a partir de los 12 pokemones 
 * se incluye imagen y nombre
 */
const createPokemons = (data) => {
    cards.innerHTML = '';
    data.forEach(element => {
        fetch(element.url).then(data => data.json())
            .then((data) => {

                let divElement = document.createElement('div')
                divElement.classList.add("pokemon_card");
                let imgElement = document.createElement('img')
                imgElement.setAttribute('src', data.sprites.front_default);
                imgElement.style.background = typeColors[data.types[0].type.name];
                data.name = data.name.charAt(0).toUpperCase() + data.name.substr(1); // Cambia la primera letra del nombre a mayúscula
                let textElement = document.createElement('p');
                textElement.innerText = data.name;
                divElement.appendChild(imgElement); divElement.appendChild(textElement)
                cards.appendChild(divElement)

                imgElement.addEventListener("click", (e) => {
                    displayInfo(data);
                })

            })
    });

}

/**
 * Esta función muestra u oculta los botones previous y next
 * dependiendo de si hay página anterior o siguiente.
 */
function updateButtons(data) {
    previous.style.visibility = data.previous ? 'visible' : 'hidden';
    next.style.visibility = data.next ? 'visible' : 'hidden';
}
/**
 * Esta función actualiza el atributo 'url' donde se encuentra el link
 * de la siguiente y/o anterior página. 
 */
function linkButtons(data) {
    (data.previous) ? previous.setAttribute('url', data.previous) : " ";
    (data.next) ? next.setAttribute('url', data.next) : " ";
}

/**
 *  Muestra información de pokemon seleccionado 
 */
function displayInfo(data) {
    let imgElement = document.createElement('img');
    imgElement.classList.add("pokemon_card_details");
    imgElement.setAttribute('src', data.sprites.front_default);
    imgElement.style.background = typeColors[data.types[0].type.name];
    let skills = [];
    for (let i = 0; i < data.abilities.length; i++) {
        skills.push(data.abilities[i].ability.name);
    }
    let types = [];
    for (let i = 0; i < data.types.length; i++) {
        type_name = data.types[i].type.name;
        types.push('<span class="type" style="color:' + typeColors[type_name] + '">' + type_name + '</span>');
    }
    info_content.innerHTML = '';
    info_content.appendChild(imgElement);
    content = `<div class = "card-info">
        <p> Name: ${data.name} </p>
        <p> Type${types.length == 1 ? "" : "s"}: ${types.join(", ")} </p>
        <p> Abilit${skills.length == 1 ? "y" : "ies"}: ${skills.join(", ")} </p>
        <p> Base experience: ${data.base_experience} </p>
        <p> Height: ${data.height} </p>
        <p> Weight: ${data.weight} </p>
        </div>`;
    info_content.innerHTML += content;
    info_container.style.visibility = 'visible';
    info_container.style.opacity = 1;
    info.style.visibility = 'visible';
    info.style.opacity = 1;
    info.style.transform = 'translate(-50%, -50%) scale(0.999)';
}

function closeDetails() {
    info_container.style.visibility = 'hidden';
    info_container.style.opacity = 0;
    info.style.visibility = 'hidden';
    info.style.opacity = 0;
    info.style.transform = 'translate(-50%, -50%) scale(0.92)';
}
