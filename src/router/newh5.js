const Newlogin = resolve => require.ensure([], () => resolve(require('../components/newh5/newlogin.vue')), 'Newlogin') //登录
const Newconter = resolve => require.ensure([], () => resolve(require('../components/newh5/newconter.vue')), 'Newconter') //我的
const Newsetting = resolve => require.ensure([], () => resolve(require('../components/newh5/newsetting.vue')), 'Newsetting') //我的--设置页面
const Newhelp = resolve => require.ensure([], () => resolve(require('../components/newh5/newhelp.vue')), 'Newhelp') //我的--常见问题页面
const Newareement = resolve => require.ensure([], () => resolve(require('../components/newh5/newareement.vue')), 'Newareement') //登录--平台协议页面
const Newindex = resolve => require.ensure([], () => resolve(require('../components/newh5/newIndex.vue')), 'Newindex') //首页
const Newtabbar = () =>
    import ("../components/newh5/newtabbar.vue");
const Newdk = resolve => require.ensure([], () => resolve(require('../components/newh5/newdk.vue')), 'Newdk') //Tabbar
const Newfeedback = resolve => require.ensure([], () => resolve(require('../components/newh5/newfeedback.vue')), 'Newfeedback') //反馈消息
const Newauthentication = resolve => require.ensure([], () => resolve(require('../components/newh5/newauthentication.vue')), 'Newauthentication') //资料认证
const NewDetail = resolve => require.ensure([], () => resolve(require('../components/newh5/newDetail.vue')), 'NewDetail'); // 产品详情
const Newproductclassify = resolve => require.ensure([], () => resolve(require('../components/newh5/newproductclassify.vue')), 'Newproductclassify'); // 产品分类
const New404 = resolve => require.ensure([], () => resolve(require('../components/newh5/new404.vue')), 'New404'); // 404
const NewStrategyList = resolve => require.ensure([], () => resolve(require('../components/newh5/newStrategyList.vue')), 'NewStrategyList'); // 贷款攻略
const NewCardList = resolve => require.ensure([], () => resolve(require('../components/newh5/newCardList.vue')), 'NewCardList'); // 贷款攻略
const NewStrategy = resolve => require.ensure([], () => resolve(require('../components/newh5/newStrategy.vue')), 'NewStrategy'); // 贷款攻略详情
const SpecialProduct = resolve => require.ensure([], () => resolve(require('../components/newh5/specialProduct.vue')), 'SpecialProduct'); // 贷款攻略详情

const SimpleIndex = resolve => require.ensure([], () => resolve(require('../components/abridgedEdition/simpleIndex.vue')), 'SimpleIndex'); // 简版贷款首页


export default [{
        path: '/newlogin/:Uid',
        component: Newlogin,
        name: '登录',
        hidden: true,
        meta: {
            title: '登录'
        },
    },
    {
        path: '/new404',
        component: New404,
        name: '',
        hidden: true,
        meta: {
            title: ''
        },
    },
    {
        path: '/newareement',
        component: Newareement,
        name: '平台服务协议',
        hidden: true,
        meta: {
            title: '平台服务协议'
        },
    },
    {
        path: '/newsetting',
        component: Newsetting,
        name: '设置退出',
        hidden: true,
        meta: {
            title: '设置退出'
        },
    },
    {
        path: '/newhelp',
        component: Newhelp,
        name: '常见问题',
        hidden: true,
        meta: {
            title: '常见问题'
        },
    },
    {
        path: '/newfeedback',
        component: Newfeedback,
        name: '联系我们',
        hidden: true,
        meta: {
            title: '联系我们'
        },
    },
    {
        path: '/newauthentication',
        component: Newauthentication,
        name: '资料认证',
        hidden: true,
        meta: {
            title: '资料认证'
        },
    },
    {
        path: '/newproductclassify',
        component: Newproductclassify,
        name: 'newproductclassify',
        hidden: true,
        meta: {
            title: ''
        },
    },
    {
        path: '/newDetail',
        component: NewDetail,
        name: 'NewDetail',
        hidden: true,
        meta: {
            title: ''
        },
    },
    {
        path: '/newStrategyList',
        component: NewStrategyList,
        name: 'newStrategyList',
        hidden: true,
        meta: {
            title: '贷款攻略'
        }
    },
    {
        path: '/newCardList',
        component: NewCardList,
        name: 'newCardList',
        hidden: true,
        meta: {
            title: '信用卡推荐'
        }
    },
    {
        path: '/newStrategy',
        component: NewStrategy,
        name: 'newStrategy',
        hidden: true,
        meta: {
            title: ''
        }
    },

    {
        path: '/specialProduct',
        component: SpecialProduct,
        name: 'specialProduct',
        hidden: true,
        meta: {
            keepAlive: true,
            title: '产品推荐'
        }
    },

    // tabbar分类父路由
    {
        path: '/newtabbar',
        component: Newtabbar,
        children: [{
                path: '/newindex',
                component: Newindex,
                name: 'newindex',
                hidden: false,
                meta: {
                    keepAlive: true,
                    title: '首页',
                    isBack: false

                },
                beforeEnter: (to, from, next) => {
                    setHeaderInfo(to);
                    setTabName(to);
                    next();
                }
            },
            {
                path: '/newdk',
                component: Newdk,
                name: 'newdk',
                hidden: false,
                meta: {
                    keepAlive: true,
                    title: '贷款'
                },
                beforeEnter: (to, from, next) => {
                    setHeaderInfo(to);
                    setTabName(to);
                    next();
                }
            },
            {
                path: '/simpleIndex',
                component: SimpleIndex,
                name: 'simpleIndex',
                hidden: false,
                meta: {
                    keepAlive: true,
                    title: '贷款',
                    isBack: false

                },
                beforeEnter: (to, from, next) => {
                    setHeaderInfo(to);
                    setTabName(to);
                    next();
                }
            },
            {
                path: '/newconter',
                component: Newconter,
                name: 'newconter',
                hidden: false,
                meta: {
                    title: '我'
                },
                beforeEnter: (to, from, next) => {
                    setHeaderInfo(to);
                    setTabName(to);
                    next();
                }
            },
        ]
    }
]

function setTabName(to) {
    localStorage.setItem('tabName', to.name);
}

function setHeaderInfo(to) { //存储头信息
    if (to.query.dark != 0) {
        to.query.dark = '1';
    }
}