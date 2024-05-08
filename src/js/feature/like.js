// 좋아요 버튼
const likeBtn = document.querySelector('.like_btn');

function saveLike(savedLikes) {
  localStorage.setItem('like', JSON.stringify(savedLikes));
}

function likeMovie() {
  likeBtn.classList.toggle('on');
  const urlId = window.location.search.split('=')[1];
  const savedLikes = JSON.parse(localStorage.getItem('like')) || []; // like(키) 없을 때

  if (savedLikes.includes(urlId)) {
    localStorage.setItem('like', JSON.stringify(savedLikes.filter((likeMovieId) => likeMovieId !== urlId)));
    return;
  } else {
    savedLikes.push(urlId);
    saveLike(savedLikes);
  }
}

function checkMovieLikedStatus(movieId) {
  let likeMovies = localStorage.getItem('like');

  if (likeMovies !== null && likeMovies.includes(movieId.toString())) {
    const likeBtn = document.querySelector('.like_btn');
    likeBtn.classList.toggle('on');
  }
}

likeBtn.addEventListener('click', likeMovie);
