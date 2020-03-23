<template>
    <div class="abridged-edition-index">
        <div class="banner-img" @click="goTodayRecommendDetial()">
            <img class="img" :src="bannerImg" alt="">
        </div>
        <div class="content-list" v-for="(simple, index) in simpleList" v-if="simple.brandtxt" :key="index">
            <Tag :tagtxt="simple.brandtxt" :showArrow="false"  :theme="'simple'" v-if="simple.productList && simple.productList.length > 0"></Tag>
            <!-- 人气爆款 -->
            <product-item v-if="simple.type == 'recommendsProducts'" :theme="'simple'" :product="product" v-for="(product, index) in simple.productList" :key="`A-${index}`" :strHeadData='strHeadData'></product-item>
            <!-- 热门口子 -->
            <simple-hot-product v-if="simple.type == 'hotProducts'" :productList="simple.productList" :theme="'simple'"  :strHeadData='strHeadData'></simple-hot-product>
            <!-- 热门信用卡 -->
            <Newcard v-if="simple.type == 'creditCardList'" :cardProductlist="simple.productList" :hasTopBorder=false :hasEmpty=false></Newcard>
            <!-- 贷款攻略 -->
            <dk-strategy v-if="simple.type == 'articleList'" :dkItem='article' v-for="(article, i) in simple.productList" :key="i"></dk-strategy>
            <more-info v-if="simple.type == 'articleList'" :tips="dkStrategyMoreTips" v-on:go-list="goOtherPage('newStrategyList')"></more-info>
        </div>
    </div>
</template>

<script>
let qs = require('qs');

import resources from 'src/resources';

import Tag from 'common/tag' //栏目
import SimpleHotProduct from 'common/simpleHotProduct';
import productItem from 'common/productItem';
import Newcard from 'common/newcard' //信用卡
import DkStrategy from 'common/dkStrategy'
import MoreInfo from 'common/moreInfo'

export default {
    components: {
        SimpleHotProduct,
        Tag,
        productItem,
        Newcard,
        DkStrategy,
        MoreInfo
    },
    data() {
        return {
            dkStrategyMoreTips: '全部攻略',
            recommendsProductsLength: 5,
            currentProduct: {},

            bannerImg: '',
            todayRecommendsProduct: {},
            simpleList: [],
            hotProducts: [],
            recommendsProducts: [],
            creditCardList: [],
            articleList: [],

            packageName: '',
            channelId: 13,
            jsonHeader: {},
            strHeadData: '',

            pageSize: 1000,
            pageNumber: 1,

            userId: 0,

            properImgSize: Math.ceil(this.globalFunction.BASESIZE * 5.375) ? Math.ceil(this.globalFunction.BASESIZE * 5.375) : 120,
            banner: Math.ceil(this.globalFunction.BASESIZE * 18.75) ? Math.ceil(this.globalFunction.BASESIZE * 18.75) : 750,
            allicon: Math.ceil(this.globalFunction.BASESIZE * 2) ? Math.ceil(this.globalFunction.BASESIZE * 2) : 80,
            hotImgSize: Math.ceil(this.globalFunction.BASESIZE * 1.8) ? Math.ceil(this.globalFunction.BASESIZE * 1.8) : 72,
            articleImgSize: Math.ceil(this.globalFunction.BASESIZE * 6.125) ? Math.ceil(this.globalFunction.BASESIZE * 6.125) : 135,
        };
    },
    methods: {
        getAllProducts() { // 获得首页数据 爆款，滚动信息，分类，
            let params = {
                query : `{simpleBanner: columnDetail(
                        columnKey: "app_h5_td_01"
                    ){
                        id
                        title
                        iconUrl
                        url
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
                    allProducts: recommendProducts(
                            pageNumber: ${this.pageNumber},
                            pageSize: ${this.pageSize},
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
                    },
                    creditCardList(
                        productCode: "creditCard",
                        location:"homePage"
                    ){
                        id
                        title
                        firstTags
                        url
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

                // banner 图
                if(res.data.data.simpleBanner) {
                    _this.bannerImg = _this.globalFunction.getProperImgSize(res.data.data.simpleBanner.url, _this.banner);
                }

                // 今日推荐
                _this.todayRecommendsProduct = res.data.data.todayrecommends;
                if(_this.todayRecommendsProduct && _this.todayRecommendsProduct.length > 0) {
                    _this.todayRecommendsProduct = _this.todayRecommendsProduct[0];
                }

                // 精选
                _this.hotProducts.productList = res.data.data.allProducts;
                if( _this.hotProducts.productList &&  _this.hotProducts.productList.length > 0){
                    _this.hotProducts.brandtxt = '热门口子';
                    _this.hotProducts.type = 'hotProducts';
                    _this.recommendsProducts.brandtxt = '人气爆款';
                    _this.recommendsProducts.type = 'recommendsProducts';
                    _this.recommendsProducts.productList = _this.hotProducts.productList.splice(0, _this.recommendsProductsLength);

                    _this.hotProducts.productList = _this.setProductItem(_this.hotProducts.productList, 'imgUrl', _this.allicon);
                    _this.recommendsProducts.productList = _this.setProductItem(_this.recommendsProducts.productList, 'imgUrl', _this.hotImgSize);

                    _this.hotProducts.productList = _this.editStringLenth(_this.hotProducts.productList);
                }

                // 信用卡
                _this.creditCardList.productList = res.data.data.creditCardList;
                if(_this.creditCardList.productList && _this.creditCardList.productList.length > 0) {
                    _this.creditCardList.brandtxt = '热门信用卡';
                    _this.creditCardList.type = 'creditCardList';
                    _this.creditCardList.productList = _this.setProductItem(_this.creditCardList.productList, 'imgUrl', _this.properImgSize);
                }

                // 贷款攻略
                _this.articleList.productList = res.data.data.articleList;
                if(_this.articleList.productList && _this.articleList.productList.length > 0) {
                    _this.articleList.brandtxt = '贷款攻略';
                    _this.articleList.type = 'articleList';
                    _this.articleList.productList.forEach(item => {
                        item = this.globalFunction.setArticle(item, _this.articleImgSize);
                    });
                }

                _this.simpleList.push(_this.recommendsProducts);
                _this.simpleList.push(_this.hotProducts);
                _this.simpleList.push(_this.creditCardList);
                _this.simpleList.push(_this.articleList);
            }).catch(e => {

            });
        },

        // banner 图 点击事件，跳转今日推荐详情页
        goTodayRecommendDetial() {
            this.currentProduct = this.todayRecommendsProduct;
            //跳转链接
            let params = {
                goUrl: resources.goUrl,
                urlThird: resources.goProductDetail,
                product: this.todayRecommendsProduct,
                jsonHeader: this.jsonHeader,
                strHeadData: this.strHeadData
            }
            let  tip = this.globalFunction.goThirdWithoutUserId(params);
            if(tip == 'needLogin') {
				this.globalFunction.Weaklogin('', 'simpleIndexSuccess');
			}
        },

        simpleIndexSuccess(userObj) {
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

        goOtherPage(pageName){ // 贷款页面
            window.location.href = `${resources.goUrl}/${pageName}?strHeader=${this.strHeadData}`;
        },

        //处理拿到的产品信息换算
        setProductItem(productlist, imgUrlKey, properSize) {
            productlist.forEach(item => {
                item = this.globalFunction.setProduct(item, imgUrlKey, properSize);
            });
            return productlist;
        },
        
        // 截取字符串
        editStringLenth(productlist){
            productlist.forEach(item => {
                item.title =  this.globalFunction.methodGetByteLen(item.title, 4);
                item.tagText = this.globalFunction.methodGetByteLen(item.tagText, 4);
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
    created() {
        let headerInfo = this.globalFunction.getHeader(this.jsonHeader, this.$route);
        this.jsonHeader = headerInfo.jsonHeader;
        this.strHeadData = headerInfo.strHeadData;

        this.packageName = this.jsonHeader['Package-Name'];
        this.channelId = this.jsonHeader['Channel-Id'];

        // 拿到UserId 如果老包,是强登录，肯定有userId
        this.userId = Math.ceil(localStorage.getItem('Userid')) ? localStorage.getItem('Userid') : Math.ceil(this.jsonHeader['User-Id']);

        this.getAllProducts();

        this.$nextTick(() => {
            if(this.$route.meta.isBack){
                let height = parseFloat(localStorage.getItem('scrollHeightSimple'));

                if(height > 0) {
                    setTimeout(() => {
                        window.scrollTo(0, height);
                    }, 200);
                }
            }
        });
    },
    mounted() {
        window.simpleIndexSuccess = this.simpleIndexSuccess;
    },
    activated() {
        setTimeout(() => {
            window.onscroll = ()=> {
                let sh = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                localStorage.setItem('scrollHeightSimple', sh);
            }
        }, 1000);
    }
}
</script>
<style lang="scss" scoped>
@import '~src/styles/var.scss';

.abridged-edition-index {
    margin-bottom: 80 * $rem;

    .content-list {
        margin-bottom: 10 * $rem;
    }

    .banner-img {
        width: 100%;
        height: 358 * $rem;
        .img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
