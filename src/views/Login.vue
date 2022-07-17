<script>
import utils from './../utils/utils'
import storage from './../utils/sotrage'

export default {
  name: 'login',
  data() {
    return {
      user: {
        userName: '',
        userPwd: '',
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        userPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.$api.login(this.user).then(async (res) => {
            this.$store.commit('saveUserInfo', res)
            await this.loadAsyncRoutes()
            this.$router.push('/welcome')
          })
        } else {
          return false
        }
      })
    },
    async loadAsyncRoutes() {
      let userInfo = storage.getItem('userInfo') || {}
      if (userInfo.token) {
        try {
          const { menuList } = await this.$api.getPermissionList()
          let routes = utils.generateRoute(menuList)

          routes.map(route => {
            // 必须先写成变量，然后再放到import中，不能用@,，vite的坑
            let url = `./../views/${route.component}.vue`
            route.component = () => import(url)
            this.$router.addRoute('home', route)
          })
        } catch (error) {

        }
      }
    }
  }
}
</script>

<template>
  <div class="login-wrapper">
    <div class="model">
      <el-form ref="userForm" :model="user" status-icon :rules="rules">
        <div class="title">后台管理系统</div>
        <el-form-item prop="userName">
          <el-input type="text" prefix-icon="User" v-model="user.userName" />
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input type="password" prefix-icon="View" v-model="user.userPwd" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="login">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;

  .model {
    width: 500px;
    padding: 50px;
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;

    .title {
      font-size: 30px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>
