
// fetch("http://www.omdbapi.com/?s=spiderman&apikey=d298a8bb")
//     .then(res => res.json())
//     .then(data => {
//         console.log(data)
//     })

const emptyFeed = document.getElementById('empty-feed')
const mainFeed = document.getElementById('main')
const emptyWatchlist = document.getElementById('empty-watchlist')
const watchlistFeed = document.getElementById('main-watchlist')

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

async function getMoviesDetails(movies, isWatchlist = false) {
    let moviesDetails = []
    const moviePromises = movies.map(async movie => {
        let id
        if (isWatchlist) {
            id = movie
        } else {
            id = movie.imdbID
        }
        const result = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=d298a8bb`)
        const movieDetails = await result.json()
        moviesDetails.push(movieDetails)
    })
    await Promise.all(moviePromises)
    renderMovies(moviesDetails, isWatchlist)
}

function renderMovies(moviesWithDetails, isWatchlist = false) {
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
                        <button id="watchlist-btn" class="watchlist-btn" data-id="${movie.imdbID}"><i class="fa-solid fa-circle-plus"></i> Watchlist</p></button>
                    </div>
                    <p class="movie-plot">${movie.Plot}</p>
                </div>
            </div> 
        `
    }
    const targetFeed = isWatchlist ? watchlistFeed : mainFeed
    targetFeed.innerHTML = listHtml
    
    document.querySelectorAll('.watchlist-btn').forEach(button => {
        button.addEventListener('click', addToWatchlist)
    })
}

function addToWatchlist(e) {
    const movieID = e.target.getAttribute('data-id')
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || []

    if(!watchlist.includes(movieID)) {
        watchlist.push(movieID)
        localStorage.setItem('watchlist', JSON.stringify(watchlist))
        console.log(`${movieID} added to watchlist`)
    } else {
        console.log(`${movieID} is already in the watchlist`)
    }
}

async function handleWatchlist() {
    let watchlist = JSON.parse(localStorage.getItem('watchlist'))

    if(watchlist.length > 0) {
        emptyWatchlist.classList.add('hidden')
        watchlistFeed.classList.add('movies-active')
        await getMoviesDetails(watchlist, true)
    } else {
        emptyWatchlist.classList.remove('hidden')
        watchlistFeed.classList.remove('movies-active')
    }
}

window.addEventListener('DOMContentLoaded', () => {
    if(window.location.pathname.includes('watchlist.html')) {
        handleWatchlist()
    }
})