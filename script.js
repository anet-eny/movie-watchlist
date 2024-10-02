
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
    if (data.Response) {
        emptyFeed.classList.add('hidden')
        // renderMovies(data.Search)
        console.log(data.Search[0])
    } else {
        console.log("not found")
        emptyFeed.classList.add('hidden')
        renderUnableToFind()
    }
}

loadMovies('Spiderman')

function renderUnableToFind() {
    mainFeed.innerHTML = `
        <div class="unable-to-find">
            <p><strong>Unable to find what you're looking for. Please try another search.</strong></p>
        </div>
    `
}

function renderMovies(movies) {
    let listHtml = ""
    for (let movie of movies) {
        listHtml += `
            <div class="movie-item">
                <img src="${movie.Poster}" alt="poster">
                <div class="movie-about">
                    <div class="movie-header">
                        <h2>${movie.Title}</h2>
                        <p>⭐ ${movie.imdbRating}</p>
                    </div>
                    <div class="movie-info">
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        <button id="watchlist-btn" class="watchlist-btn"><i class="fa-solid fa-circle-plus"></i> Watchlist</p></button>
                    </div>
                    <p class="movie-plot">${movie.Plot}</p>
                </div>
            </div> 
        `
    }
    mainFeed.innerHTML = listHtml
}

