import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateLogin(data) {
  let errors = {};

  if (validator.isEmpty(data.user_login)) {
    errors.user_login = 'This field is required';
  }
  // if (!validator.isEmail(data.user_login)) {
  //   errors.user_login = 'Email is invalid';
  // }
  if (validator.isEmpty(data.password)) {
    errors.password = 'This field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
    isFormValid:isEmpty(errors)
  }
}