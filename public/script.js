const API_KEY = "9cdc7aab39636cba23964f05fb88df7d";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const LANGUAGE = "pt-BR";

const movieList = document.getElementById("movie-list");
const searchInput = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");
const messageParagraph = document.getElementById("message");

async function fetchMovies(query = "") {
    let url = "";

    if (query.trim() === "") {
        url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${LANGUAGE}&page=1`;
    } else {
        url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=${LANGUAGE}&query=${encodeURIComponent(query)}&page=1`;
    }

    try {
        showMessage("Carregando filmes...");
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("Erro ao conectar com a API");
        }
        
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error(error);
        showMessage("Ops! Ocorreu um erro ao buscar os filmes.");
        return [];
    }
}

function createMovieCard(movie) {
    // Criação dos elementos
    const card = document.createElement("div");
    card.classList.add("movie-card");

    const img = document.createElement("img");
    // Tratamento caso o filme não possua imagem de poster
    img.src = movie.poster_path ? `${IMG_URL}${movie.poster_path}` : "https://via.placeholder.com/500x750?text=Sem+Poster";
    img.alt = `Poster do filme ${movie.title}`;

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("movie-info");

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const metaDiv = document.createElement("div");
    metaDiv.classList.add("movie-meta");

    const year = document.createElement("span");
    // Pega apenas o ano do formato AAAA-MM-DD
    year.textContent = movie.release_date ? movie.release_date.split("-")[0] : "N/A";

    const rating = document.createElement("span");
    rating.classList.add("rating");
    rating.textContent = movie.vote_average ? `⭐ ${movie.vote_average.toFixed(1)}` : "S/N";

    const overview = document.createElement("p");
    overview.classList.add("overview");
    overview.textContent = movie.overview || "Sinopse não disponível para este filme.";

    // Montagem da árvore (appendChild)
    metaDiv.appendChild(year);
    metaDiv.appendChild(rating);

    infoDiv.appendChild(title);
    infoDiv.appendChild(metaDiv);
    infoDiv.appendChild(overview);

    card.appendChild(img);
    card.appendChild(infoDiv);

    return card;
}

function renderMovies(movies) {
    movieList.innerHTML = "";
    showMessage("");

    if (!movies || movies.length === 0) {
        showMessage("Nenhum filme encontrado para a sua busca.");
        return;
    }

    // Renderiza cada card
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        movieList.appendChild(movieCard);
    });
}

function showMessage(text) {
    messageParagraph.textContent = text;
}

async function handleSearch() {
    const query = searchInput.value;
    const movies = await fetchMovies(query);
    renderMovies(movies);
}

async function init() {
    btnSearch.addEventListener("click", handleSearch);
    
    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    });

    const initialMovies = await fetchMovies();
    renderMovies(initialMovies);
}

document.addEventListener("DOMContentLoaded", init);