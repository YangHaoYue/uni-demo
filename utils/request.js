import Request from "@/utils/luch-request";
import { baseUrl } from "@/common/config";
import { getToken, clearToken } from "@/utils/token";
import { toast, modal } from "@/utils/tools";

const http = new Request();

http.setConfig((config) => {
  /* config 为默认全局配置*/
  config.baseURL = baseUrl; /* 根域名 */
  config.custom = {
    auth: true, //默认填充token
    toast: false,
  };
  return config;
});

// 请求拦截
http.interceptors.request.use(
  (config) => {
    // 可使用async await 做异步操作
    // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
    config.data = config.data || {};
    // 根据custom参数中配置的是否需要token，添加对应的请求头
    if (config?.custom?.auth) {
      // 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
      config.header["Authorization"] = "Bearer " + getToken();
    }
    //加载loading动画
    if (config.custom.loading) {
      uni.showLoading();
    }
    return config;
  },
  (config) => {
    // 请求错误隐藏动画
    uni.hideLoading();
    // 可使用async await 做异步操作
    return Promise.reject(config);
  }
);

// 响应拦截
http.interceptors.response.use(
  (response) => {
    /* 对响应成功做点什么 可使用async await 做异步操作*/
    const data = response.data;
    // 隐藏动画
    uni.hideLoading();
    // 自定义参数
    const custom = response.config?.custom;
    // 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
    if (custom.toast !== false) {
      toast(data.msg);
    }
    //处理token失效的问题
    if (data.code == 401) {
      console.log("toekn失效");
      //清除token
      clearToken();
      modal(
        "登录信息已失效或未登录，请重新登录",
        () => {
          //跳到登录
          uni.reLaunch({
            url: "/pages/Login/index",
          });
        },
        false
      );
    }

    if (data.code !== 1000) {
      toast(data.msg);
      // 如果需要catch返回，则进行reject
      if (custom?.catch) {
        return Promise.reject(data);
      } else {
        // 否则返回一个pending中的promise，请求不会进入catch中
        return new Promise(() => {});
      }
    }

    return data.data === undefined ? {} : data;
  },
  (response) => {
    // 对响应错误做点什么 （statusCode !== 200）
    return Promise.reject(response);
  }
);

export default http;
