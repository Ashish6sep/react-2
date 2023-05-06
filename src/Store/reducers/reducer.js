import { combineReducers } from "redux";
import flashMessages from "./flashMessages";
import cart from "./cart";
import meals from "./meals";
import auth from "./auth";

export default combineReducers({
    flashMessages,
    cart,
    meals,
    auth
});
