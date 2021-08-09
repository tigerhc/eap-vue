<template>
  <div class="login-container">
    <img :src="logo" alt="" class="logo" >
    <div class="login-main">
      <div class="login-introduce">
        <!--大连-->
        <!--<div class="title" style="color:#fff">DSK CIM</div>-->
        <!--<div class="content" style="color:#fff">DSK CIM,当前采集SIM线 PRINTER, DM , GAZO, REFLOW生产和操作日志</div>-->

        <!--北京-->
        <!--        <div class="title" style="color:#fff">数采平台</div>-->
        <!--        <div class="content" style="color:#fff">当前支持以下设备类型-->
        <!--          <br>白光干涉仪-->
        <!--          <br>方阻测试仪-->
        <!--          <br>膜厚仪-->
        <!--          <br>台阶仪-->
        <!--          <br>椭偏仪-->
        <!--          <br>原子力显微镜</div>-->
        <sys-config config_key="sys.login.leftSystemDesc" />
      </div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <h1>道达IOT系统</h1>
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
          style="width: 80%; margin-top: 40px; padding: 15px 0; font-size: 20px; border-radius: 50px"
          @click.native.prevent="handleLogin"
          >{{ $t('login.logIn') }}</el-button
        >
        <!--
        <div class="tips">
          <span>{{ $t('login.username') }} : admin</span>
          <span>{{ $t('login.password') }} : 123456</span>
        </div> -->
      </el-form>
    </div>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import { Message } from 'element-ui'
import SysConfig from '../../components/sys-config/index'
import logo from '@/assets/img/totalogo.png'

export default {
  name: 'Login',
  components: { SysConfig, LangSelect },
  data() {
    // eslint-disable-next-line no-unused-vars
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    // eslint-disable-next-line no-unused-vars
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      logo: logo,
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        // password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      introduce: ''
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
              if (window.location.hostname === '10.160.144.9') {
                this.$router.push({ path: 'board' || '/' })
              } else {
                this.$router.push({ path: 'dashboard' || '/' })
              }
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

// @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
//   .login-container .el-input input {
//     color: $cursor;
//     &::first-line {
//       color: $light_gray;
//     }
//   }
// }

/* reset element-ui css */
.login-container {
  background-image: url(../../assets/img/iotbg.jpg);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    font-size: 16px;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      // color: $light_gray;
      height: 47px;
      // caret-color: $cursor;
      // &:-webkit-autofill {
      //   -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
      //   -webkit-text-fill-color: $cursor !important;
      // }
    }
  }
  .el-form-item {
    // border: 1px solid #000;
    // background: rgba(0, 0, 0, 0.3);
    border-bottom: 2px solid #ccc;
    border-radius: 5px;
    color: #454545;
  }
}
h1,
h3 {
  margin: 0;
}
h1 {
  margin-bottom: 30px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  height: 100%;
  width: 100%;
  background-color: #fff;
  position: relative;
  .logo {
    width: 15%;
    position: absolute;
    top: 5%;
    left: 3%;
  }
  .login-main {
    width: 60%;
    // background-color: red;
    height: 70%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-40%, -50%);
    display: flex;
    justify-content: center;
    .login-introduce {
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      // float: left;
      width: 50%;
      height: 100%;
      color: #fff;
      // text-align: center;
      // text-indent: 2em;
      // height: 50%;
      // background-color: linear-gradient(0deg, #3a485a 0%, #607089 100%);
      background: rgba(0, 0, 0, 0.4);
      //background: linear-gradient(0deg, #3a485a 0%, #607089 100%);
      // filter:  opacity(50%);
      // -webkit-filter: opacity(50%);
      // opacity: 0.9;
      background-size: 100% 100%;
      padding: 20px;
      position: relative;
      // &::before {
      //   content: '';
      //   position: absolute;
      //   top: 0;
      //   left: 0;
      //   bottom: 0;
      //   right: 0;
      //   // background: url(../../assets/img/left-1.png) no-repeat 0 0;
      // }
      // &::after {
      //   content: '';
      //   position: absolute;
      //   top: 0;
      //   left: 0;
      //   bottom: 0;
      //   right: 0;
      // background: url(../../assets/img/left-2.png) no-repeat right bottom;
      // }
    }
    .login-form {
      border: 1px solid #fff;
      width: 50%;
      height: 100%;
      max-width: 100%;
      padding: 35px 35px 15px 35px;
      // margin: 120px auto;
      // background-image: url(../../assets/img/bg.jpg);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #fff;
      // border-radius: 20px;
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
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
      font-size: 20px;
    }
    .title-container {
      width: 80%;
      display: flex;
      align-items: center;
      margin-bottom: 50px;
      .title {
        width: 80%;
        font-size: 26px;
        // color: $light_gray;
        color: #555;
        text-align: center;
        font-weight: bold;
      }
      .set-language {
        color: #555;
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
  .el-form-item {
    width: 80%;
    margin-bottom: 50px;
  }
}
</style>
<style scoped  lang="scss">
@media only screen and (max-width: 768px) {
  .login-container {
    width: 100%;
    height: 100%;
    position: relative;
    .logo {
      width: 20%;
      position: absolute;
      top: 2%;
      left: 2%;
      z-index: 1000;
    }
    .login-main {
      width: 75%;
      height: 85%;
      transform: translate(-50%, -50%);
      flex-direction: column;
      position: absolute;
      top: 50%;
      left: 50%;
      .login-introduce {
        width: 100%;
        height: 50%;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        border-bottom-left-radius: 0px;
      }
      .login-form {
        width: 100%;
        height: 50%;
        border-bottom-right-radius: 20px;
        border-top-right-radius: 0px;
        border-bottom-left-radius: 20px;
        padding: 25px 25px 25px 25px;
        .title-container {
          margin-bottom: 30px;
        }
        .el-form-item {
          margin-bottom: 30px;
        }
        .el-button {
          margin-top: 10px !important;
        }
      }
    }
  }
}
@media only screen and (min-width: 768px) and (min-width: 992px) {
  .login-container {
    width: 992px;
    height: 100%;
  }
}
@media only screen and (min-width: 768px) and (max-width: 992px) {
  .login-container {
    width: 992px;
    height: 100%;
    .login-main {
      width: 75%;
      transform: translate(-50%, -50%);
      position: absolute;
      top: 50%;
      left: 50%;
      .login-introduce {
        width: 50%;
        height: 100%;
      }
      .login-form {
        width: 50%;
        height: 100%;
      }
    }
  }
}
@media only screen and (min-width: 992px) and (max-width: 1200px) {
  .login-container {
    width: 1200px;
    height: 100%;
    .login-main {
      width: 75%;
    }
  }
}
@media only screen and (min-width: 1200px) {
  .login-container {
    width: 1920px;
    height: 100%;
  }
}
@media only screen and (min-width: 768px) and (max-width: 992px) {
  .el-input {
    width: 150px;
  }
}
</style>

