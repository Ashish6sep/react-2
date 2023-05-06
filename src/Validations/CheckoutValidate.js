import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import { WordMatching } from '../Constants/AppConstants';

export default function checkoutValidate(data) {

    let errors = {};

    // Billing Validation
    if (validator.isEmpty(data.billing_first_name)) {
        errors.billing_first_name = 'This field is required';
    }
    if (validator.isEmpty(data.billing_last_name)) {
        errors.billing_last_name = 'This field is required';
    }
    // if (validator.isEmpty(data.billing_company)) {
    //    errors.billing_company = 'This field is required';
    // }  
    if (validator.isEmpty(data.billing_country)) {
        errors.billing_country = 'This field is required';
    }
    if (validator.isEmpty(data.billing_address_1)) {
        errors.billing_address_1 = 'This field is required';
    }

    if (data.ship_to_different_address != "checked") {
        if (WordMatching(data.billing_address_1)) {
            errors.billing_address_1 = 'This field is invalid';
            errors.billing_address_1_msg = WordMatching(data.billing_address_1);
        }
        if (data.billing_address_2 != null && WordMatching(data.billing_address_2)) {
            errors.billing_address_2 = 'This field is invalid';
            errors.billing_address_2_msg = WordMatching(data.billing_address_2);
        }
    }

    if (validator.isEmpty(data.billing_city)) {
        errors.billing_city = 'This field is required';
    }
    if (validator.isEmpty(data.billing_state)) {
        errors.billing_state = 'This field is required';
    }
    if (validator.isEmpty(data.billing_postcode)) {
        errors.billing_postcode = 'This field is required';
    }
    if (validator.isEmpty(data.billing_phone)) {
        errors.billing_phone = 'This field is required';
    }
    if (!validator.isEmail(data.billing_email)) {
        errors.billing_email = 'Email is invalid';
    }

    // Shipping Validation

    if (data.ship_to_different_address == "checked") {
        if (validator.isEmpty(data.shipping_first_name)) {
            errors.shipping_first_name = 'This field is required';
        }
        if (validator.isEmpty(data.shipping_last_name)) {
            errors.shipping_last_name = 'This field is required';
        }
        // if (validator.isEmpty(data.shipping_company)) {
        //    errors.shipping_company = 'This field is required';
        // }  
        if (validator.isEmpty(data.shipping_country)) {
            errors.shipping_country = 'This field is required';
        }
        if (validator.isEmpty(data.shipping_address_1)) {
            errors.shipping_address_1 = 'This field is required';
        }
        if (WordMatching(data.shipping_address_1)) {
            errors.shipping_address_1 = 'This field is invalid';
            errors.shipping_address_1_msg = WordMatching(data.shipping_address_1);
        }
        if (data.shipping_address_2 != null && WordMatching(data.shipping_address_2)) {
            errors.shipping_address_2 = 'This field is invalid';
            errors.shipping_address_2_msg = WordMatching(data.shipping_address_2);
        }
        if (validator.isEmpty(data.shipping_city)) {
            errors.shipping_city = 'This field is required';
        }
        if (validator.isEmpty(data.shipping_state)) {
            errors.shipping_state = 'This field is required';
        }
        if (validator.isEmpty(data.shipping_postcode)) {
            errors.shipping_postcode = 'This field is required';
        }
    }


    // if (validator.isEmpty(data.order_note)) {
    //    errors.order_note = 'This field is required';
    // }


    //   if (validator.isEmpty(data.payment_method)) {
    //       errors.payment_method = 'This field is required';
    //   }
    //   if (validator.isEmpty(data.name_on_card)) {
    //       errors.name_on_card = 'This field is required';
    //   }
    //   if (validator.isEmpty(data.card_number)) {
    //       errors.card_number = 'This field is required';
    //   }
    //   if (validator.isEmpty(data.expire_month)) {
    //       errors.expire_month = 'This field is required';
    //   }
    //   if (validator.isEmpty(data.expire_year)) {
    //       errors.expire_year = 'This field is required';
    //   }
    //   if (validator.isEmpty(data.cvv)) {
    //       errors.cvv = 'This field is required';
    //   }

    return {
        errors,
        isValid: isEmpty(errors),
        isFormValid: isEmpty(errors)
    }
}