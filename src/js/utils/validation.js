
export const validatePassword = (password) => {
  if (password.length <= 4 || password >= 10) {
    return {
      isValid: false,
      message: "패스워드는 4자 이상, 10자 이하이어야 합니다."
    };
  }
  return { isValid: true, message: '패스워드 검증 성공' };
}
