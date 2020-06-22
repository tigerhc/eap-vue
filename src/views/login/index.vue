<template>
  <div class="login-container">
    <div class="login-main">
      <div class="login-introduce">
        <!--大连-->
        <!--<div class="title" style="color:#fff">DSK CIM</div>-->
        <!--<div class="content" style="color:#fff">DSK CIM,当前采集SIM线 PRINTER, DM , GAZO, REFLOW生产和操作日志</div>-->

        <!--北京-->
        <div class="title" style="color:#fff">数采平台</div>
        <div class="content" style="color:#fff">当前支持以下设备类型
          <br>白光干涉仪
          <br>方阻测试仪
          <br>膜厚仪
          <br>台阶仪
          <br>椭偏仪
          <br>原子力显微镜</div>
      </div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">{{ $t('login.title') }}</h3>
          <lang-select class="set-language" />
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            v-model="loginForm.username"
            :placeholder="$t('login.username')"
            name="username"
            type="text"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :type="passwordType"
            v-model="loginForm.password"
            :placeholder="$t('login.password')"
            name="password"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>

        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleLogin"
        >{{ $t('login.logIn') }}</el-button>

        <div class="tips">
          <span>{{ $t('login.username') }} : admin</span>
          <span>{{ $t('login.password') }} : 123456</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import { Message } from 'element-ui'

export default {
  name: 'Login',
  components: { LangSelect },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('LoginByUsername', this.loginForm)
            .then(() => {
              this.loading = false
              this.$router.push({ path: 'dashboard' || '/' })
            })
            .catch((error) => {
              this.loading = false
              Message({
                message: error,
                type: 'error',
                duration: 5 * 1000
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://gitee.com/dataact/jeeweb/pull/927 */

$bg: #283443;
$light_gray: #eee;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    &::first-line {
      color: $light_gray;
    }
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  // filter:  opacity(50%);
  // -webkit-filter: opacity(50%);
  // background-color: #fff;
  background-attachment: fixed;
  position: fixed;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  background-color: #fff;
  //  background:url(../../assets/img/beijing1.jpg) no-repeat;
  //   background-size:100% 100%;
  .login-main {
    width: 70%;
    // background-color: red;
    height: 80%;
    margin: 5% auto;
    // display: flex;
    position: relative;
    .login-introduce {
      float: left;
      width: 100%;
      color: #000;
      text-align: center;
      text-indent: 2em;
      // height: 50%;
      // background-color: linear-gradient(0deg, #3a485a 0%, #607089 100%);

      background: linear-gradient(0deg, #3a485a 0%, #607089 100%);
      // filter:  opacity(50%);
      // -webkit-filter: opacity(50%);
      // opacity: 0.9;
      background-size: 100% 100%;
      padding: 20px;
      position: relative;
     &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: url(../../assets/img/left-1.png) no-repeat 0 0;
      }
      &::after {
            content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: url(../../assets/img/left-2.png) no-repeat right bottom;

      }

    }
    .login-form {
      float: left;
      width: 100%;
      // height: 50%;
      left: 0;
      right: 0;
      // width: 300px;
      max-width: 100%;
      padding: 35px 35px 15px 35px;
      // margin: 120px auto;
      background-color: #545353;
      box-sizing: border-box;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }
}
</style>
<style scoped>
@media (min-width: 768px) {
  .login-container .login-introduce {
    width: 50% !important;
    height: 100% !important;
    /* overflow-y: scroll; */
  }
  .login-container .login-introduce::-webkit-scrollbar {
    display: none;
  }
  .login-container .login-form {
    width: 50% !important;
    height: 100% !important;
  }
}
</style>

