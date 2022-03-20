const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const dataPannel = document.querySelector("#data-pannel");
const movieModal = document.querySelector("#movie-modal");
const serchForm = document.querySelector("#serch-form");
const serchInput = document.querySelector("#Serch-input");
const cardModeButton = document.querySelector("#card-mode-button");
const listModeButton = document.querySelector("#list-mode-button");
const pageinator = document.querySelector("#pageinator");

const movies = [];
let filterMovies = [];
const MOVIES_PER_PAGE = 12;
const MOVIES_PER_PAGE_ROW = 12;

//渲染全部電影目錄
axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results);
    renderMovieList(getMoviesByPage(1));
    randerpageinator(movies.length);
  })
  .catch((err) => console.log(err));

//顯示cardModeButton
cardModeButton.addEventListener("click", function onCardModeButton(event) {
  event.target.classList.add("toggle");
  listModeButton.classList.remove("toggle");
  
  renderMovieList(getMoviesByPage(1));
  randerpageinator(movies.length);
});
//顯示listModeButton
listModeButton.addEventListener("click", function onListModeButton(event) {
  event.target.classList.add("toggle");
  cardModeButton.classList.remove("toggle");
  
  renderMovieListRow(getMoviesByPageROW(1));
  randerpageinatorROW(movies.length);
});

//控制圖卡還是條列模式
//圖卡模式顯示
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
          <button id=${item.id} class="btn btn-info btn-add-favorite">+</button>
        </div>
      </div>
    </div>
  </div>`;
  });
  dataPannel.innerHTML = rawHTML;
}
//條列模式顯示
function renderMovieListRow(data) {
  let rawHTML = `<ul class="list-group col-sm-12 mb-2">`;
  data.forEach((item) => {
    // title, image, id
    rawHTML += `
    <li class="list-group-item d-flex justify-content-between">
      <h5 class="card-title">${item.title}</h5>
      <div>
        <button
        id=${item.id}
        class="btn btn-primary btn-show-movie"
        data-bs-toggle="modal"
        data-bs-target="#movie-modal">More</button>      
        <button id=${item.id} class="btn btn-info btn-add-favorite">+</button>
      </div>
    </li>`;
  });
  rawHTML += "</ul>";
  dataPannel.innerHTML = rawHTML;
}

//顯示modal
dataPannel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    // console.log(Number(event.target.id));
    showMovieModal(Number(event.target.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.id));
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

//多加複習此處
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((movie) => movie.id === id);
  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已經在收藏清單中！");
  }
  list.push(movie);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

//搜尋關鍵字
serchForm.addEventListener("submit", function onSerchFormButtom(event) {
  event.preventDefault();
  const keyword = serchInput.value.trim().toLowerCase();
  filterMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );

  if (filterMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`);
  }

  // 判別渲染形式
  if (cardModeButton.classList.contains("toggle")) {
    randerpageinator(filterMovies.length);
    renderMovieList(getMoviesByPage(1));
  } else {
    randerpageinator(filterMovies.length);
    renderMovieListRow(getMoviesByPage(1));
  }
});

//<!-- 每頁顯示的張數 -->
function getMoviesByPage(page) {
  const data = filterMovies.length ? filterMovies : movies;
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}
function getMoviesByPageROW(page) {
  const data = filterMovies.length ? filterMovies : movies;
  const startIndex = (page - 1) * MOVIES_PER_PAGE_ROW;
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE_ROW);
}
function randerpageinator(amount) {
  const pageNumbers = Math.ceil(amount / MOVIES_PER_PAGE);
  let pagebarHtml = "";
  for (let i = 0; i < pageNumbers; i++) {
    pagebarHtml += `<li class="page-item">
      <a class="page-link" href="#" data-page="${i + 1}">
        ${i + 1}
      </a>
    </li>
    `;
  }
  pageinator.innerHTML = pagebarHtml;
}
function randerpageinatorROW(amount) {
  const pageNumbers = Math.ceil(amount / MOVIES_PER_PAGE_ROW);
  let pagebarHtml = "";
  for (let i = 0; i < pageNumbers; i++) {
    pagebarHtml += `<li class="page-item">
      <a class="page-link" href="#" data-page="${i + 1}">
        ${i + 1}
      </a>
    </li>
    `;
  }
  pageinator.innerHTML = pagebarHtml;
}

//按分頁
pageinator.addEventListener("click", function onPageinator(event) {
  if (event.target.tagName !== `A`) return; //多複習

  const page = Number(event.target.dataset.page);
  // 判別渲染形式
  if (cardModeButton.classList.contains("toggle")) {
    renderMovieList(getMoviesByPage(page));
  } else {
    renderMovieListRow(getMoviesByPage(page));
  }
});
