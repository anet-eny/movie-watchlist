
// fetch("http://www.omdbapi.com/?s=spiderman&apikey=d298a8bb")
//     .then(res => res.json())
//     .then(data => {
//         console.log(data)
//     })

const emptyFeed = document.getElementById('empty-feed')
const mainFeed = document.getElementById('main')

async function loadMovies(searchTerm) {
    const url = `http://www.omdbapi.com/?s=${searchTerm}&apikey=d298a8bb`
    const res = await fetch(`${url}`)
    const data = await res.json()
    if (data.Response === true) {
        emptyFeed.classList.add('hidden')
        console.log(data)
    } else {
        console.log("not found")
        emptyFeed.classList.add('hidden')
        renderUnableToFind()
    }
}

loadMovies('sfsfsefs')

function renderUnableToFind() {
    mainFeed.innerHTML = `
        <div class="unable-to-find">
            <p><strong>Unable to find what you're looking for. Please try another search.</strong></p>
        </div>
    `
}
