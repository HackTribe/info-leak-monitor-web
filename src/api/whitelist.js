import axios from './axios';
import { GET_WHITELIST, POST_WHITELIST, DEL_WHITELIST } from "../config";

export const getWhiteListRequest = (kind="all") => {
    if(kind === "all")
        return axios().get(`${GET_WHITELIST}`);
    else{
        return axios().get(`${GET_WHITELIST}/${kind}`);
    }
};


export const removeWhiteListRequest = (id) => {
    return axios("已成功删除！").delete(`${DEL_WHITELIST}/${id}`);
};


export const postWhiteListRequest = (data) => {
    return axios("添加成功！").post(`${POST_WHITELIST}`, data);
};
