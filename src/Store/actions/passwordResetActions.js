import $ from 'jquery';

import { API_URL, AJAX_PUBLIC_REQUEST } from '../../Constants/AppConstants';

// function ajax_request(type='GET',additional_url,data){
//     return $.ajax({
//         type: type,
//         url: API_URL + additional_url,
//         data: data
//     });
// }

export function passwordResetRequest(userData) {
    return dispatch => {
        return AJAX_PUBLIC_REQUEST("POST","user/forgotPassword",userData);
    }
}