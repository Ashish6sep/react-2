import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

function removeSpaces(string){
    return string.split(' ').join('');
}

export default function validateContactForm(data) {
  let errors = {};

  if (validator.isEmpty(data.name)) {
    errors.name = 'This field is required';
  }
  if (validator.isEmpty(data.subject)) {
    errors.subject = 'This field is required';
  }
  if (validator.isEmpty(data.email)) {
    errors.email = 'This field is required';
  }
  if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
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