const apiKey = 'faa4e3de';
const baseUrl = 'http://www.omdbapi.com/';
const urlParams = new URLSearchParams(window.location.search);
const totalMovies = 100;
let movies = []; // Declare movies as a global variable

const asc_button = document.querySelector(".sort-option.asc");
const asc_input = document.getElementById("ascending-option");
const desc_button = document.querySelector(".sort-option.desc");
const desc_input = document.getElementById("descending-option");

const search_element = document.querySelector(".search");
const search_svg = document.getElementById("search_icon");


async function fetchMovies(search_input) {
  let currentPage = 1;
  let moviesFetched = 0;
  let allMovies = [];
  while (moviesFetched < totalMovies) {
    const url = `${baseUrl}?apikey=${apiKey}&s=${encodeURIComponent(search_input)}&page=${currentPage}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.Response === 'True') {
        const current_page_movies = data.Search;
        allMovies = allMovies.concat(current_page_movies);
        moviesFetched += current_page_movies.length;
        console.log(`Fetched ${current_page_movies.length} movies from page ${currentPage}`);
        
        currentPage++;
      } else {
        console.log('No more movies found or API limit reached.');
        return allMovies;
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
    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'media/default_movie.svg'}" alt="media/default_movie.svg" style="width: 100%; height: auto;">
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
  const asc_input = document.querySelector('#ascending-option'); 
  const desc_input= document.querySelector('#descending-option'); 
  if (asc_input.checked) {
    let sorted_copy = [...movies].sort((a, b) => a.Title.localeCompare(b.Title));
    renderMovies(sorted_copy);
  } else if (desc_input.checked) {
    let sorted_copy = [...movies].sort((b, a) => a.Title.localeCompare(b.Title));
    renderMovies(sorted_copy);
  }
  else {
    renderMovies(movies);
  }
}

if (urlParams.has('search')) {
  // fetch movies with search parameter
  const search_param = urlParams.get("search");
  const sort_param = urlParams.get("sort");
  fetchMovies(search_param)
  .then(fetchedMovies => {        
    movies=fetchedMovies;
    
    renderSortedMovies(movies);
    if (movies.length === 0) {
      document.querySelector(".movie-not-found").style.visibility = "visible";
    }
    else {
      document.querySelector(".movie-not-found").style.visibility = "hidden";
    }
  })
  .catch(error => console.error("Failed to load searched movies:", error));
}else {
  // fetch default movies
  fetchMovies("movie")
  .then(fetchedMovies => {
    movies=fetchedMovies;
    renderMovies(movies);
  })
  .catch(error => console.error("Failed to load movies:", error));
}

// sort logic

function sort_button_click_event(clicked_sort_input, other_sort_input)
{ 
  if (clicked_sort_input.checked) {
    clicked_sort_input.checked = false;
  } 
  else {
    clicked_sort_input.checked = true;
    other_sort_input.checked = false;
  }
  renderSortedMovies(movies);
}

asc_button.addEventListener("click", e => {
  e.preventDefault();
  sort_button_click_event(asc_input,desc_input);
});

desc_button.addEventListener("click", e => {
  e.preventDefault();
  sort_button_click_event(desc_input,asc_input);
});

// change url when search logic
function handle_search() {
  const search_value = search_element.value;
  if (search_value !== "") {
    window.location.assign(`/home.html?search=${search_value}`);
    search_value= "";
  }
}

search_svg.addEventListener("click", handle_search);
search_element.addEventListener("keydown", e => {
  if (e.key === "Enter") handle_search();
});

// redirect if the logo is clicked
const logo_wrapper = document.querySelector(".logo-wrapper");
logo_wrapper.addEventListener("click", e => {
  window.location.assign(`/home.html`);
});