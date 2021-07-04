import { LOGIN,LOGOUT } from "../action/action_type";


let username = localStorage.getItem('username');
let token = localStorage.getItem('token');
let isLogin = username && token ? true:false;

let initUserState = {
    username: username || '',
    token: token || '',
    isLogin: isLogin
};

const loginReducer = (state=initUserState, action) =>{
    const {type, data} = action;
    switch (type) {
        case LOGIN:
            data.isLogin = true;
            return Object.assign(state, data);
        case LOGOUT:
            return {
                username:"",
                token: "",
                isLogin: false
            };
        default:
            break;
    }
    return state;
};

export default loginReducer;
