<template>
  <div id="login-wrap">
    <iframe style="display:none;" :src='iframeSrc' width='0' height='0'>
    </iframe>
    <div id="login">
      <h1>OO运车</h1>
      <div class="main-img">
        <img src="@/assets/images/login/login-page.png" alt="">
      </div>
      <div class="login-model">
        <div class="content" v-if="isLogin">
          <h3 class="title">登录</h3>
          <input id="cook" type="hidden" value="cook">
          <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
            <el-form-item label="" prop="phone">
              <el-input v-model="loginForm.phone" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="loginByCode" class="code-item">
              <el-input v-model="loginForm.code" maxlength="6" placeholder="验证码"></el-input>
              <el-button
                type="text"
                :loading="codeLoading"
                :class="{active:codeText!=='获取验证码'}"
                @click="handleMsgBtnTap">
                {{ codeText }}
              </el-button>
            </el-form-item>
            <el-form-item prop="password" v-else>
              <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                class="btn-block"
                type="primary"
                :loading="loginLoading"
                @click="login('loginForm')">
                登 录
              </el-button>
            </el-form-item>
          </el-form>
          <div class="login-type">
            <el-button
              type="text"
              @click="loginByCode = !loginByCode">
              {{ loginByCode ? '账号密码登录' : '短信验证码登录' }}
            </el-button>
          </div>
        </div>
        <!-- 首次登录、设置密码 -->
        <div class="content" v-else>
          <h3 class="title">设置密码</h3>
          <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm">
            <el-form-item prop="password_one">
              <el-input type="password" v-model="passwordForm.password_one" placeholder="设置密码"></el-input>
            </el-form-item>
            <el-form-item prop="password_two" >
              <el-input type="password" v-model="passwordForm.password_two" placeholder="重复密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="btn-block" type="primary" @click="setPassword('passwordForm')">保 存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <footer>
      <p>
        <a class="record-number" target="_blank" href="http://www.beian.miit.gov.cn">京ICP备16011619号-1</a>
      </p>
      <p>©2020 牛卡福网络科技有限公司出品</p>
    </footer>
    <!-- 选择企业 -->
    <nf-dialog
      title="选择企业"
      :dialog-visible.sync="dialogVisible"
      width="400px"
      :click-sure-btn="clickSureBtn">
      <div class="nf-dialog-content" slot="content">
        <el-radio-group v-model="currentCompany">
          <el-radio
            v-for="(company, index) in companys"
            :key="index"
            :label="company.key"
            border>
          {{company.value}}</el-radio>
        </el-radio-group>
      </div>
    </nf-dialog>
  </div>
</template>

<script>
import { setToken } from "@/utils/auth"
import { isPhone } from '@/utils/utils'
import Axios from 'axios'
let timer
export default {
  name: "Login",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.passwordForm.password_two !== '') {
          this.$refs.passwordForm.validateField('password_two')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.passwordForm.password_one) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      cook: '',
      iframeSrc: '',
      theArea: 'com',
      service: '',
      protocol: 'https:',
      dialogVisible: false,
      has_password: false, // 是否有登录密码
      loginLoading: false,
      codeLoading: false, // 验证码按钮loading
      isLogin: true,
      codeText: "获取验证码", // 获取验证码按钮内容
      time: 60, // 倒计时总秒数
      loginByCode: false, // false === 账号密码 | true === 短信验证码
      companys: [],
      currentCompany: '',
      loginForm: {
        "phone": "",
        "code": "",
        "account": "",
        "password": "",
        "appId": ""
      },
      loginRules: {
        phone: [{ validator: this.$valid.isPhone(), trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '请输入6位验证码', trigger: 'blur' }
        ]
      },
      passwordForm: {
        password_one: '',
        password_two: '',
        old_password: ''
      },
      passwordRules: {
        password_one: [{ validator: validatePass, trigger: 'blur' }],
        password_two: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  created() {
    let _this = this
    window.setCook = function(item) {
      _this.cook = item
    }
    if(location.hostname.indexOf('localhost') !== -1 || location.hostname.indexOf('nucarf.cn') !== -1 || location.hostname.indexOf('ooyunche.cn') !== -1) {
      this.theArea = 'tech'
      this.protocol = 'https:';
    }else {
      // this.theArea = document.domain.split('.')[document.domain.split('.').length-1]
      // 20200909java把.com换成.net
      this.theArea = 'net'
      this.protocol = 'https:';
    }
    this.service = Axios.create({
      baseURL: `${this.protocol}//cloud.nucarf.${this.theArea}`,
      timeout: 60000
    })
    // iframe路径
    let tohref = location.origin
    this.iframeSrc = `${location.protocol}//cloud.nucarf.${this.theArea}/cookie?href=${tohref}`

    window.addEventListener('keyup', this.enterClick)
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.enterClick)
  },
  watch: {
    cook(val) {
      if(val) {
        // 请求oo的token
        let nToken = ''
        let token = decodeURIComponent(val).substring(1).split(';')
        token.forEach((item) => {
          if(item.indexOf('n-token') !== -1) {
            nToken = item.split('=')[1]
          }
        })
        if(nToken) this.loginClick(nToken, 2);
      }
    }
  },
  methods: {
    // 获取验证码
    async handleMsgBtnTap0() {
      if (this.codeText !== '获取验证码') return

      if (this.loginForm.phone === '') {
        this.$message.error('请输入手机号')
        return
      }
      if (!isPhone(this.loginForm.phone)) return
      this.codeLoading = true
      let data = await $get(`${api.codePhoneNo}/${this.loginForm.phone}`)
      if (data) {
        this.codeLoading = false
        this.$message.success('验证码发送成功')
      } else {
        this.codeLoading = false
        return
      }
      this.codeLoading = false

      if (timer) {
        clearInterval(timer)
      }

      this.codeText = this.time + '秒后获取'
      timer = setInterval(async () => {
        this.codeText = --this.time + '秒后获取'
        if (this.time <= 0) {
          clearInterval(timer)
          this.time = 60
          this.codeText = '获取验证码'
        }
      }, 1000)
    },
    async handleMsgBtnTap() {
      if (this.codeText !== '获取验证码') return

      if (this.loginForm.phone === '') {
        this.$message.error('请输入手机号')
        return
      }
      if (!isPhone(this.loginForm.phone)) return
      this.codeLoading = true
      // let data = await $get(`${api.codePhoneNo}/${this.loginForm.username}`)
      let data = await Axios.get(`${this.protocol}//cloud.nucarf.${this.theArea}/rest/login/requestSMSCode`,{params: {phone: this.loginForm.phone}})
      if (data.data.code === 200) {
        this.codeLoading = false
        this.$message.success('验证码发送成功')
      } else {
        this.codeLoading = false
        this.$message.warning(data.data.msg)
        return
      }
      this.codeLoading = false

      if (timer) {
        clearInterval(timer)
      }

      this.codeText = this.time + '秒后获取'
      timer = setInterval(async () => {
        this.codeText = --this.time + '秒后获取'
        if (this.time <= 0) {
          clearInterval(timer)
          this.time = 60
          this.codeText = '获取验证码'
        }
      }, 1000)
    },
    // 平台登录
    login() {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          let url = ''
          let data = {}
          if (this.loginByCode) {
            // 验证码
            this.loginForm.password = ''
            data = {
              "phone": this.loginForm.phone,
              "code": this.loginForm.code,
              "account": this.loginForm.phone,
              "password": "",
              "appId": ""
            }
            url = `/rest/login/verifySMSCodeOrigin`
          }else {
            // 密码
            data = {
              "phone": this.loginForm.phone,
              "code": '',
              "account": this.loginForm.phone,
              "password": this.loginForm.password,
              "appId": ""
            }
            url = `/rest/login/verifyPasswordOrigin`
          }
          this.service.defaults.withCredentials = true
          this.loginLoading = true
          this.service.post(url,JSON.stringify(data),{headers: {'content-Type': 'text/plain'}}).then(res => {
            this.$message.closeAll()
            this.loginLoading = false;
            if (res.data.code === 200) {
              this.loginClick(res.data.data.token, 1);
            } else if (res.data.code === 401) {
              this.$message.warning('帐号与密码不匹配')
            } else if (res.data.code === 403) {
              this.$message.warning('登录信息失效')
            } else if (res.data.code === 404) {
              this.$message.warning('首次登录，请您使用短信验证码登录')
            } else if (res.data.code === 410 && this.loginByCode) {
              this.$message.warning('验证码错误')
            } else {
              let msg = res.data.msg || res.data.message
              this.$message.warning(msg)
            }
          }).catch(() => {
            this.$message.closeAll()
            this.loginLoading = false
            this.$message.warning('登录失败，请刷新后重试')
          })
        } else {
          return false
        }
      })
    },
    // 登录
    loginClick(token, mode) {
      // mode=1,点击登录， mode=2，自动登录，不提示报错
      this.$message.closeAll()
      this.loginLoading = true
      if (this.loginForm.code) {
        this.loginForm.password = ''
      }
      Axios.post(api.login,{token: token}).then(res0 => {
        // mode=1 提示
        if(res0.data && res0.data.status && res0.data.status.code !== 0) {
          if(mode === 1) {
            this.$message.error(res0.data.status.message || res0.data.status.msg)
          }
          this.loginLoading = false
        }else {
          // 赋值res
          let res = res0.data.data
          setToken(token)
          this.loginLoading = false
          this.has_password = res.has_password
          if (res.company.length === 0) {
            this.$message.error('暂无权限，请联系管理员！')
          } else if (res.company.length === 1) {
            this.currentCompany = res.company[0].key
            if (this.has_password) {
              this.$store.commit('user/updateCompany', res.company[0])
              this.$router.push("/home")
            } else {
              this.$alert('您是第一次登录，请先前往设置密码', '登录提示', {
                confirmButtonText: '前往',
                callback: () => {
                  this.isLogin = false
                }
              })
            }
          } else {
          // 弹框选择企业
            this.currentCompany = res.company[0].key
            this.companys = res.company
            this.dialogVisible = true
          }
        }
      }).catch(() => {
        if(mode === 1) {
          this.$message.error('登录失败')
        }
        this.loginLoading = false
      })
    },
    // 企业确认
    clickSureBtn(loading) {
      let company = _.find(this.companys, ['key', this.currentCompany])
      this.$store.commit('user/updateCompany', company)
      loading(true)
      $post(api.switchCompany, { company_id: this.currentCompany }).then(() => {
        loading(false)
        if (this.has_password) {
          this.dialogVisible = false
          this.$router.push("/home")
        } else {
          this.dialogVisible = false
          this.$alert('您是第一次登录，请先前往设置密码', '登录提示', {
            confirmButtonText: '前往',
            callback: () => {
              this.isLogin = false
            }
          })
        }
      }).catch(() => {
        loading(false)
      })
    },
    // 设置密码并登录
    setPassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          $put(api.password, this.passwordForm).then(() => {
            this.$router.push("/home")
          })
        } else {
          return false
        }
      })
    },
    // 监听回车事件
    enterClick(event) {
      if (this.loginLoading) return
      if(event.keyCode === 13) {
        this.login()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-form /deep/ {
    .el-input__inner{
      height: 46px;
      line-height: 46px;
    }
    .el-button{
      padding: 15px 20px;
    }
  }
  #login-wrap {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  #login {
    background: url("../../assets/images/login/background.png") no-repeat center#fafcff;
    background-size: 100%;
    height: 100%;
    min-height: 545px;
    min-width: 1365px;
    margin: 0 auto;
    position: relative;
    h1 {
      background: url("../../assets/images/logo.png") no-repeat center;
      background-size: 100%;
      width: 84px;
      height: 22px;
      position: absolute;
      margin: 0;
      left: 60px;
      top: 65px;
      text-indent: -99em;
    }
  }
  .main-img {
    position: absolute;
    width: 710px;
    left: 15%;
    top: 50%;
    transform: translateY(-50%);
    img {
      width: 100%;
    }
  }
  .login-model {
    position: absolute;
    right: 10%;
    top: 50%;
    transform: translateY(-55%);
    width: 461px;
  }
  .content {
    background: #fff;
    box-shadow: 0px 0px 15px 0px #edf4fb;
    padding: 65px 58px;
    .title{
      margin-top: 0;
      font-size: 24px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: $themeColor;
      line-height: 33px;
      margin-bottom: 40px;
    }
  }
  .code-item{
    &/deep/.el-form-item__content {
      display: flex;
    }
    .el-button{
      width: 160px;
    }
  }
  .btn-block{
    width: 100%;
  }
  footer {
    color: #787f95;
    line-height: 20px;
    position: absolute;
    left: 60px;
    bottom: 35px;
    line-height: 20px;
    p {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      margin-top: 10px;
      margin-bottom: 0;
    }
    .record-number{
      color: #787f95;
      text-decoration: none;
      &:hover, &:focus{
        color: #66b1ff;
        text-decoration: underline;
      }
      &:active{
        color: #3a8ee6;
        text-decoration: underline;
      }
    }
  }

  .el-radio{
    margin-right: 0;
    width: 100%;
    &.is-bordered{
      padding: 16px 20px 0 10px;
      height: 46px;
      &+.el-radio.is-bordered {
        margin-top: 20px;
        margin-left: 0;
      }
    }
  }
  @media screen and (max-width: 1600px) {
    #login {
      .login-model {
        right: 5%;
      }
      .main-img{
        left: 11%;
      }
    }
  }
</style>
