
// 리뷰 작성
const getElementValue = (id) => document.getElementById(id).value;

document.getElementById('saveBtn').addEventListener('click', () => {
  const author = getElementValue('author');
  console.log(author);
  const content = getElementValue('content');
  const password = getElementValue('password');
  const uuid = crypto.randomUUID();
  const reviewData = {
    author,
    content,
    password,
    uuid
  };
  if (author === '' || content === '' || password === '') {
    alert('모든 항목을 입력해주세요');
    return;
  }
  // 로컬 스토리지에 저장
  localStorage.setItem(`review_${uuid}`, JSON.stringify(reviewData));
  alert('리뷰가 저장되었습니다.');

});


const getReviewData = () => {
  const reviewData = new Array();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.includes('review_')) {
      const data = JSON.parse(localStorage.getItem(key));
      reviewData.push(data);
    }
  }
  return reviewData;
}


const renderReviews = () => {
  const reviewData = getReviewData();
  const reviewContainer = document.getElementById('reviewContainer');
  reviewContainer.innerHTML = ''

  reviewData.forEach(review => {
    const reviewElement = createElementReview(review);
    reviewContainer.appendChild(reviewElement);
  })
};


const createElementReview = (review) => {
  const reviewElement = document.createElement('div');
  reviewElement.classList.add('review-list');
  reviewElement.id = `review_${review.uuid}`;

  const authorElement = document.createElement('p');
  authorElement.textContent = review.author;
  authorElement.classList.add('review-author');

  const contentElement = document.createElement('p');
  contentElement.textContent = review.content;
  contentElement.classList.add('review-content');
  reviewElement.appendChild(authorElement);
  reviewElement.appendChild(contentElement);

  if (localStorage.getItem(`review_${review.uuid}`)) {
    appendControlButtons(reviewElement, review.uuid);
  }

  return reviewElement;
};

const appendControlButtons = (reviewElement, uuid) => {
  const editButton = document.createElement('button');
  editButton.textContent = '수정';
  editButton.onclick = () => inputPassword(uuid, handleEdit);
  reviewElement.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = '삭제';
  deleteButton.onclick = () => inputPassword(uuid, handleDelete);
  reviewElement.appendChild(deleteButton);
};

const inputPassword = (uuid, onSuccess) => {
  let passwordInput = document.getElementById(`password_${uuid}`);
  if (!passwordInput) {
    const reviewElement = document.getElementById(`review_${uuid}`);
    passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.placeholder = '패스워드 입력';
    passwordInput.id = `password_${uuid}`;
    reviewElement.appendChild(passwordInput);

    const confirmButton = document.createElement('button');
    confirmButton.textContent = '확인';
    confirmButton.onclick = () => verifyPassword(uuid, passwordInput, onSuccess);
    reviewElement.appendChild(confirmButton);
  }
};

const verifyPassword = (uuid, passwordInput, onSuccess) => {
  const inputPassword = passwordInput.value;
  const review = JSON.parse(localStorage.getItem(`review_${uuid}`));
  if (inputPassword === review.password) {
    onSuccess(uuid, review);
    passwordInput.remove();
    passwordInput.nextSibling.remove();
  } else {
    alert('패스워드가 일치하지 않습니다.');
  }
};

const handleDelete = (uuid, review) => {
  if (confirm('리뷰를 삭제하시겠습니까?')) {
    localStorage.removeItem(`review_${uuid}`);
    renderReviews();
  }
};

const handleEdit = (uuid, review) => {
  const reviewElement = document.getElementById(`review_${uuid}`);
  reviewElement.innerHTML = '';
  const authorInput = document.createElement('input');
  authorInput.value = review.author;
  const contentInput = document.createElement('textarea');
  contentInput.value = review.content;

  const updateButton = document.createElement('button');
  updateButton.textContent = '업데이트';
  updateButton.onclick = () => {
    review.author = authorInput.value;
    review.content = contentInput.value;
    localStorage.setItem(`review_${uuid}`, JSON.stringify(review));
    alert('리뷰가 업데이트되었습니다.');
    renderReviews();
  };

  reviewElement.appendChild(authorInput);
  reviewElement.appendChild(contentInput);
  reviewElement.appendChild(updateButton);
};

renderReviews();
