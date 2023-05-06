import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateUserProfile(data) {
  let errors = {};

  if (validator.isEmpty(data.first_name)) {
    errors.first_name = 'This field is required';
  }
  if (validator.isEmpty(data.last_name)) {
    errors.last_name = 'This field is required';
  }
  if (validator.isEmpty(data.displayname)) {
    errors.displayname = 'This field is required';
  }
  if (validator.isEmpty(data.email)) {
    errors.email = 'This field is required';
  }
  if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
if(!validator.isEmpty(data.password_current)){
    if (validator.isEmpty(data.password_new)) {
        errors.password_new = 'This field is required';
    }
    if (validator.isEmpty(data.re_password_new)) {
        errors.re_password_new = 'This field is required';
    }
    if (!validator.equals(data.password_new, data.re_password_new)) {
        errors.re_password_new = 'Passwords must match';
    }
}

  return {
    errors,
    isValid: isEmpty(errors),
    isFormValid:isEmpty(errors)
  }
}