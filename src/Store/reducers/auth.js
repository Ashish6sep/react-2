import { SET_CURRENT_USER } from '../actions/actionTypes';

const initialState = {
    isAuthenticated: false,
    user:{}
}

export default (state = initialState, action = {}) => {
    switch(action.type) {
        case SET_CURRENT_USER:
        const empty_check = (obj) => {
            return Object.keys(obj).length === 0;
        }
        return {
            isAuthenticated: !empty_check(action.user),
            user: action.user
        }
        default: return state;
    }
}