let moviesData = [];
let fetchUtils = new FetchUtils();

document.addEventListener('DOMContentLoaded', function () {
  getMoviesHandler();
});

const getMovies = async () => {
  try {
    const response = await fetchUtils.get(`${BASE_URL_KEY}${MOVIES_PATH}`, (method) =>
      fetchUtils.setupOptions(method, fetchUtils.APPLICATION_JSON, API_KEY)
    );
    const data = await response.json();
    // console.log(data.results)
    moviesData = data.results;
    renderMovies(moviesData);
  } catch (error) {
    console.error(error);
  }
};

const createMovieCard = (moviesData) => {
  const { id, poster_path, title, overview, vote_average } = moviesData;

  //? 영화 카드의 컨테이너를 생성
  const movieCard = document.createElement('div');
  movieCard.classList.add('movie-card');
  movieCard.id = id;

  //? 영화 포스터 이미지
  const img = document.createElement('img');
  img.src = `${IMAGE_BASE_URL}${IMAGE_PATH}${poster_path}`;
  img.alt = `${title} poster`;
  img.classList.add('movie-poster');

  const contentContainer = document.createElement('div');
  contentContainer.classList.add('content-container');

  //? 영화 제목
  const movieTitle = document.createElement('h3');
  movieTitle.textContent = title;
  movieTitle.classList.add('movie-title');

  //? 영화 설명
  const movieOverview = document.createElement('p');
  movieOverview.textContent = overview;
  movieOverview.classList.add('movie-overview');

  //? 평점
  const movieRating = document.createElement('span');
  movieRating.textContent = `평점: ${vote_average}`;
  movieRating.classList.add('movie-rating');

  movieCard.appendChild(img);
  movieCard.appendChild(contentContainer);

  contentContainer.appendChild(movieTitle);
  // contentContainer.appendChild(movieOverview);
  contentContainer.appendChild(movieRating);

  movieCard.addEventListener('click', moveSub);

  return movieCard;
};

const renderMovies = (moviesData) => {
  const moviesContainer = document.querySelector('.card-list');
  moviesContainer.innerHTML = '';

  moviesData.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    moviesContainer.appendChild(movieCard);
  });
};

const moveSub = (e) => {
  location.href = `./html/sub.html?movieId=${e.currentTarget.id}`;
};

const searchMovies = (movies) => {
  const searchText = document.getElementById('search-input').value.toLowerCase();
  // console.log(document.getElementById('search-input').value);
  if (searchText === '') {
    alert('검색어를 입력해주세요.');
    return;
  }
  const filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(searchText));
  renderMovies(filteredMovies);
};

document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault();
  searchMovies(moviesData);
});

/**
 * 메인으로 돌아가는 버튼
 * */
document.querySelector('header h1').addEventListener('click', () => {
  window.location.reload();
});

/**
 * 최상단으로 가는 버튼
 * */
document.querySelector('.up-btn').addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

/**
 * 검색창 초기화 버튼
 * */
const resetBtn = document.querySelector('#reset-btn');
const inputValue = document.querySelector('#search-input');
resetBtn.addEventListener('click', () => {
  getMovies();
  console.log(inputValue.value);
  inputValue.value = '';
});

/**
 * 스와이퍼 셋팅
 * */
const setupSwiper = () => {
  const swiperOption = {
    slidesPerView: 6,
    loop: true,
    centeredSlides: false,
    spaceBetween: 15,
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  const TYPE_SET = new Set([MY_SWIPER, SUB_SWIPER]);

  for (const type of TYPE_SET) {
    new Swiper(`.${type}`, swiperOption);
  }
};

/**
 * 영화들 조회 핸들러
 * */
const getMoviesHandler = () => {
  let promiseList = [];

  REQUEST_ARGUMENT_MAP_LIST.forEach((requestMap) => {
    promiseList.push(
      fetchMoviesInfo(requestMap.get('url'), (response) =>
        makeMoviesHtml(response, requestMap.get('type'), requestMap.get('category'))
      )
    );
  });

  // 병렬 처리 후 성공한 것만 html 셋팅
  Promise.all(promiseList).then((htmlList) => {
    const movieContainerElement = document.querySelector('.movie-container');
    htmlList
      .filter((value) => value !== undefined)
      .forEach((html) => {
        movieContainerElement.appendChild(html);
        setupSwiper();
      });
  });
};

/**
 *  영화 정보 조회
 * */
const fetchMoviesInfo = async (url, makeHtmlCallBack) => {
  return fetchUtils
    .get(url, (method) => fetchUtils.setupOptions(method, fetchUtils.APPLICATION_JSON, API_KEY))
    .then((response) => response.json())
    .then((responseOfJson) => makeHtmlCallBack(responseOfJson))
    .catch((e) => console.log(e));
};

/**
 * 영화 HTML Make
 * */
const makeMoviesHtml = (response, type, category) => {
  const wrapperDiv = document.createElement('div');

  wrapperDiv.innerHTML = `
        <div #swiperRef="" class="swiper ${type}">
                  <h1 class="movie-category">
            ${category}
          </h1>
        <div class="swiper-wrapper">
        </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
      </div>
      <div class="divider"></div>
  `;

  const imageClassName = type === SUB_SWIPER ? 'sub' : '';
  const hidden = type === SUB_SWIPER ? 'hidden' : '';
  const maxSize = type === MY_SWIPER ? 10 : response.results.length;

  for (let i = 0; i < maxSize; i++) {
    const { id, poster_path: posterPath } = response.results[i];
    let html = ` 
         <div class="swiper-slide ${imageClassName}" id="${id}" >
              <h1 class="movie-top-10" style="font-size: 100px; margin-left: 0px; color: white" ${hidden}>${i + 1} </h1>
            <img class="${imageClassName}" src="${IMAGE_BASE_URL}${IMAGE_PATH}${posterPath}"/>
         </div>`;

    let swiperWrapperElement = wrapperDiv.querySelector('.swiper-wrapper');
    swiperWrapperElement.innerHTML += html;
  }

  const swiperSlide = wrapperDiv.querySelectorAll('.swiper-slide');
  swiperSlide.forEach((item) => {
    item.addEventListener('click', moveSub);
  });
  return wrapperDiv;
};
