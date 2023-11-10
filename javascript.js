let currentPageUrl = 'https://rickandmortyapi.com/api/character/'

window.onload = async () => {
    try { 
       await loadCharacters(currentPageUrl);
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar cards');
    }

    const nextButton = document.getElementById('next-button')
    const backButton = document.getElementById('back-button')
    
    nextButton.addEventListener('click', loadNextPage)
    backButton.addEventListener('click', loadPrevPage)
}

async function loadCharacters(url) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '';

    try {
        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach((character) => {
            const card = document.createElement('div')
            card.style.backgroundImage = 
            `url('https://rickandmortyapi.com/api/character/avatar/${character.url.replace(/\D/g, "")}.jpeg')`
            card.className = 'cards'

            const characterNameBg = document.createElement('div')
            characterNameBg.className = 'character-name-bg'

            const characterName = document.createElement('span')
            characterName.className = 'character-name'
            characterName.innerText = `${character.name}`

            characterNameBg.appendChild(characterName)
            card.appendChild(characterNameBg)

            card.onclick = () => {
                const modal = document.getElementById('modal')
                modal.style.visibility = 'visible'

                const modalContent = document.getElementById('modal-content')
                modalContent.innerHTML = ''

                const characterImage = document.createElement('div')
                 characterImage.style.backgroundImage = 
                 `url('https://rickandmortyapi.com/api/character/avatar/${character.url.replace(/\D/g, "")}.jpeg')`
                 characterImage.className = 'character-image'

                 const name = document.createElement('span')
                 name.className = 'character-details'
                 name.innerText = `Nome:  ${character.name}`

                 const status = document.createElement('span')
                 status.className = 'character-details'
                 status.innerText = `Status :  ${convertStatus(character.status)}`

                 const species = document.createElement('span')
                 species.className = 'character-details'
                 species.innerText = `Espécie :  ${convertSpecies(character.species)}`

                 const type = document.createElement('span')
                 type.className = 'character-details'
                 type.innerText = `Tipo : ${convertType(character.type)}`

                 const gender = document.createElement('span')
                 gender.className = 'character-details'
                 gender.innerText = `Gênero : ${convertGender(character.gender)}`

                 modalContent.appendChild(characterImage)
                 modalContent.appendChild(name)
                 modalContent.appendChild(status)
                 modalContent.appendChild(species)
                 modalContent.appendChild(type)
                 modalContent.appendChild(gender)

            }

            mainContent.appendChild(card)
        });
        
        const nextButton = document.getElementById('next-button')
        const backButton = document.getElementById('back-button')

        nextButton.disabled = !responseJson.next
        backButton.disabled = !responseJson.prev

        backButton.style.visibility = responseJson.prev? "visible" : "hidden"

        currentPageUrl = url
    
    } catch (error) {
        alert('Erro ao carregar os personagens')
        console.log(error);
    }
} 

async function loadNextPage() {
    if (!currentPageUrl) return;
    
    try {
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json()

        await loadCharacters(responseJson.next)

    } catch (error) {
        console.log(error)
        alert('Erro ao carregar a próxima página')
    }
}

async function loadPrevPage() {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json()

        await loadCharacters(responseJson.prev)

    } catch (error) {
        console.log(error)
        alert('Erro ao carregar a página anterior')
    }
}

function hiddenModal() {
    const modal = document.getElementById('modal')
    modal.style.visibility = 'hidden'
}

function convertStatus (status) {
    const vivo = {
        Alive : 'Vivo',
        unknown : 'Desconhecido',
        Dead : 'Morto'
    }

    return vivo [status] || status;
}

function convertGender (gender) {
    const sex = {
        Female : 'Feminino',
        Male : 'Masculino',
        Genderless : 'Sem gênero',
        unknown : 'Desconhecido'
    }

    return sex [gender] || gender
}

function convertSpecies (species) {
    const especies = {
        Human : 'Humano',
    }

    return especies [species] || species
}

function convertType (type) {
    if (type === '') {
    return 'Desconhecido'
    }
    return `${type}`
}