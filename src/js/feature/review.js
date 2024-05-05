import { validateBlank, validatePassword } from "../utils/validation.js";

// 리뷰 작성
const getElementValue = (id) => document.getElementById(id).value;
const reviewKey = 'review_'

document.getElementById('saveBtn').addEventListener('click', (e) => {
  e.preventDefault();

  const author = getElementValue('author');
  console.log(author);
  const content = getElementValue('content');
  const password = getElementValue('password');
  const uuid = crypto.randomUUID();
  const movieId = new URLSearchParams(window.location.search).get('movieId');

  if (validateBlank(author).res === false) {
    alert(validateBlank(author).message);
    return;
  }
  if (validateBlank(content).res === false) {
    alert(validateBlank(content).message);
    return;
  }
  if (validatePassword(password).res === false) {
    alert(validatePassword(password).message);
    return;
  }

  const reviewData = {
    author,
    content,
    password,
    uuid,
    movieId
  };
  try {
    localStorage.setItem(`${reviewKey}${uuid}`, JSON.stringify(reviewData));
    alert('리뷰가 저장되었습니다.');
    // 리다이렉션
    redirectToDetailPage(movieId);
  } catch (e) {
    console.error('리뷰 저장 오류:', e);
    alert('리뷰 저장 중 오류가 발생했습니다.');
  }
});
const redirectToDetailPage = (movieId) => {
  window.location.href = `sub.html?movieId=${movieId}`
};
/**
 * @returns {Array} Array of review objects.
 * @description 로컬 스토지에 저장된 데이터를 순회하며 'review_'로 시작하는 키를 가진 데이터를 찾아 배열에 추가
 */
const getReviewData = () => {
  const currentMovieId = new URLSearchParams(window.location.search).get('movieId');
  const reviewData = new Array();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.includes('review_')) {
      const data = JSON.parse(localStorage.getItem(key));
      if (data.movieId === currentMovieId) { // 현재 페이지의 movieId와 일치하는 데이터만 추가
        reviewData.push(data);
      }
    }
  }
  return reviewData;
}
/**
 * @description 리뷰 데이터를 가져와서 리뷰를 렌더링
 */

const renderReviews = () => {
  const reviewData = getReviewData();
  const reviewContainer = document.getElementById('reviewContainer');
  reviewContainer.innerHTML = ''

  reviewData.forEach(review => {
    const reviewElement = createElementReview(review);
    reviewContainer.appendChild(reviewElement);
  })
};


/**
 * @description 리뷰 데이터를 받아 리뷰를 나타내는 HTML 요소를 생성, 로컬스토리지에서 고유값 uuid를 찾아 리뷰를 삭제할 수 있는 버튼을 추가
 *
 * @param {Object} review 리뷰 데이터 객체, 'uuid', 'author', 'content' 속성을 포함해야 함
 * @returns {HTMLElement} 리뷰를 나타내는 HTML 요소를 반환.
 */
const createElementReview = (review) => {
  const reviewElement = document.createElement('div');
  reviewElement.classList.add('review-list');
  reviewElement.id = `${reviewKey}${review.uuid}`;

  const detailsElement = document.createElement('div');
  detailsElement.classList.add('review-content-cont');


  const authorElement = document.createElement('p');
  authorElement.textContent = review.author;
  authorElement.classList.add('review-author');

  const contentElement = document.createElement('p');
  contentElement.textContent = review.content;
  contentElement.classList.add('review-content');


  detailsElement.appendChild(authorElement);
  detailsElement.appendChild(contentElement);
  reviewElement.appendChild(detailsElement);

  // if (review.author === getElementValue('author')) {
  //   appendControlButtons(reviewElement, review.uuid);
  // }
  if (localStorage.getItem(`${reviewKey}${review.uuid}`)) {
    appendControlButtons(reviewElement, review.uuid);
  }

  return reviewElement;
};

/**
 * @description 리뷰 요소에 수정 및 삭제 버튼을 추가, 각 버튼은 클릭 시 패스워드 입력을 요청, 입력 후에 각각 수정 및 삭제 작업을 실행.
 * @param {HTMLElement} reviewElement 리뷰를 표시하는 HTML 요소, 이 요소에 버튼이 추가
 * @param {string} uuid 리뷰의 고유 식별자, 수정 및 삭제 작업을 식별하기 위해 사용.
 */
const appendControlButtons = (reviewElement, uuid) => {
  const reviewButtonDiv = document.createElement('div');
  reviewButtonDiv.classList.add('review-button-div');

  const editButton = document.createElement('button');
  editButton.textContent = '수정';
  editButton.classList.add('review-edit-btn');
  editButton.addEventListener('click', () => inputPassword(uuid, handleEdit));
  reviewButtonDiv.appendChild(editButton);


  const deleteButton = document.createElement('button');
  deleteButton.textContent = '삭제';
  deleteButton.classList.add('review-delete-btn');
  deleteButton.addEventListener('click', () => inputPassword(uuid, handleDelete));
  reviewButtonDiv.appendChild(deleteButton);

  reviewElement.appendChild(reviewButtonDiv);
};

/**
 * @description 리뷰 요소에 패스워드 입력을 요청하는 input 요소를 추가하고, 확인 버튼을 추가.
 * 비밀번호 필드가 이미 존재하지 않는 경우, 새로운 입력 필드와 버튼을 생성하여 리뷰 요소에 추가.
 * 확인 버튼 클릭 시, 비밀번호 검증 함수를 호출.
 * @param {string} uuid 리뷰의 고유 식별자, 해당 리뷰에 대한 비밀번호 입력을 위해 사용.
 * @param {Function} onSuccess 비밀번호가 성공적으로 검증된 후 호출될 콜백 함수.
 */
const inputPassword = (uuid, onSuccess) => {
  let passwordInput = document.getElementById(`password_${uuid}`);
  if (!passwordInput) {
    const reviewElement = document.getElementById(`${reviewKey}${uuid}`);
    passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.placeholder = '패스워드를 입력';
    passwordInput.id = `password_${uuid}`;
    reviewElement.appendChild(passwordInput);

    const confirmButton = document.createElement('button');
    confirmButton.textContent = '확인';
    confirmButton.classList.add('confirm-btn');
    confirmButton.addEventListener('click', () => verifyPassword(uuid, passwordInput, onSuccess));
    reviewElement.appendChild(confirmButton);
  }
};

/**
 * @description 입력된 비밀번호가 유효한지 확인하고, 비밀번호가 일치하는 경우 콜백 함수를 호출.
 * @param {string} uuid 고유 식별자, 리뷰 데이터를 찾기 위해 사용
 * @param {HTMLElement} passwordInput 비밀번호 입력을 위한 input 요소
 * @param {Function} onSuccess 비밀번호 검증 후 호출할 콜백 함수.
 */
const verifyPassword = (uuid, passwordInput, onSuccess) => {
  const inputPassword = passwordInput.value;
  const review = JSON.parse(localStorage.getItem(`${reviewKey}${uuid}`));
  if (inputPassword === review.password) {
    onSuccess(uuid, review);
    passwordInput.remove();
  } else {
    alert('패스워드가 일치하지 않습니다.');
  }
};

/**
 * @description 리뷰를 삭제하는 함수
 * @param {string} uuid
 */
const handleDelete = (uuid) => {
  if (confirm('리뷰를 삭제하시겠습니까?')) {
    localStorage.removeItem(`${reviewKey}${uuid}`);
    renderReviews();
  }
};

/**
 * @description 리뷰를 수정하는 함수
 * @param {string} uuid 고유 식별자
 * @param {Object} review 수정될 리뷰의 데이터 객체, author,content 속성을 포함.
 */
const handleEdit = (uuid, review) => {
  const reviewElement = document.getElementById(`${reviewKey}${uuid}`);
  reviewElement.innerHTML = '';
  const authorInput = document.createElement('input');
  authorInput.value = review.author;
  const contentInput = document.createElement('textarea');
  contentInput.value = review.content;

  const updateButton = document.createElement('button');
  updateButton.textContent = '업데이트';
  updateButton.addEventListener('click', () => {
    if (validateBlank(authorInput.value).res === false) {
      alert('작성자 이름을 입력해주세요.');
      return;
    }
    if (validateBlank(contentInput.value).res === false) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }
    review.author = authorInput.value;
    review.content = contentInput.value;
    localStorage.setItem(`${reviewKey}${uuid}`, JSON.stringify(review));
    alert('리뷰가 업데이트되었습니다.');
    renderReviews();
  });

  reviewElement.appendChild(authorInput);
  reviewElement.appendChild(contentInput);
  reviewElement.appendChild(updateButton);
};

renderReviews();
