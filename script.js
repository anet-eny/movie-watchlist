
// fetch("http://www.omdbapi.com/?s=spiderman&apikey=d298a8bb")
//     .then(res => res.json())
//     .then(data => {
//         console.log(data)
//     })

const emptyFeed = document.getElementById('empty-feed')
const mainFeed = document.getElementById('main')

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById('input')
    const form = document.getElementById('form')

    if(form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault()
            loadMovies(input.value)
            input.value = ""
        })
    }
})

async function loadMovies(searchTerm) {
    const url = `http://www.omdbapi.com/?s=${searchTerm}&apikey=d298a8bb`
    const res = await fetch(`${url}`)
    const data = await res.json()
    if (data.Search) {
        emptyFeed.classList.add('hidden')
        mainFeed.classList.add('movies-active')
        getMoviesDetails(data.Search)
    } else {
        console.log("not found")
        emptyFeed.classList.add('hidden')
        mainFeed.classList.remove('movies-active')
        renderUnableToFind()
    }
}



function renderUnableToFind() {
    mainFeed.innerHTML = `
        <div class="unable-to-find">
            <p><strong>Unable to find what you're looking for. Please try another search.</strong></p>
        </div>
    `
}

async function getMoviesDetails(movies) {
    let moviesDetails = []
    const moviePromises = movies.map(async movie => {
        const result = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=d298a8bb`)
        const movieDetails = await result.json()
        moviesDetails.push(movieDetails)
    })
    await Promise.all(moviePromises)

    renderMovies(moviesDetails)
}

function renderMovies(moviesWithDetails) {
    let listHtml = ""
    for (let movie of moviesWithDetails) {
        listHtml += `
            <div class="movie-item">
                <img src="${(movie.Poster !== "N/A") ? movie.Poster : "images/image_not_found.jpg"}" alt="poster">
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

