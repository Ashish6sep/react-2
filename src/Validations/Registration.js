import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

function removeSpaces(string){
  return string.split(' ').join('');
}

export default function validateSignup(data) {
  let errors = {};

  if (validator.isEmpty(data.reg_email)) {
    errors.reg_email = 'This field is required';
  }
  if (!validator.isEmail(data.reg_email)) {
    errors.reg_email = 'Email is invalid';
  }
  if (validator.isEmpty(data.reg_password)) {
    errors.reg_password = 'This field is required';
  }
  if (validator.isEmpty(data.captcha_input)) {
    errors.captcha_input = 'This field is required';
  }
  if (data.captcha_input !== removeSpaces(data.captchaCode)) {
    errors.captcha_input = 'Captcha did not match';
  }

  return {
    errors,
    isValid: isEmpty(errors),
    isFormValid:isEmpty(errors)
  }
}