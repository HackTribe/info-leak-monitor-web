import { message } from "antd";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { logoutAction } from "../redux/action/login";
import store from "../redux/stores";

const instance = (msg = null, func = null) => {
    const access_token = localStorage.getItem("token");

    NProgress.start();
    const _instance = axios.create({
        timeout: 2000,
    });
    _instance.defaults.headers.common["Authorization"] = "Bearer " + access_token;
    _instance.interceptors.response.use(
        (response) => {
            NProgress.done();
            if (msg) message.success(msg);
            if (func) func(response);
            // console.log(response);
            return response.data;
        },
        (error) => {
            NProgress.done();

            if (error && error.response && error.response.status) {
                switch (error.response.status) {
                    case 500:
                        message.error("服务器异常！请联系管理员！", 2);
                        break;
                    case 403:
                        console.log(error.response);
                        if (error.response.data && error.response.data)
                            message.error(error.response.data.message, 2);
                        break;
                    case 401:
                        message.error("身份认证失败，请重新登录！", 2);
                        store.dispatch(logoutAction());
                        break;
                    default:
                        message.error("未知错误！", 2);
                        break;
                }
            }

            return new Promise(() => { });
        }
    );
    return _instance;
};

export default instance;
