
export const validatePassword = (password) => {
  if (password.length < 4 || password.length > 10) {
    return {
      res: false,
      message: "패스워드는 4자 이상, 10자 이하이어야 합니다."
    };
  }
  return { res: true };
}

export const validateBlank = (content) => {
  if (content.trim() === '') {
    return { res: false, message: '내용을 입력해주세요.' };
  }

  return { res: true };
}