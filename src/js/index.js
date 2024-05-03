const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNzA5MTZmN2I0NzQyMGFhMjYzNWJlY2E2NjFjMjVkZiIsInN1YiI6IjY2MjYwOTAyNjNkOTM3MDE4Nzc0MGZiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Lj5NbVCVHmBGRLI-iHDmhau9pA4XE04pa-SrqG3_Zlc';
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500/'


const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  },
};


let moviesData = [];

const getMovies = async () => {
  try {
    const response = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1', options);
    const data = await response.json();
    // console.log(data.results)
    moviesData = data.results;
    renderMovies(moviesData);
  } catch (error) {
    console.error(error);
  }
}

const createMovieCard = moviesData => {
  const { id, poster_path, title, overview, vote_average } = moviesData;

  //? 영화 카드의 컨테이너를 생성
  const movieCard = document.createElement('div');
  movieCard.classList.add('movie-card');
  movieCard.id = id;

  //? 영화 포스터 이미지
  const img = document.createElement('img');
  img.src = `${IMAGE_URL}${poster_path}`;
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
  movieRating.textContent = `Rating: ${vote_average}`;
  movieRating.classList.add('movie-rating');


  movieCard.appendChild(img);
  movieCard.appendChild(contentContainer);

  contentContainer.appendChild(movieTitle);
  contentContainer.appendChild(movieOverview);
  contentContainer.appendChild(movieRating);

  movieCard.addEventListener('click', showMovieId);

  return movieCard;
}

const renderMovies = moviesData => {
  const moviesContainer = document.querySelector('.card-list');
  moviesContainer.innerHTML = '';

  moviesData.forEach(movie => {
    const movieCard = createMovieCard(movie);
    moviesContainer.appendChild(movieCard);
  });
}

const showMovieId = (e) => {
  window.alert(`영화 ID: ${e.currentTarget.id}`);
};


const searchMovies = (movies) => {
  const searchText = document.getElementById('search-input').value.toLowerCase();
  // console.log(document.getElementById('search-input').value);
  if (searchText === '') {
    alert("검색어를 입력해주세요.");
    return
  }
  const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(searchText));
  renderMovies(filteredMovies);
}

document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault();
  searchMovies(moviesData);
});
// 메인으로 돌아가는 버튼
document.querySelector('header h1').addEventListener(
  'click', () => {
    window.location.reload();
  });
document.querySelector('.up-btn').addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

getMovies();

const swiperOption = {
  slidesPerView: 6,
  loop: true,
  centeredSlides: true,
  spaceBetween: 15,
  pagination: {
    el: ".swiper-pagination",
    type: "fraction",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
}

const mainSwiper = new Swiper(".mySwiper", swiperOption);
const subSwiper = new Swiper(".subSwiper", swiperOption);

    






