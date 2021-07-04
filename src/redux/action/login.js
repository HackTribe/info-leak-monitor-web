import { LOGIN,LOGOUT } from "./action_type";

export const loginAction = (value) => {
    localStorage.setItem('username', value.username);
    localStorage.setItem('token', value.access_token);
    localStorage.setItem('isLogin', true);
    return {type:LOGIN, data:value};
};
export const logoutAction = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('isLogin');
    return {type:LOGOUT};
};

export const loginAsyncAction = (value, delay) => {
    return (dispatch) => {
        setTimeout(()=>{
            dispatch(loginAction(value));
        }, delay);
    };
};
