import axios from './axios';
import { GET_ACCESS_TOKENS, POST_ACCESS_TOKEN, DEL_ACCESS_TOKEN } from "../config";

export const getAccessTokensRequest = (kind="all") => {
    if(kind === "all")
        return axios().get(`${GET_ACCESS_TOKENS}`);
    else{
        return axios().get(`${GET_ACCESS_TOKENS}/${kind}`);
    }
};


export const removeAccessTokensRequest = (kind,token) => {
    return axios("已成功删除！").delete(`${DEL_ACCESS_TOKEN}`, [token]);
};


export const postAccessTokensRequest = (data) => {
    return axios("添加成功！").post(`${POST_ACCESS_TOKEN}`, data);
};
