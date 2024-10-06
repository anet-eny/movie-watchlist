
// fetch("http://www.omdbapi.com/?s=spiderman&apikey=d298a8bb")
//     .then(res => res.json())
//     .then(data => {
//         console.log(data)
//     })

const emptyFeed = document.getElementById('empty-feed')
const mainFeed = document.getElementById('main')
const emptyWatchlist = document.getElementById('empty-watchlist')
const watchlistFeed = document.getElementById('main-watchlist')

// Runs when the DOM is fully loaded and initializes the form event listener (checks if the form is present)
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

// Fetches movie search results based on a search term
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

// Renders a message when no search results are found
function renderUnableToFind() {
    mainFeed.innerHTML = `
        <div class="unable-to-find">
            <p><strong>Unable to find what you're looking for. Please try another search.</strong></p>
        </div>
    `
}

// Fetches detailed information for each movie using its ID
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

// Renders the list of movies on the page(for search or watchlist)
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
                        <button id="watchlist-btn" class="watchlist-btn" data-id="${movie.imdbID}"><i class="fa-solid ${(isWatchlist) ? 'fa-circle-minus' : 'fa-circle-plus'}"></i> ${(isWatchlist) ? 'Remove' : 'Watchlist'}</p></button>
                    </div>
                    <p class="movie-plot">${movie.Plot}</p>
                </div>
            </div> 
        `
    }
    const targetFeed = isWatchlist ? watchlistFeed : mainFeed
    targetFeed.innerHTML = listHtml
    
    document.querySelectorAll('.watchlist-btn').forEach(button => {
        if (isWatchlist) {
            button.addEventListener('click', removeFromWatchlist)
        } else {
            button.addEventListener('click', addToWatchlist)
        }
    })
}

// Adds a movie to the watchlist and stores it in local storage
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

// Removes a movie from the watchlist and updates local storage
function removeFromWatchlist(e) {
    const movieID = e.target.getAttribute('data-id')
    let watchlist = JSON.parse(localStorage.getItem('watchlist'))

    if(watchlist.includes(movieID)) {
        const index = watchlist.indexOf(movieID)
        watchlist.splice(index, 1)
        localStorage.setItem('watchlist', JSON.stringify(watchlist))
    }
    handleWatchlist()
}

// Handles displaying the watchlist, showing/hiding the correct UI elements
async function handleWatchlist() {
    let watchlist = JSON.parse(localStorage.getItem('watchlist'))

    if(watchlist.length > 0) {
        emptyWatchlist.classList.add('hidden')
        watchlistFeed.classList.add('movies-active')
        await getMoviesDetails(watchlist, true)
    } else {
        emptyWatchlist.classList.remove('hidden')
        watchlistFeed.classList.remove('movies-active')
        watchlistFeed.innerHTML = `
            <div id="empty-watchlist" class="empty-watchlist">
                <p><strong>Your watchlist is looking a little empty...</strong></p>
                <a href="index.html"><i class="fa-solid fa-circle-plus"></i> Let's add some movies!</a>
            </div>
        `
    }
}

// Executes when the page is loaded and checks if the user is on watchlist.html
window.addEventListener('DOMContentLoaded', () => {
    if(window.location.pathname.includes('watchlist.html')) {
        handleWatchlist()
    }
})