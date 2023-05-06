import { ADD_TO_CART } from '../actions/actionTypes';
import shortid from 'shortid';

export default (state = [], action = {}) => {
    switch(action.type) {
        case ADD_TO_CART:
        return [
            // ...state,
            action.value
        ];
        default: return state;
    }
}