<template>
  <div class="m-tabbar">
    <slot></slot>
  </div>
</template>
<script charset="UTF-8">
import mTabbarItem from './tabbar-item';
export default {
    // props: ['value'], 咱不知道具体是干什么的
    computed: {
        value() {
            return this.$route.name
        }
    }
}
</script>
<style lang="scss" scoped="scoped">
/*导入颜色变量*/
@import '~src/styles/var.scss';
.m-tabbar {
    display: flex;
    flex-direction: row;
    position: fixed;
    z-index: 9;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100*$rem;

    background: $white;
    border-top:2.1*$rem solid #bfbfbf;
    overflow: hidden;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 1px;

      background: $tabbarBorderColor;
      transform: scaleY(0.5);
    }
}
</style>
