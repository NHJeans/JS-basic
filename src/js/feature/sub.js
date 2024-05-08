const fetchUtils = new FetchUtils();

/**
 * 돔 생성시
 * */
document.addEventListener('DOMContentLoaded', async function () {
  let queryParams = new URLSearchParams(window.location.search);
  const movieId = queryParams.get('movieId');

  await getMovieDetailHandler(movieId);
});

/**
 * 영화 모든 정보 조회
 * */
const getMovieDetailHandler = async (movieId) => {
  if (movieId == null) {
    alert('잘못된 접근입니다.');
    history.back();
  }

  // 영화 기본 정보
  const movieDefaultInfoHtml = fetchMovieDetailInfo(`${BASE_URL_KEY}${MOVIE_PATH}/${movieId}?language=ko`, (response) =>
    makeMovieDefaultInfoHtml(response)
  );

  //등장인물
  const movieCastInfoHtml = fetchMovieDetailInfo(
    `${BASE_URL_KEY}${MOVIE_PATH}/${movieId}/credits?language=ko`,
    (response) => makeMovieCastInfoHtml(response)
  );

  //관련 영상 정보
  const movieVideoInfoHtml = fetchMovieDetailInfo(
    `${BASE_URL_KEY}${MOVIE_PATH}/${movieId}/videos?language=en-US`,
    (response) => makeMovieVideoInfoHtml(response)
  );

  // 모든 프로미스를 병렬로 처리하며  error 처리는 한 곳에서 처리
  await Promise.all([movieDefaultInfoHtml, movieCastInfoHtml, movieVideoInfoHtml]).catch((e) => {
    console.error(e);
    alert('시스템 오류 다시 시도해주세요');
    history.back();
  });

  //블로킹되는 부분을 최소화 하기위해 많은 시간이 블로킹되는 반복문과 API호출을 병렬로 선작업하고 만들어진 Html을 여기서 셋팅
  movieVideoInfoHtml.then((html) => (document.getElementById('video_list').innerHTML = html));
  movieCastInfoHtml.then((html) => (document.getElementById('char_list').innerHTML = html));
  movieDefaultInfoHtml.then((html) => (document.getElementById('info_list').innerHTML = html));
};

/**
 *  영화 상세 정보 조회
 * */
const fetchMovieDetailInfo = (url, makeHtmlCallBack) => {
  return fetchUtils
    .get(url, (method) => fetchUtils.setupOptions(method, fetchUtils.APPLICATION_JSON, API_KEY))
    .then((response) => response.json())
    .then((responseOfJson) => makeHtmlCallBack(responseOfJson));
};

/**
 * 관련 영상 HTML 생성
 * */
const makeMovieVideoInfoHtml = async (response) => {
  if (response.results.length === 0) {
    return `<li>관련 영상이 없습니다.</li>`;
  }

  let html = '';
  for (const video of response.results) {
    let videoInfo = {
      thumbnailSrc: `https://img.youtube.com/vi/${video.key}/mqdefault.jpg`,
      title: video.name,
      hrefUrl: `https://www.youtube.com/watch?v=${video.key}`,
    };

    if (video.site === 'Vimeo') {
      await fetchUtils
        .get(`https://vimeo.com/api/v2/video/${video.key}.json`, {})
        .then((response) => response.json())
        .then((response) => {
          videoInfo.thumbnailSrc = response[0].thumbnail_large;
          videoInfo.hrefUrl = `https://vimeo.com/${video.key}`;
        })
        .catch((e) => {
          console.error(e);
          alert('시스템 오류 다시 시도해주세요');
          history.back();
        });
    } else if (video.site !== 'YouTube') {
      continue;
    }

    html += `
      <li class="image-container">
        <a
          href="${videoInfo.hrefUrl}"
          target="_blank"
          title="${videoInfo.title}"
        >
          <div>
            <img class="image-play" src="../asset/play-mark.png"/>
          </div>
          <img
            class="img"
            src="${videoInfo.thumbnailSrc}"
          />
        </a>
      </li>
    `;
  }

  return html;
};

/**
 * 영화 기본정보 HTML 생성
 * */
const makeMovieDefaultInfoHtml = (response) => {
  let title = document.getElementById('title');
  title.innerText = response.title;

  let desc = document.getElementById('desc');
  desc.innerText = response.overview;

  document.getElementById('movie_image').src = `${IMAGE_BASE_URL}${IMAGE_PATH}${response.backdrop_path}`;

  let html = `
    <li>평균 ${response.vote_average}</li>
    <li>${response.release_date}</li>
    <li>${response.runtime}분</li>
  `;

  response.genres.forEach((genre) => {
    html += `<li>${genre.name}</li>`;
  });

  return html;
};

/**
 * 영화 등장인물 HTML 생성
 * */
const makeMovieCastInfoHtml = (response) => {
  let html = '';
  let filteringResponse = response.cast.filter((cast) => cast.profile_path !== null);

  let size = filteringResponse.length > 10 ? 10 : filteringResponse.length;

  for (let i = 0; i < size; i++) {
    let { profile_path, name, character } = filteringResponse[i];
    html += `
      <li>
        <img
          class="img"
          src="${IMAGE_BASE_URL}${IMAGE_PATH}${profile_path}"
          alt=""
        />
        <div class="txt_area">
          <strong>${name}</strong>
          <p>${character}</p>
        </div>
      </li>
    `;
  }

  return html;
};
