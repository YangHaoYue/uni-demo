import { resourceUrl } from "@/common/config.js";

// 添加单位，如果有rpx，%，px等单位结尾或者值为auto，直接返回，否则加上rpx单位结尾
export function addUnit(value = "auto", unit = "rpx") {
  value = String(value);
  // 用uView内置验证规则中的number判断是否为数值
  return this.$u.test.number(value) ? `${value}${unit}` : value;
}
//吐司提示
export function toast(text, mask = true, duration, success) {
  uni.showToast({
    title: text || "出错啦~",
    mask: mask,
    icon: success ? "success" : "none",
    duration: duration || 2000,
  });
}
//modal提示框
export function modal(
  content,
  callback,
  showCancel = true,
  title,
  confirmColor,
  confirmText,
  cancelText,
  cancelColor
) {
  uni.showModal({
    title: title || "提示",
    content: content,
    showCancel: showCancel,
    cancelColor: cancelColor || "#555",
    confirmColor: confirmColor || "#00C2C2",
    confirmText: confirmText || "确定",
    cancelText: cancelText || "取消",
    success(res) {
      if (res.confirm) {
        callback && callback(true);
      } else {
        callback && callback(false);
      }
    },
  });
}

//跳转页面，校验登录状态
export function route(url, type, isVerify = true) {
  uni.navigateTo({
    url,
  });
}

//校验数据类型
export function typeOf(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

//复制
export function copy(data) {
  uni.setClipboardData({
    data,
    success: () => {
      toast("内容复制成功！");
      console.log("success");
    },
  });
}
//返回
export function back(emitName = "back", delta = 1, duration = 1500) {
  setTimeout(() => {
    uni.$emit(emitName);
    uni.navigateBack({
      delta,
    });
  }, duration);
}

//预览照片
export function previewImg(imgList, current) {
  let urls = imgList.map((v) => resourceUrl + v);
  uni.previewImage({
    urls,
    current,
  });
}

export function useSaveImg(url) {
  uni.downloadFile({
    url,
    success: function (res) {
      console.log(res);
      uni.getSetting({
        success(ress) {
          console.log(ress.authSetting);
          // return
          if (ress.authSetting["scope.writePhotosAlbum"] === false) {
            uni.openSetting();
          } else {
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (data) {
                uni.showToast({
                  title: "保存成功",
                  icon: "success",
                  duration: 2000,
                });
              },
            });
          }
        },
      });
    },
  });
}
