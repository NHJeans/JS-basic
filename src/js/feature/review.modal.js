const modalElement = document.getElementById('reviewModalContainer');

const showModal = () => {
  modalElement.style.display = 'block';
};

const hideModal = () => {
  modalElement.style.display = 'none';
};

const handleClickOutside = (e) => {
  if (e.target === modalElement) {
    hideModal();
  }
};
document.getElementById('reviewBtn').addEventListener('click', showModal);
document.getElementById('cancelBtn').addEventListener('click', hideModal);
modalElement.addEventListener('click', handleClickOutside);
