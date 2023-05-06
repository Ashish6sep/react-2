import $ from 'jquery';
import { API_URL, API_KEY, AJAX_REQUEST } from '../../Constants/AppConstants';
// import { CHECK_OUT } from './actionTypes';

// function ajax_request(type='POST', additional_url, data){
//     return $.ajax({
//         type: type,
//         url: API_URL + additional_url,
//         data: data
//     });
// }

export function checkoutRequest(cartData) {
    // cartData.api_key = API_KEY;
    return dispatch => {
        const request_result = AJAX_REQUEST("POST","order/create", cartData);
        request_result.then(results => {
            if(results.response.code===1000) {
                return results.response.data;
            } else {
                // console.log(results);
            }            
        });
        return request_result;
    }
}