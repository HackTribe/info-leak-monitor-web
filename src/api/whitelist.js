import { DEL_WHITELIST, GET_WHITELIST, POST_WHITELIST } from "../config";
import axios from "./axios";

export const getWhiteListRequest = (kind = "all", per = "10", page = "1") => {
  if (kind === "all")
    return axios().get(`${GET_WHITELIST}?per=${per}&page=${page}`);
  else {
    return axios().get(`${GET_WHITELIST}/${kind}?per=${per}&page=${page}`);
  }
};

export const removeWhiteListRequest = (id) => {
  return axios("已成功删除！").delete(`${DEL_WHITELIST}/${id}`);
};

export const postWhiteListRequest = (data) => {
  return axios("添加成功！").post(`${POST_WHITELIST}`, data);
};
