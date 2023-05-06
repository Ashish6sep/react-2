import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function NewPasswordReset(data) {
  let errors = {};

  if (validator.isEmpty(data.password)) {
    errors.password = 'This field is required';
  }
  if (validator.isEmpty(data.confirm_password)) {
    errors.confirm_password = 'This field is required';
  }
  if (data.password !== data.confirm_password) {
    errors.confirm_password = 'Confirm password did not match';
  }

  return {
    errors,
    isValid: isEmpty(errors),
    isFormValid:isEmpty(errors)
  }
}