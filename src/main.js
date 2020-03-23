// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App';
import router from './router/index';
import rem from './config/rem';
import globalFunction from './config/globalFunction'; //引入全局函数
import { Loadmore } from 'mint-ui';
import { Spinner } from 'mint-ui';
import { InfiniteScroll } from 'mint-ui';
import axios from 'axios';
// import FastClick from 'fastclick'
// FastClick.attach(document.body);
Vue.use(InfiniteScroll);
Vue.component(Loadmore.name, Loadmore);
// 等待loading
Vue.component(Spinner.name, Spinner);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.globalFunction = globalFunction; //把全局函数定义到指向上边（this）

// // vue图片懒加载
import VueLazyload from 'vue-lazyload'; //默认图
Vue.use(VueLazyload, {
    preLoad: 1.1,
    error: require('src/assets/default.png'),
    loading: require('src/assets/default.png'),
    attempt: 20
});

new Vue({
    el: '#app',
    router,
    components: {
        App
    },
    template: '<App/>'
});