import axios from './axios';
import { UPDATE_USER_PASSWORD } from "../config";

export const updateUserPasswordRequest = (data) => {
    return axios("已修改密码，请重新登录认证！").post(`${UPDATE_USER_PASSWORD}`, data);
    
};
