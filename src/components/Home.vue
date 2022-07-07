<script>
export default {
  name: 'Home',
  data() {
    return {
      isCollapse: false,
      userInfo: {
        userName: 'izumi',
        userEmail: 'izumi@admin.com'
      }
    }
  },
  methods: {
    toggle() {
      this.isCollapse = !this.isCollapse
    },
    handleLogout(key) {
      if (key === 'email') return
      this.$store.commit('saveUserInfo', '')
      this.userInfo = null
      this.$router.push('/login')
    }
  }
}
</script>

<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统logo -->
      <div class="logo">
        <img
          src="./../assets/logo.png"
          alt=""
        >
        <span>Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        default-active="2"
        class="nav-menu"
        router
        background-color="#001529"
        text-color="#fff"
        :collapse="isCollapse"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon :style="iconStyle">
              <Setting />
            </el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="1-1">
            用户管理
          </el-menu-item>
          <el-menu-item index="1-2">
            菜单管理
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon :style="iconStyle">
              <Setting />
            </el-icon>
            <span>审批管理</span>
          </template>
          <el-menu-item index="2-1">
            休假申请
          </el-menu-item>
          <el-menu-item index="2-2">
            待我审批
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <el-icon
            @click="toggle"
            :style="iconStyle"
            class="menu-fold"
          >
            <Fold />
          </el-icon>
          <div class="bread">面板屑</div>
        </div>
        <div class="user-info">
          <el-badge
            :is-dot="true"
            class="notice"
            type="danger"
          >
            <el-icon :style="iconStyle">
              <Bell />
            </el-icon>
          </el-badge>
          <el-dropdown
            @command="handleLogout"
            class="drop-down"
          >
            <span class="user-link">
              {{userInfo.userName}}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">邮箱：{{userInfo.userEmail}}</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <div class="main-page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    // 自动出现滚动条
    overflow-y: auto;
    overflow-x: hidden;
    // 菜单收起动画效果
    transition: width 0.5s;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      // 修复菜单menu一像素丢失问题
      border-right: none;
    }
    // 合并菜单
    &.fold {
      width: 64px;
    }
    // 展开菜单
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    // 合并
    &.fold {
      margin-left: 64px;
    }
    // 展开
    &.unfold {
      margin-left: 200px;
    }
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
        }
      }
      .user-info {
        display: flex;
        justify-content: center;
        align-items: center;
        .notice {
          line-height: 30px;
          margin-right: 15px;
        }
        .drop-down {
          position: relative;
          bottom: 6px;
          .user-link {
            cursor: pointer;
            color: #409eff;
          }
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        height: 100%;
        background: #fff;
      }
    }
  }
}
</style>
