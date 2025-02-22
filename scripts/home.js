const api_key = 'faa4e3de';
const base_url = 'http://www.omdbapi.com/';
const total_movies = 100;
let movies = []; // Declare movies as a global variable

const asc_button = document.querySelector(".sort-option.asc");
const desc_button = document.querySelector(".sort-option.desc");


async function fetchMovies() {
  let currentPage = 1;
  let moviesFetched = 0;
  let allMovies = [];
  while (moviesFetched < total_movies) {
    const url = `${base_url}?apikey=${api_key}&s=movie&page=${currentPage}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.Response === 'True') {
        const movies = data.Search;
        allMovies = allMovies.concat(movies);
        moviesFetched += movies.length;
        console.log(`Fetched ${movies.length} movies from page ${currentPage}`);
        
        currentPage++;
      } else {
        console.log('No more movies found or API limit reached.');
        break;
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      break;
    }
  }
  
  return allMovies;
}

function renderMovies(movies) {
  const movieList = document.getElementById('movie_list');
  movieList.innerHTML = ''; // Clear the existing list before rendering
  
  movies.forEach(movie => {
    const li = document.createElement('li');
    li.classList.add("movie");
    li.innerHTML = `
    <div class="movie-wrapper">
    <div class="movie-poster">
    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'media/default_movie.svg'}" alt="${movie.Title}" style="width: 100%; height: auto;">
    </div>
    <div class="movie-info">
    <h3 class="movie-title">${movie.Title}</h3>
    <div class="year-like-div">
    <p class="movie-year">${movie.Year}</p>
    <svg fill="#000000" viewBox="0 0 24 24" data-name="Line Color" xmlns="http://www.w3.org/2000/svg" class="icon line-color like-button">
    <g class="likebtn_bgCarrier" stroke-width="0"/>
    <g class="likebtn_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
    <g class="likebtn_iconCarrier">
    <path class="like-btn-path" d="M19.57,5.44a4.91,4.91,0,0,1,0,6.93L12,20,4.43,12.37A4.91,4.91,0,0,1,7.87,4a4.9,4.9,0,0,1,3.44,1.44,4.46,4.46,0,0,1,.69.88,4.46,4.46,0,0,1,.69-.88,4.83,4.83,0,0,1,6.88,0Z" style="fill: none; stroke: #f8fafc; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"/>
    </g>
    </svg>
    </div>
    </div>                        
    </div>`;
    
    movieList.appendChild(li);
  });
}

function renderSortedMovies(movies) {
  const selected_sorted_option = document.querySelector('input[name="sort"]:checked'); 
  if (selected_sorted_option.value === "ascending") {
    movies.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (selected_sorted_option.value === "descending") {
    movies.sort((b, a) => a.Title.localeCompare(b.Title));
  } else {
    console.log("Error with sort input");
  }
  
  renderMovies(movies);
}


fetchMovies()
.then(fetchMovies => {
    movies=fetchMovies
    document.getElementById("ascending-option").checked = true;
    document.getElementById("descending-option").checked = false;
    renderSortedMovies(movies);
  })
  .catch(error => console.error("Failed to load movies:", error));
  
// sort logic
asc_button.addEventListener("click", e => {
  document.getElementById("ascending-option").checked = true;
  document.getElementById("descending-option").checked = false;
  renderSortedMovies(movies);
});

desc_button.addEventListener("click", e => {
  document.getElementById("ascending-option").checked = false;
  document.getElementById("descending-option").checked = true;
  renderSortedMovies(movies);
});