// 좋아요 버튼
const likeBtn = document.querySelector('.like_btn');
const movieCard = document.querySelector('.movie-card');
const likeContainer = document.querySelector('.like-container');

function createLike() {}

function saveLike(savedLikes) {
  localStorage.setItem('like', JSON.stringify(savedLikes));
}

function likeMovie() {
  likeBtn.classList.toggle('on');
  const urlId = window.location.search.split('=')[1];
  const savedLikes = JSON.parse(localStorage.getItem('like')) || []; // like(키) 없을 때

  if (savedLikes.includes(urlId)) {
    return;
  } else {
    savedLikes.push(urlId);
    saveLike(savedLikes);
  }

  savedLikes.forEach(createLike);
}

likeBtn.addEventListener('click', likeMovie);
