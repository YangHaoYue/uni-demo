<template>
  <view>
    <!-- login -->
    <view class="u-flex-col u-row-center u-col-center u-p-40 h-100">
      <u-image width="520" height="260" src="/static/login.png" />
      <view class="u-flex-col" style="margin-top: 80rpx">
        <!-- 电话 -->
        <view class="u-input u-flex">
          <u-icon class="u-m-r-20" name="phone-fill" size="35" color="#333" />

          <input
            class="u-flex-1"
            v-model="form.tel_num"
            type="number"
            maxlength="11"
            placeholder="请输入手机号"
          />
        </view>
        <!-- 验证码 -->
        <view class="u-input u-flex u-m-t-50">
          <u-icon class="u-m-r-20" name="lock-fill" size="35" color="#333" />
          <input
            class="u-flex-1"
            v-model="form.code"
            type="number"
            maxlength="6"
            placeholder="请输入验证码"
          />
          <u-button
            shape="circle"
            size="mini"
            type="primary"
            @click="getCode"
            >{{ tips }}</u-button
          >
        </view>
      </view>
      <u-button
        shape="circle"
        type="primary"
        style="margin-top: 80rpx; width: 520rpx"
        :disabled="!checked"
        @click="submit"
        >登录</u-button
      >
    </view>
    <!-- 协议 -->
    <view class="u-flex u-row-center u-fix-bottom u-p-b-30">
      <u-checkbox v-model="checked" :disabled="false"></u-checkbox>
      <view>
        勾选同意
        <text class="text-blue" @click="toText('agreement')">
          《用户协议》
        </text>
        和
        <text class="text-blue" @click="toText('private')"> 《隐私协议》 </text>
      </view>
    </view>

    <!-- 发送短信 -->
    <u-verification-code ref="uCode" @change="codeChange"></u-verification-code>
  </view>
</template>

<script>
import { isLogin } from "@/utils/token";
import { sendCode, login, getUser } from "@/api/main";

export default {
  onLoad() {
    if (isLogin()) {
      getUser();
      uni.redirectTo({
        url: "/pages/index/index",
      });
    }
  },
  data() {
    return {
      form: {},
      checked: false,

      tips: "发送验证码",
    };
  },
  methods: {
    codeChange(text) {
      this.tips = text;
    },
    async getCode() {
      if (!this.form.tel_num) return this.$u.toast("请输入手机号码！");
      if (this.$refs.uCode.canGetCode) {
        // 模拟向后端请求验证码
        uni.showLoading({
          title: "正在获取验证码",
        });
        await sendCode(this.form.tel_num);
        uni.hideLoading();
        // 通知验证码组件内部开始倒计时
        this.$refs.uCode.start();
      } else {
        this.$u.toast("倒计时结束后再发送");
      }
    },
    toAgreement() {
      this.$u.route("");
    },
    submit() {
      if (!this.form.tel_num) return this.$u.toast("请输入手机号码！");
      if (!this.form.code) return this.$u.toast("请输入验证码！");
      if (!this.$u.test.mobile(this.form.tel_num))
        return this.$u.toast("您输入的手机号码不正确！");
      login({ ...form });
    },
  },
};
</script>

<style>
page {
  background-color: #fff;
}
.u-input {
  width: 520rpx;
  height: 100rpx;
  background: #eeeeee;
  border-radius: 50rpx;
  padding: 0 50rpx;
}
.send-btn {
  width: 180rpx;
  height: 50rpx;
  border-radius: 25rpx;
  font-size: 24rpx;
  padding: 0 25rpx !important;
}
</style>
