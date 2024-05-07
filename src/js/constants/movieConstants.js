const API_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ODY4MmJiOWIwZDc4YTMxMjM1OTAzMGZhZWMxZDEzYSIsInN1YiI6IjY2MzQ5YTRlYzM5MjY2MDEyYjZlMzYzMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.u1clLls5byAkt-E2OjSfZrRRi27ixM-w4wTQl6QN6EQ';
const BASE_URL_KEY = 'https://api.themoviedb.org';
const MOVIE_PATH = '/3/movie';
const MOVIES_PATH = `${MOVIE_PATH}/top_rated?language=ko-KR&page=1`;

const IMAGE_BASE_URL = 'https://image.tmdb.org';
const IMAGE_PATH = '/t/p/w500/';

const MY_SWIPER = 'mySwiper';
const SUB_SWIPER = 'subSwiper';

const REQUEST_ARGUMENT_MAP_LIST = [
  new Map([
    ['url', `${BASE_URL_KEY}${MOVIE_PATH}/top_rated?language=ko&page=1`],
    ['type', MY_SWIPER],
    ['category', '영화 Top 10 '],
  ]),

  new Map([
    ['url', `${BASE_URL_KEY}${MOVIE_PATH}/now_playing?language=ko&page=3`],
    ['type', SUB_SWIPER],
    ['category', '지금 볼 수 있는 영화'],
  ]),

  new Map([
    ['url', `${BASE_URL_KEY}${MOVIE_PATH}/popular?language=ko&page=1`],
    ['type', SUB_SWIPER],
    ['category', '인기 영화'],
  ]),

  new Map([
    ['url', `${BASE_URL_KEY}${MOVIE_PATH}/upcoming?language=en-US&page=1`],
    ['type', SUB_SWIPER],
    ['category', '개봉 예정 영화'],
  ]),

  new Map([
    ['url', `${BASE_URL_KEY}${MOVIE_PATH}/popular?language=ko&page=2`],
    ['type', SUB_SWIPER],
    ['category', '선물 하기 좋은 영화'],
  ]),

  new Map([
    ['url', `${BASE_URL_KEY}${MOVIE_PATH}/popular?language=ko&page=3`],
    ['type', SUB_SWIPER],
    ['category', '집에서 보기 좋은 영화'],
  ]),

  new Map([
    ['url', `${BASE_URL_KEY}${MOVIE_PATH}/popular?language=ko&page=4`],
    ['type', SUB_SWIPER],
    ['category', '5.1채널 지원 고음질 콘텐츠'],
  ]),
];
