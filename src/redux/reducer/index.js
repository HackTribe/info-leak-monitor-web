import { combineReducers } from "redux";

import loginReducer from "./login";
import setTitle from "./menu";

export default combineReducers({
    userInfo:loginReducer,
    title: setTitle
});
