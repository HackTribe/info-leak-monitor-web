import axios from './axios';
import { USER_LOGIN } from "../config";

const LoginRequest = (data) => {
    return axios("登陆成功！").post(`${USER_LOGIN}`, data);
};

export default LoginRequest;
