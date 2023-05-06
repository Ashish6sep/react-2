import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function distValidateSignup(data) {
  let errors = {};

  if (validator.isEmpty(data.first_name)) {
    errors.first_name = 'This field is required';
  }
  if (validator.isEmpty(data.last_name)) {
    errors.last_name = 'This field is required';
  }
  if (validator.isEmpty(data.username)) {
    errors.username = 'This field is required';
  }
  if (!validator.isEmail(data.username)) {
    errors.username = 'Username should be an email address';
  }
  if (validator.isEmpty(data.password)) {
    errors.password = 'This field is required';
  }
  if (validator.isEmpty(data.confirm_password)) {
    errors.confirm_password = 'This field is required';
  }
  if (data.password != data.confirm_password) {
    errors.confirm_password = 'Confirm password not match';
  }
  // if (validator.isEmpty(data.country)) {
  //   errors.country = 'This field is required';
  // }
  // if (validator.isEmpty(data.street)) {
  //   errors.street = 'This field is required';
  // }
  // if (validator.isEmpty(data.city)) {
  //   errors.city = 'This field is required';
  // }
  // if (validator.isEmpty(data.state)) {
  //   errors.state = 'This field is required';
  // }
  // if (validator.isEmpty(data.postcode)) {
  //   errors.postcode = 'This field is required';
  // }
  if (validator.isEmpty(data.phone)) {
    errors.phone = 'This field is required';
  }
  // if (validator.isEmpty(data.facebook_profile_url)) {
  //   errors.facebook_profile_url = 'This field is required';
  // }
  // if (validator.isEmpty(data.have_fitness_business)) {
  //   errors.have_fitness_business = 'This field is required';
  // }

  // if(data.gymlaunch_hybrid_model === "no") {
  //   if (validator.isEmpty(data.why_interested)) {
  //     errors.why_interested = 'This field is required';
  //   }
  // }

  // if(data.have_fitness_business === "yes") {
  //   if (validator.isEmpty(data.business_type)) {
  //     errors.business_type = 'This field is required';
  //   }
  //   if (validator.isEmpty(data.current_customers_no)) {
  //     errors.current_customers_no = 'This field is required';
  //   }
  //   // if (!validator.isInt(data.current_customers_no)) {
  //   //   errors.current_customers_no = 'This field should be integer';
  //   // }
  //   if (validator.isEmpty(data.monthly_gross_revenue)) {
  //     errors.monthly_gross_revenue = 'This field is required';
  //   }
  //   // if (!validator.isNumeric(data.monthly_gross_revenue)) {
  //   //   errors.monthly_gross_revenue = 'This field should be numeric';
  //   // }
  // }

  // if(data.have_fitness_business === "future_plane") {
  //   if (validator.isEmpty(data.business_type)) {
  //     errors.business_type = 'This field is required';
  //   }
  //   if (validator.isEmpty(data.business_type)) {
  //     errors.business_type = 'This field is required';
  //   }
  // }

  if (validator.isEmpty(data.terms_of_service_agree)) {
    errors.terms_of_service_agree = 'You must agree with terms of service';
  }

  return {
    errors,
    isValid: isEmpty(errors),
    isFormValid: isEmpty(errors)
  }
}