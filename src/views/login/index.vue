<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <!-- 左关闭符号 -->
      <van-icon slot="left" name="cross" @click="$router.back()"></van-icon>
    </van-nav-bar>
    <!-- 登录表单 -->
    <van-form @submit="onSubmit" ref="loginForm" validate-trigger="onSubmit">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
        ><i slot="left-icon" class="toutiao toutiao-shouji"></i
      ></van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        maxlength="6"
        ><i slot="left-icon" class="toutiao toutiao-yanzhengma"></i
        ><template #button>
          <div class="boxSms">
            <van-count-down
              v-if="isCountDownShow"
              :time="1000 * 60"
              format="ss s"
              @finish="isCountDownShow = false"
            />
            <van-button
              v-else
              size="small"
              class="send-sms-btn"
              round
              type="default"
              @click="onSendSms"
              native-type="button"
              >获取验证码</van-button
            >
          </div>
        </template></van-field
      >
      <div class="login-btn-wrap">
        <van-button block type="info" class="login-btn" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      userFormRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false // 是否展示倒计时
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onSubmit() {
      // 获取表单数据
      const user = this.user
      // 表单验证
      // 组件中必须通过this.$toast调用Toast
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认2s，若为0则持续展示
      })
      // 提交数据
      try {
        const { data } = await login(user)
        // console.log('登陆成功')
        this.$toast.success('登陆成功')
        this.$store.commit('setUser', data.data)
        // 登录成功跳转回原来页面
        this.$router.back()
      } catch (error) {
        if (error.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登陆失败,请稍后重试')
        }
      }
    },
    async onSendSms() {
      // 校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (error) {
        return console.log('验证失败', error)
      }
      // 显示倒计时
      this.isCountDownShow = true
      // 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (error) {
        this.isCountDownShow = false
        // console.log('发送失败', error)
        if (error.response.status === 420) {
          this.$toast('发送太频繁,请稍后再试')
        } else {
          this.$toast('发送失败,请稍后再试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 157px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
  }
  .login-btn {
    background-color: #6db4fb;
    border: none;
  }
  .boxSms {
    height: 50px;
  }
}
</style>
