const emailReg =
  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
const passwordReg =
  /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

export const validateEmail = (email: string) => {
  if (!emailReg.test(email)) {
    return true;
  } else {
    return false;
  }
};

export const validataPassword = (password: string) => {
  if (!passwordReg.test(password)) {
    return true;
  } else {
    return false;
  }
};
