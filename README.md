# Movie Watchlist App

A simple movie watchlist web application using the OMDB API. Users can search for movies, add them to a watchlist, and view or remove movies from their watchlist. This project was developed as part of the Scrimba curriculum.

## Features

- **Search for Movies**: Users can search for movies using the OMDB API.
- **Add to Watchlist**: Users can add movies to a persistent watchlist stored in `localStorage`.
- **Watchlist Page**: Displays the user's watchlist, with functionality to remove movies.
- **Persistent Data**: The watchlist remains available between sessions via `localStorage`.

## Key Learnings

- **Working with APIs**: Integrated with the OMDB API to fetch movie data and dynamically display search results.
- **Ternary Operators**: Used in the UI rendering logic to handle conditional classes and button text changes (e.g., adding/removing from the watchlist).
- **Local Storage**: Learned how to store and retrieve data using the browser's `localStorage` for persistent watchlist functionality.
- **Parameter Defaults**: Gained experience with JavaScript function parameters by introducing default values, such as `isWatchlist = false`, to manage different states in functions like `renderMovies()`.

## View Project
https://anet-eny.github.io/movie-watchlist/
