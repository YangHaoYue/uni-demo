import http from "@/utils/request";

// 登录验证码和绑定验证码：type参数----0登录，1--绑定
export function sendCode(phone, type = 0) {
  return http.post(
    `/system/app/getPhoneCode`,
    {
      type,
    },
    {
      custom: { toast: true, loading: true },
    }
  );
}

export function login(param) {
  return http.post("/system/app/login", param, {
    custom: { toast: true, loading: true },
  });
}
