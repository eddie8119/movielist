const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const dataPannel = document.querySelector("#data-pannel");
const movieModal = document.querySelector("#movie-modal");
const serchForm = document.querySelector("#serch-form");
const serchInput = document.querySelector("#Serch-input");
const movies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

function renderMovieList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img
          src="${POSTER_URL + item.image}"
          class="card-img-top"
          alt="Movie Poster"
        />
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button
            id=${item.id}
            class="btn btn-primary btn-show-movie"
            data-bs-toggle="modal"
            data-bs-target="#movie-modal"            
          >
            More
          </button>
          <button id=${
            item.id
          } class="btn btn-danger btn-remove-favorite">x</button>
        </div>
      </div>
    </div>
  </div>`;
  });
  dataPannel.innerHTML = rawHTML;
}

//顯示modal
dataPannel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    // console.log(Number(event.target.id));
    showMovieModal(Number(event.target.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    remnoveFavorite(Number(event.target.id));
  }
});

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalDate.innerText = "Release date: " + data.release_date;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie-poster" class="img-fluid">`;
  });
}

function remnoveFavorite(id) {
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  movies.splice(movieIndex, 1);
  localStorage.setItem("favoriteMovies", JSON.stringify(movies));
  renderMovieList(movies);
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((movie) => movie.id === id);
  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已經在收藏清單中！");
  }
  list.push(movie);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}
