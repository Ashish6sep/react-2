import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function PasswordReset(data) {
  let errors = {};

  if (validator.isEmpty(data.user_login)) {
    errors.user_login = 'This field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
    isFormValid:isEmpty(errors)
  }
}