import Vue from 'vue'
import VueRouter from 'vue-router'
import newh5 from './newh5'

Vue.use(VueRouter)
const router = new VueRouter({
    base: "/login_h5/",
    mode: 'history',
    routes: [
        ...newh5, //新版H5项目
    ]
})

router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta && to.meta.title) {
        document.title = to.meta.title;
    } else if (to.meta.title == '') {
        document.title = to.query.title;
    }
    next();
})

export default router;