//获取token
export function getToken() {
  return uni.getStorageSync("js_token");
}
//设置token
export function setToken(val) {
  uni.setStorageSync("js_token", val);
}
//清除token
export function clearToken() {
  uni.removeStorage({
    key: "js_token",
  });
}

//清除全部缓存
export function clearAll() {
  uni.clearStorage();
}

//是否登录
export function isLogin() {
  return getToken() ? true : false;
}
