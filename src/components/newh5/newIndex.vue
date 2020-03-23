<template>

	<div class="newindex"  :style="{'min-height': wrapperHeight + 'px', 'overflow': 'scroll'}">
        <iframe v-show="false" :src="iframeUri"></iframe>
        <!-- 组件部分 -->
        <classify-panel :classifyList="classifyList" :strHeadData='strHeadData' v-if="classifyList && classifyList.length > 0"></classify-panel>
        
        <!-- 今日推荐 -->
        <div class="todayRecommend" v-for="(item,index) in todayrecommends" :key="`B-${index}`"  @click="goProductOrThird(item)" v-if="todayrecommends && todayrecommends.length > 0"> 
            <!-- 今日推荐图片 -->
            <div class="todaylogo">
                <img src="~src/assets/todayrecommendimg@2x.png" alt="" class="todaylogoimg">
            </div>
            <!-- 今日推荐产品内容 -->
            <div class="todayproduct">
                <div class="todayproductdata">
                    <div class="todayproducton">
                        <div class="todayxin fl"></div>
                        <img :src="item.imgUrl" alt="" class="todayimg fl">
                        <span>{{item.title}}</span>
                    </div>
                    <div class="todayproductin">
                        <div class="todayxins fl"></div>
                        <span class="todayproducedu">{{item.minAmount}}~{{item.maxAmount}}元</span>
                    </div>
                </div>
            </div>
            <div class="todayright">
                <img src="~src/assets/inright.png" alt="" class="todayrightimg">
            </div>
        </div>
        <!-- 品牌推荐 -->
        <Tag :tagtxt=brandtxt :showArrow="false" v-if="brandProduct && brandProduct.length > 0"></Tag>
        <brand-product :productList="brandProduct" :strHeadData='strHeadData' v-if="brandProduct && brandProduct.length > 0"></brand-product>
        <!-- 精选是为您推荐接口 -->
        <Tag :tagtxt=forYouTxt v-on:go-list="goOtherPage('newdk')" :showArrow="false" v-if="this.allProduct &&  this.allProduct.length > 0"></Tag>
        <product-item :product="product" v-for="(product, index) in allProduct" :key="`A-${index}`" :strHeadData='strHeadData' v-if="allProduct && allProduct.length > 0"></product-item>
        <!-- 申请额度 -->
        <div class="newestimate">
            <!-- 内容 -->
            <div class="newestimatecontent-info">
                <div class="newestimatetitle" v-show="alreadyactivated">
                    预估可贷金额（元）
                </div>
                <div class="newestimatemoney" :class="{'unactivated': !alreadyactivated}">
                    {{increaseLimit}}
                </div>
            </div>
            <div class="newestimatebutton" v-show="!alreadyactivated" @click="submit">
                激活额度
            </div>
            <div class="newestimatebutton" v-show="alreadyactivated" @click="submit">
                立即申请
            </div>
        </div> 
        <!-- 智能推荐tag -->
        <Tag :tagtxt=catacity :showArrow="false" v-if="catacityrecommends && catacityrecommends.length > 0"></Tag> 
        <simple-hot-product v-if="catacityrecommends && catacityrecommends.length > 0" :productList="catacityrecommends" :strHeadData='strHeadData'></simple-hot-product> 

        <!-- 秒赚广告 -->

        <!-- <div class="miaozhuanstyle" v-if="show" @click="miaozhuan()">
        </div> -->

        <!-- 信用卡 -->
        <div class="card-list" v-if="creditCardList && creditCardList.length > 0">
            <Tag :tagtxt=cardtxt :showArrow="false"></Tag>
            <Newcard :cardProductlist="creditCardList" :hasTopBorder=false :hasEmpty=false></Newcard>
            <more-info :tips="cardMoreTips" v-on:go-list="goOtherPage('newCardList')"></more-info>
        </div>
        <!-- 贷款攻略 -->
        <div class="stategy-list mt" v-if="articleList && articleList.length > 0">
            <Tag :tagtxt=dkStrategyTagTitle :showArrow="false"></Tag>
            <dk-strategy :dkItem='article' v-for="(article, i) in articleList" :key="i"></dk-strategy>
            <more-info :tips="dkStrategyMoreTips" v-on:go-list="goOtherPage('newStrategyList')"></more-info>
        </div>
	</div>
</template>
<script charset="UTF-8">
let qs = require('qs');
import resources from "../../resources";
import ClassifyPanel from 'src/common/classifyPanel' //引入分类
import BrandProduct from 'common/brandProduct' //引入品牌推荐
import productItem from 'common/productItem';
import Tag from 'common/tag' //栏目
import Newcard from 'common/newcard' //信用卡
import DkStrategy from 'common/dkStrategy'
import MoreInfo from 'common/moreInfo'
import SimpleHotProduct from 'common/simpleHotProduct';


import { Toast } from 'mint-ui';

export default {
    components:{ //绑定组件
        ClassifyPanel,
        BrandProduct,
        productItem,
        Tag,
        Newcard,
        DkStrategy,
        MoreInfo,
        SimpleHotProduct
    },
    data() { //data
        return {
            show: false,
            iframeUri: '',
            alreadyactivated: false, //已认证
            increaseLimitClick: false, // 是否是 点击认证
            increaseLimit: '暂无额度',
            brandtxt: '品牌推荐',
            cardtxt: '信用卡推荐',
            forYouTxt: '精选',
            pinpaitxt: '品牌推荐',
            catacity: '智能推荐',
            defaultTitle: '推荐',
            dkStrategyTagTitle: '贷款攻略',

            cardMoreTips: '更多热门卡片',
            dkStrategyMoreTips: '全部攻略',

            wrapperHeight: 0,
            tabheight: 42,

            todayrecommends: [], //今日推荐
            catacityrecommends: [], //智能推荐
            creditCardList: [], // 信用卡
            articleList: [], // 贷款攻略
            allProduct: [{  // 为您推荐
                imgUrl:''
            },{
                imgUrl:''
            }],
            classifyList: [ // 分类
                {
                    iconUrl:''
                },
                {
                    iconUrl:''
                },
                {
                    iconUrl:''
                },
                {
                    iconUrl:''
                },
                {
                    iconUrl:''
                },
                {
                    iconUrl:''
                }
            ],
            brandProduct: [{},{}],

            currentProduct: '',

            pageName: 'newindex',
            packageName: '',
            channelId: '',
            userId: 0,
            showtab: 'true',
            strHeadData: '',
            jsonHeader: '',
            classicon: Math.ceil(this.globalFunction.BASESIZE * 2.375) ? Math.ceil(this.globalFunction.BASESIZE * 2.375) : 54,
            classBaner: Math.ceil(this.globalFunction.BASESIZE * 18.75) ? Math.ceil(this.globalFunction.BASESIZE * 18.75) : 750,
            hoticon: Math.ceil(this.globalFunction.BASESIZE * 3) ? Math.ceil(this.globalFunction.BASESIZE * 3) : 120,
            allicon: Math.ceil(this.globalFunction.BASESIZE * 2) ? Math.ceil(this.globalFunction.BASESIZE * 2) : 80,
            todaycon:Math.ceil(this.globalFunction.BASESIZE * 0.7) ? Math.ceil(this.globalFunction.BASESIZE * 0.7) : 20,
            properImgSize: Math.ceil(this.globalFunction.BASESIZE * 5.375) ? Math.ceil(this.globalFunction.BASESIZE * 5.375) : 120,
            articleImgSize: Math.ceil(this.globalFunction.BASESIZE * 6.125) ? Math.ceil(this.globalFunction.BASESIZE * 6.125) : 135,
        };
    },
    watch:{ //监听localStorage
        userId(newuserid,olduserid){
            if(olduserid != newuserid){

                // 更新 jsonHeader 中的userid 和 strHeadData 中 的 userId
                this.jsonHeader['User-Id'] = newuserid;
                this.strHeadData = encodeURIComponent(JSON.stringify(this.jsonHeader));
                if(localStorage.getItem('Userid')){
                    let params = {
                        query : `{getUserIncreaseLimit(userId:${this.userId}) { 
                            id
                            userId
                            grantAmount
                            repayMoneyAmount
                            occupation
                            education
                            car
                            house
                            creditCard
                            accumulationFund
                            socialSecurity
                            empPost
                            ageGroup
                            fromSource
                        }
                        }`
                    };

                    let _this = this;

                    _this.$axios.post(`${resources.v2GraphQlApi}`, qs.stringify(params),{}).then(res => {
                        if(!res.data.data) {
                            return;
                        }

                    if(!res.data.data.getUserIncreaseLimit) { // 认证
                        _this.alreadyactivated = false; //未激活额度
                        if(_this.increaseLimitClick) {
                            _this.increaseLimitClick = false;
                            window.location.href = `${resources.goUrl}/newauthentication?strHeader=${_this.strHeadData}` //没有激活额度
                        }
                        return;
                    }else{
                        _this.increaseLimit = res.data.data.getUserIncreaseLimit.grantAmount;
                        if(_this.increaseLimit == 0){
                            _this.alreadyactivated = false; //未激活额度
                            if(_this.increaseLimitClick) {
                                _this.increaseLimitClick = false;
                                window.location.href = `${resources.goUrl}/newauthentication?strHeader=${_this.strHeadData}` //没有激活额度
                            }
                        }else{
                            _this.alreadyactivated = true; //已有激活额度
                            if(_this.increaseLimitClick) {
                                _this.increaseLimitClick = false;
                                window.location.href = `${resources.goUrl}/specialProduct?strHeader=${_this.strHeadData}`; //已有激活额度
                            }
                        }
                    }
                    }).catch(e => {
                        Toast('请求错误请重新尝试')
                    });
                }
              
            }
        }
    },
    methods: {
        getIndexInfo() { // 获得首页数据 爆款，滚动信息，分类，
            let params = {
                query : `{appH5TopNavType(
                        packageName: "${this.packageName}",
                        channelId: ${this.channelId}
                    ){
                        id
                        title
                        iconUrl
                        url
                    },
                    brandProducts: recommendProducts(
                            columnKey:"app_h5_brand_01",
                            packageName: "${this.packageName}",
                            channelId: ${this.channelId}
                        ){
                        id
                        title
                        firstTags
                        maxTerm
                        minTerm
                        dayRate
                        imgUrl
                        url
                        minAmount
                        maxAmount
                        directJump
                    },
                    allProducts: recommendProducts(
                            columnKey:"app_h5_nav_01",
                            packageName: "${this.packageName}",
                            channelId: ${this.channelId}
                        ){
                        id
                        title
                        firstTags
                        maxTerm
                        minTerm
                        dayRate
                        imgUrl
                        url
                        minAmount
                        maxAmount
                        directJump
                    },
                    todayrecommends: recommendProducts(
                            columnKey:"app_h5_td_01",
                            packageName: "${this.packageName}",
                            channelId: ${this.channelId}
                        ){
                        id
                        title
                        firstTags
                        maxTerm
                        minTerm
                        dayRate
                        imgUrl
                        url
                        minAmount
                        maxAmount
                        directJump
                    },
                    catacityrecommends: recommendProducts(
                            columnKey:"app_h5_capa_01",
                            packageName: "${this.packageName}",
                            channelId: ${this.channelId}
                        ){
                        id
                        title
                        firstTags
                        maxTerm
                        minTerm
                        dayRate
                        imgUrl
                        url
                        minAmount
                        maxAmount
                        directJump
                    },
                    
                    getUserIncreaseLimit(userId:${this.userId}) {
                        id
                        userId
                        grantAmount
                        repayMoneyAmount
                        occupation
                        education
                        car
                        house
                        creditCard
                        accumulationFund
                        socialSecurity
                        empPost
                        ageGroup
                        fromSource
                    },
                    creditCardList(
                        productCode: "creditCard",
                        location:"homePage"
                    ){
                        id
                        title
                        firstTags
                        url
                        directJump
                        imgUrl
                    },
                    articleList(
                        type: "strategy",
                        location:"homePage"
                    ){ 
                        id
                        title
                        name
                        content
                        status
                        type
                        url
                        imgUrl
                    }
                }`
            };

            let _this = this;

            _this.$axios.post(`${resources.v2GraphQlApi}`, qs.stringify(params),{
            }).then(res => {
                if(!res.data.data) {
                    return;
                }
                // 分类
                _this.classifyList = res.data.data.appH5TopNavType;
                if(_this.classifyList && _this.classifyList.length > 0) {
                    _this.classifyList.forEach( (classify, index) => {
                        classify.url = _this.globalFunction.getProperImgSize(classify.url, _this.classBaner);
                        classify.iconUrl = _this.globalFunction.getProperImgSize(classify.iconUrl, _this.classicon);
                        classify.index = index;
                    })
                    localStorage.setItem('ClassifyList', JSON.stringify(_this.classifyList));
                }

                // 今日推荐
                _this.todayrecommends = res.data.data.todayrecommends;
                if( _this.todayrecommends &&  _this.todayrecommends.length > 0){
                    _this.todayrecommends = _this.setProductItem(res.data.data.todayrecommends, 'imgUrl', _this.todaycon);
                }

                // 智能推荐
                _this.catacityrecommends = res.data.data.catacityrecommends;
                if( _this.catacityrecommends &&  _this.catacityrecommends.length > 0){
                    _this.catacityrecommends = _this.editProductName(_this.catacityrecommends);
                    _this.catacityrecommends = _this.setProductItem(res.data.data.catacityrecommends, 'imgUrl', _this.allicon);
                }

                // 精选
                _this.allProduct = res.data.data.allProducts;
                if( _this.allProduct &&  _this.allProduct.length > 0){
                    _this.allProduct = _this.setProductItem(res.data.data.allProducts, 'imgUrl', _this.allicon);
                }

                // 品牌推荐
                _this.brandProduct = res.data.data.brandProducts;
                if( _this.brandProduct &&  _this.brandProduct.length > 0){
                    _this.brandProduct =  _this.brandProduct.slice(0,2);
                    _this.brandProduct = _this.editProductName(_this.brandProduct);
                    _this.brandProduct = _this.setProductItem(_this.brandProduct, 'imgUrl', _this.hoticon);
                }

                // 信用卡
                _this.creditCardList = res.data.data.creditCardList;
                if(_this.creditCardList && _this.creditCardList.length > 0) {
                     _this.creditCardList = _this.setProductItem(_this.creditCardList, 'imgUrl', _this.properImgSize);
                }

                // 贷款攻略
                _this.articleList = res.data.data.articleList;
                if(_this.articleList && _this.articleList.length > 0) {
                    _this.articleList.forEach(item => {
                        item = this.globalFunction.setArticle(item, _this.articleImgSize);
                    });
                }

                // 认证
                if(!res.data.data.getUserIncreaseLimit) {
                    _this.alreadyactivated = false; // 未激活
                    return;
                }else{
                    _this.increaseLimit = res.data.data.getUserIncreaseLimit.grantAmount;
                    // 认证
                    if(!_this.increaseLimit) {
                        _this.alreadyactivated = false; // 未激活
                    }else{
                        _this.alreadyactivated = true; // 已有激活额度
                    }
                }
            }).catch(e => {

            });
        },

        goOtherPage(pageName){ // 贷款页面
            window.location.href = `${resources.goUrl}/${pageName}?strHeader=${this.strHeadData}`;
        },

        // 今日推荐  智能推荐， 
        goProductOrThird(item){
            this.currentProduct = item;
            //跳转链接
            let params = {
                goUrl: resources.goUrl,
                urlThird: resources.goProductDetail,
                product: item,
                jsonHeader: this.jsonHeader,
                strHeadData: this.strHeadData
            }
            let  tip = this.globalFunction.goThirdWithoutUserId(params);
            if(tip == 'needLogin') {
				this.globalFunction.Weaklogin('', 'indexProductSuccess');
			}
        },

        indexProductSuccess(userObj) {
            let params = {
                goUrl: resources.goUrl,
				urlThird: resources.goProductDetail,
				product: this.currentProduct,
				jsonHeader: this.jsonHeader,
				strHeadData: this.strHeadData
            }
            this.userId = userObj && userObj.id ? userObj.id : 0;
            this.globalFunction.productLoginSuccess(userObj, params);
        },

        // 秒赚点击 
        miaozhuan(){
            //记录UV
            this.iframeUri =  `${resources.host}/record?pid=465&partnerCode=miaozhuan`; 

            // 如果没有登录，调起登录
            if(!this.userId ){
                this.globalFunction.Weaklogin('','miaozhuanSuccess');
            }else{
                // 有登录，直接跳转
                window.location.href = `${resources.host}/v2/app/h5/redirectMiaoZhuan`;  
            }
        },

        // 需要UserId 根据认证信息 跳转不同页面：已认证 =》特殊分类页； 未认证 =》 认证页
        submit(){

            //如果已认证 并且 已有激活额度 
            if(this.alreadyactivated){

                window.location.href = `${resources.goUrl}/specialProduct?strHeader=${this.strHeadData}`;

            }else{
                if(!this.userId){
                    this.increaseLimitClick = true;
                    this.globalFunction.Weaklogin('','authentication');
                }else{
                    window.location.href = `${resources.goUrl}/newauthentication?strHeader=${this.strHeadData}`;

                }
            }

        },

        // 认证 登录成功 回调
        authentication(userObj){
            this.userId = userObj && userObj.id ? userObj.id : 0;
            this.globalFunction.loginSuccess(userObj, () => {
            });
        },

        //秒赚 登陆成功 回调 
        miaozhuanSuccess(userObj){
            this.userId = userObj && userObj.id ? userObj.id : 0;
            this.globalFunction.loginSuccess(userObj, () => {
                window.location.href = `${resources.host}/v2/app/h5/redirectMiaoZhuan`;  //跳转
            });
        },

        //处理拿到的产品信息换算
        setProductItem(productlist, imgUrlKey, properSize) {
            productlist.forEach(item => {
                item = this.globalFunction.setProduct(item, imgUrlKey, properSize);
            });
            return productlist;
        },

        //处理产品返回名称，品牌推荐
        editProductName(productlist){
            productlist.forEach(item => {
                item.title =  this.globalFunction.methodGetByteLen(item.title,4);
            });
            return productlist;
        },

    },
    beforeRouteEnter(to, from, next) {

        if(performance.navigation.type === 2) {
            to.meta.isBack = true;
        }
        next();
    },

    created(){ //生命周期函数
        let headerInfo = this.globalFunction.getHeader(this.jsonHeader, this.$route);
        this.jsonHeader = headerInfo.jsonHeader;
        this.strHeadData = headerInfo.strHeadData;

        this.packageName = this.jsonHeader['Package-Name'];
        this.channelId = this.jsonHeader['Channel-Id'];

        // 拿到UserId 如果老包,是强登录，肯定有userId
        this.userId = Math.ceil(localStorage.getItem('Userid')) ? localStorage.getItem('Userid') : Math.ceil(this.jsonHeader['User-Id']);

        this.showtab = this.globalFunction.showtab(this.jsonHeader);
        this.getIndexInfo();

        this.$nextTick(() => {
            if(this.$route.meta.isBack){
                let height = parseFloat(localStorage.getItem('scrollHeight'));

                if(height > 0) {
                    setTimeout(() => {
                        window.scrollTo(0, height);
                    }, 200);
                }
            }
        });
    },
    mounted() { //生命周期函数
        window.miaozhuanSuccess = this.miaozhuanSuccess; //秒赚回调
        window.authentication = this.authentication; //认证回调绑定方法
        window.indexProductSuccess = this.indexProductSuccess; 
        if (this.globalFunction.ISAPPLEDEVICE) {
            this.show = true;
        }

        
        this.tabHeight = this.globalFunction.BASESIZE * 2.5;
        if(this.showtab == 'false'){
            this.wrapperHeight = document.documentElement.clientHeight;
        }else{
            this.wrapperHeight = document.documentElement.clientHeight - this.tabHeight;
        }

    },

    activated() {
        setTimeout(() => {
            window.onscroll = ()=> {
                let sh = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                localStorage.setItem('scrollHeight', sh);
            }
        }, 1000);
    }
};
</script>

<style lang="scss" scoped>
@import '~src/styles/var.scss';

.newindex{
    padding-bottom: 80 * $rem;
    overflow: scroll;
    -webkit-overflow-scrolling: touch; //ios加载缓慢
    background: $backgroundColor;
} 
.todayRecommend{ //今日推荐
    margin-top: 15*$rem;
    margin-bottom: 15*$rem;
    padding: 0rem 30*$rem 0rem 62*$rem;
    width: 100%;
    height: 145*$rem;
    background: #fff;
    background-size:100% 100%; 
    overflow: hidden;
    .todaylogo{
        float: left;
        width: 110*$rem;
        height: 145*$rem;
        line-height: 145*$rem;
        .todaylogoimg{
            width: 110*$rem;
            vertical-align: middle;
        }
    }
    .todayproduct{
        padding: 30*$rem 0rem 30*$rem 80*$rem;
        float: left;
        width: 530*$rem;
        height: 145*$rem;
        overflow: hidden;
        .todayproductdata{
            float: left;
            padding-left: 30*$rem;
            width: 420*$rem;
            height: 85*$rem;
            border-left: 2.1*$rem solid $lightBorder;
        }
        .todayxin{
            margin-top: 10*$rem;
            margin-right: 12*$rem;
            width: 4px;
            height: 4px;
            background: #000;
            border-radius: 50%;
        }
        .todayxins{
            margin-top: 32*$rem;
            margin-right: 12*$rem;
            width: 4px;
            height:4px;
            background: #000;
            border-radius: 50%; 
        }
        .todayproducton{
            line-height: 28*$rem;
            font-size: 28*$rem;
            color: #000;
            overflow: hidden;
            .todayimg{
                display: block;
                position: relative;
                // top: -2*$rem;
                vertical-align: middle;
                margin-right: 12*$rem;
                width: 28*$rem;
                height:  28*$rem;
                border-radius:5*$rem; 
                overflow: hidden;
            }
        }
        .todayproductin{
            // margin-top: 20*$rem;
            line-height: 70*$rem;
            font-size: 40*$rem;
            color: #2e2e2e;
            overflow: hidden;
            .todayproducedu{
                font-family: 'PingFangSC-Medium';
            }
        }
        
    }
    // 右侧箭头
    .todayright{
        float: right;
        width: auto;
        height: 145*$rem;
        line-height: 145*$rem;
        overflow: hidden;
        .todayrightimg{
            vertical-align: middle;
            width: 16*$rem;
            height: 24*$rem;
        }
    }
}

.newestimate{ //申请额度与认证
    margin-top: 15*$rem;
    margin-bottom: 15*$rem;
    padding: 30*$rem;
    width: 100%;
    height: 390*$rem;
    background: url("~src/assets/yjkdjebj0718.png");
    background-size:100% 100%;

    .newestimatecontent-info {
        margin: 0 auto;
        margin-top: 40 * $rem;
        text-align: center;
        overflow: hidden;

        .newestimatetitle{
            font-size: 30*$rem;
            color: $darkestTextColor;
        }
        .newestimatemoney{
            margin-top: 18*$rem;
            margin-bottom: 18*$rem;
            font-size: 68*$rem;
            color: $darkestTextColor;
            font-family: 'SimHei';

            &.unactivated {
                margin-top: 24 * $rem;
                margin-bottom: 40 * $rem;
            }
        }
    }

    .newestimatebutton{
        margin: 0 auto;
        width: 608*$rem;
        height: 85*$rem;
        line-height: 85*$rem;
        background: #ff5428;
        text-align: center;
        font-size: 28*$rem;
        color: #fff;
        border-radius:8*$rem; 
        overflow: hidden;
    }
}
// 智能推荐
.catacitycontent{
    margin-bottom: 15*$rem;
    padding: 30*$rem;
    width: 100%;
    height: auto;
    background: #fff;
    overflow: hidden;

    .catacity-box {
        
        // 内容
        .catacity-panel {
            margin-bottom:25*$rem; 
            width: 335*$rem;
            height: auto;
            padding: 30*$rem 20*$rem;
            background: #fafafa;
            text-align: left;
            border-radius:5px; 
            overflow: hidden;

            &:nth-child(odd) {
                margin-right:20*$rem; 
            }
            &:last-child {
                margin-bottom:0*$rem; 
            }

            &:nth-of-type(even) {
                .catacity-tag {
                    &::after {
                        background-color: $tagSecondColor;
                    }
                }
                
            }
        }
        // 图片
        .catacity-img {
            width: 72 * $rem;
            height: 72 * $rem;
            border-radius: 12px;
        }
        // 文字
        .catacity-info {
                width: 220 * $rem;
                padding-left: 20 * $rem;

                .catacity-tag {
                    position: relative;

                    &::after {
                        position: absolute;
                        content: attr(data-tip);
                        left: 6*$rem;
                        top: -10 * $rem;
                        padding: 0 2px;
                        min-width: 50 * $rem;
                        height: 26 * $rem;

                        text-align: center;
                        font-size: 18 * $rem;
                        color: #fff;
                        white-space: nowrap;
                        border-bottom-right-radius: 6px;
                        border-top-right-radius: 6px;
                        border-top-left-radius: 4px;
                        background-color: $hitColor;
                    }
                }
            }

        // 名称
        .catacity-name {
            font-size: 28 * $rem;
            color: #292929;
            width:auto;  
            height: 32 * $rem;
            line-height: 32 * $rem;
            overflow: hidden;
        }
        // 额度
        .catacity-edu {
            font-size: 28 * $rem;
            color: $hitColor;
            height: 40 * $rem;
            line-height: 40 * $rem;
        }
    }
}
.miaozhuanstyle{  // 秒赚样式
    margin-top: 15*$rem;
    margin-bottom: 15*$rem;
    width: 100%;
    height: 222*$rem;
    background: url("~src/assets/miaozhuan16370629.png");
    background-size:100% 100%; 
    overflow: hidden;
}

</style>





