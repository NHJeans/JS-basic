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
    movieId,
    timestamp: Date.now()
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
      if (data.movieId === currentMovieId) {
        reviewData.push(data);
      }
    }
  }
  reviewData.sort((a, b) => b.timestamp - a.timestamp);
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

const convertTimestampToDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
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

  const dateElement = document.createElement('p');
  dateElement.textContent = `작성일 : ${convertTimestampToDate(review.timestamp)}`;
  dateElement.classList.add('review-content');

  detailsElement.appendChild(authorElement);
  detailsElement.appendChild(contentElement);
  detailsElement.appendChild(dateElement);
  reviewElement.appendChild(detailsElement);

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
 * @param {string} uuid 리뷰의 고유 식별자, 해당 리뷰에 대한 비밀번호 입력을 위해 사용.
 * @param {Function} onSuccess 비밀번호가 성공적으로 검증된 후 호출될 콜백 함수.
 */
const inputPassword = (uuid, onSuccess) => {
  Swal.fire({
    title: '비밀번호를 입력하세요',
    input: 'password',
    inputPlaceholder: '비밀번호를 입력하세요',
    showCancelButton: true,
    confirmButtonColor: '#f82f62',
    confirmButtonText: '확인',
    cancelButtonText: '취소',

    // 확인 버튼 클릭시 실행
    preConfirm: (password) => {
      const review = JSON.parse(localStorage.getItem(`${reviewKey}${uuid}`));
      if (password === review.password) {
        return true;
      } else {
        Swal.showValidationMessage('패스워드가 일치하지 않습니다.');
      }
    }
  }).then((result) => {
    if (result.isConfirmed) {
      onSuccess(uuid);
    }
  });
};


/**
 * @description 리뷰를 삭제하는 함수
 * @param {string} uuid
 */
const handleDelete = (uuid) => {
  Swal.fire({
    title: '정말로 삭제하시겠습니까?',
    text: "이 작업은 되돌릴 수 없습니다!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'red',
    cancelButtonColor: 'gray',
    confirmButtonText: '삭제',
    cancelButtonText: '취소',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem(`${reviewKey}${uuid}`);
      Swal.fire(
        '삭제 완료!',
        '리뷰가 성공적으로 삭제되었습니다.',
        'success'
      )
      renderReviews();
    }
  });
};


/**
 * @description 리뷰를 수정하는 함수
 * @param {string} uuid 고유 식별자
 * @param {Object} review 수정될 리뷰의 데이터 객체, author,content 속성을 포함.
 */
const handleEdit = (uuid) => {
  const review = JSON.parse(localStorage.getItem(`${reviewKey}${uuid}`));
  Swal.fire({
    title: '수정할 리뷰를 입력하세요',
    confirmButtonColor: '#f82f62',
    confirmButtonText: '수정',
    html: `
      <input id="swal-input1" class="swal2-input" placeholder="작성자" value="${review.author}">
      <textarea id="swal-input2" class="swal2-textarea" placeholder="리뷰 내용">${review.content}</textarea>`,
    focusConfirm: false,
    preConfirm: () => {
      const author = document.getElementById('swal-input1').value;
      const content = document.getElementById('swal-input2').value;
      return { author, content }
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const { author, content } = result.value;
      if (validateBlank(author).res === false || validateBlank(content).res === false) {
        Swal.fire({
          icon: 'error',
          title: '오류',
          text: '모든 필드를 채워주세요!',
          confirmButtonText: '닫기'
        });
      } else {
        review.author = author;
        review.content = content;
        localStorage.setItem(`${reviewKey}${uuid}`, JSON.stringify(review));
        Swal.fire({
          title: '수정완료',
          text: '리뷰가 수정되었습니다.',
          icon: 'success',
          confirmButtonColor: '#f82f62',
          confirmButtonText: '확인',
        })
        renderReviews();
      }
    }
  });
};

renderReviews();
