<template>
  <div id="app">
   	<transition name="fade" mode="out-in">
            <!-- <navigation> -->
                <keep-alive>
                    <router-view ></router-view>
                </keep-alive>
            <!-- </navigation> -->
	</transition>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang='scss'>
 
#app {
    margin: 0px;
    padding: 0px;
    width: 100%;
    height: 100%;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;

    overflow: scroll;
}
.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
@import 'styles/reset.scss';
</style>
