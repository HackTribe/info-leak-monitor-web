import {
  DEL_TASK,
  GET_TASKS,
  GET_TASK_RESULTS,
  POST_TASK,
  PROCESS_TASK_RESULT,
  SEARCH_TASK_RESULTS,
  UPDATE_TASK
} from "../config";
import axios from "./axios";

export const getTasksRequest = (kind = "all") => {
  if (kind === "all") return axios().get(`${GET_TASKS}`);
  else {
    return axios().get(`${GET_TASKS}/${kind}`);
  }
};

export const removeTaskRequest = (id) => {
  return axios("已成功删除！").delete(`${DEL_TASK}/${id}`);
};

export const postTaskRequest = (data) => {
  return axios("添加成功！").post(`${POST_TASK}`, data);
};

export const putTaskRequest = (data) => {
  return axios("添加成功！").put(`${UPDATE_TASK}`, data);
};

export const getTaskResultsRequest = (data, callback) => {
  if (data.keyword && data.field)
    return axios(null, callback).post(`${SEARCH_TASK_RESULTS}`, data);
  else
    return axios(null, callback).get(
      `${GET_TASK_RESULTS}/${data.kind}?per=${data.per}&page=${data.page}`
    );
};

export const processLeakRequest = (data) => {
  let msg = "";
  if (data.state_type === 0) {
    msg = "已经忽略该条数据！";
  } else if (data.state_type === 1) {
    msg = "该条数据已加入白名单！";
  } else {
    msg = "成功处理该条数据！";
  }
  return axios(msg).patch(`${PROCESS_TASK_RESULT}`, data);
};
