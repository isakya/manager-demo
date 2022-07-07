<script setup>

</script>

<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎体验</div>
      <div class="title">通用后台管理系统</div>
      <div class="desc">- Vue3.0+ElementPlus+Node+Mongo构建通用后台管理系统</div>
    </div>
    <div class="img">
    </div>
  </div>
</template>

<style lang="scss" scoped>
.welcome {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;
  .content {
    // 相对自身定位
    position: relative;
    // 往上移动20px
    bottom: 20px;
    .sub-title {
      font-size: 30px;
      line-height: 42px;
      color: #333;
    }
    .title {
      font-size: 40px;
      line-height: 62px;
      color: #4093ff;
    }
    .desc {
      text-align: right;
      font-size: 14px;
      color: #999;
    }
  }
  .img {
    margin-left: 105px;
    background-image: url('./../assets/images/welcome.jpg');
    width: 418px;
    height: 282px;
  }
}
</style>
