<template>
    <div class="newdk-loadmore-wrapper" ref="wrapper"> 
        <div class="banner-box" v-if="bannerImg" ref="bannerIamge">
            <div class="banner">
                <img :src="bannerImg" alt="" class="banner-img">
            </div>
        </div>
        <mt-loadmore :top-method="loadMore" @top-status-change="handleTopChange"  ref="loadmore" :max-distance="100" >
            <div class="dk-box" :class="{'has-tab' : showtab == 'true'}" :style="{'min-height': contentHeight + 'px'}">
                <div class="product-list mt"  v-if="productList.length > 0">
                    <product-item  v-if="productList.length > 0" :strHeadData="strHeadData" :product="product" v-for="(product, index) in productList" :key="index"></product-item>
                </div>
                <page-list :allLoaded=true :topStatus="topStatus" v-on:load-more="loadMore"></page-list>
            </div>
        </mt-loadmore>
    </div>
</template>

<script charset="UTF-8">
let qs = require('qs');
import resources from "src/resources";
import ProductItem from 'common/productItem';
import Newheader from 'common/newheader' //顶部导航
import PageList from 'common/pageList' // 分页

export default {
    components:{
        ProductItem,
        Newheader,
        PageList
    },
  data() {
    return {
        productList: [],
        bannerImg: '',

        wrapperHeight: 0,
        contentHeight: 0,

        topStatus: "",

        jsonHeader: '',
        strHeadData: '',
        packagename: '',
        channelId: '',
        banner: Math.ceil(this.globalFunction.BASESIZE * 18.75) ? Math.ceil(this.globalFunction.BASESIZE * 18.75) : 750,
        properImgSize: parseInt(this.globalFunction.BASESIZE * 6.125) ? parseInt(this.globalFunction.BASESIZE * 6.125) : 122
    };
  }, 
    methods: {
        getproductList(event, id){
            let _this = this;
            let params = {
                 query : `
                 {
                    productList: recommendProducts (
                        columnKey:"app_h5_approve_01",
                        packageName: "${this.packagename}",
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
                    },articleBanner: columnDetail(
                        columnKey: "app_h5_approve_01"
                    ){
                        id
                        title
                        iconUrl
                        url
                    }
                }`
            };

            _this.$axios.post(`${resources.v2GraphQlApi}`, qs.stringify(params),
                {}
            )
            .then(res => {
                    if(!res.data.data) {
                        return;
                    }
                    if(event || id) {
                        _this.productList = [];
                    }
                    if(res.data.data.productList && res.data.data.productList.length > 0) {
                        _this.productList = this.productList.concat(res.data.data.productList);
                        _this.productList.forEach(item => {
                            item = _this.globalFunction.setProduct(item,'imgUrl', _this.properImgSize);
                        });
                    }
                    if(res.data.data.articleBanner) {
                        _this.bannerImg = _this.globalFunction.getProperImgSize(res.data.data.articleBanner.url, _this.banner);
                        // _this.bannerImg = res.data.data.articleBanner.url;
                    }
                }).catch(error => {
                });
        },
        handleTopChange(status) {   //下拉状态
            this.moveTranslate = 1;
            this.topStatus = status;
        },
        loadMore() {  //下拉刷新成功
            let _this = this;
            setTimeout(() => {
                _this.getproductList(null, 'refresh');
                _this.$refs.loadmore.onTopLoaded();
            }, 850);
        }
    },
    created(){
        let headerInfo = this.globalFunction.getHeader(this.jsonHeader, this.$route);
        this.jsonHeader = JSON.parse(decodeURIComponent(this.$route.query.strHeader));
        this.packagename = this.jsonHeader['Package-Name'];
        this.channelId = this.jsonHeader['Channel-Id'];

        this.strHeadData = encodeURIComponent(JSON.stringify(this.jsonHeader));

        this.showtab =  this.globalFunction.showtab(this.jsonHeader);

        this.getproductList();
        document.documentElement.scrollTop=0;
        document.body.scrollTop = 0;
    },
    mounted(){
        let _this = this;
        setTimeout(() => {
            _this.wrapperHeight = document.documentElement.clientHeight - _this.$refs.wrapper.getBoundingClientRect().top;
            if(_this.$refs.bannerIamge) {
                _this.contentHeight = _this.wrapperHeight - _this.$refs.bannerIamge.offsetHeight;
            }
        },500); 
    }
};
</script>

<style lang="scss" scoped>
@import '~src/styles/var.scss';
.newdk-loadmore-wrapper{
    overflow: scroll;
    -webkit-overflow-scrolling: touch; //ios加载缓慢
    background: $backgroundColor;


    .banner-box {
        background-color: $backgroundColor;

        .banner{
            width: 100%;
            height: 230*$rem;
            .banner-img {
                width: 100%;
                height: 100%;
            }
        }
    }

    .product-list {
        border-top: 2.1 * $rem solid $lightBorder;
    }

    .page-infinite-loading {
        text-align: center;
        height: 3.5rem;
        line-height: 3.5rem;
        font-size: 0.7rem;
        background: $backgroundColor;
    }

    // 到底了
    .loadwrap {
        height: 3rem;
        line-height: 3rem;
        text-align: center;
        overflow: hidden;

        .allLoaded-tip {
            position: relative;
            display: inline-block;
            color: $textColor;

            &::after {
                position: absolute;
                content: '';
                width: 50%;
                height: 1px;
                top: 50%;
                right: -175 * $rem;

                background-color: $lighterTextColor;
            }

            &::before {
                position: absolute;
                content: '';
                width: 50%;
                height: 1px;
                top: 50%;
                left: -175 * $rem;

                background-color: $lighterTextColor;
            }
        }
    }
}
</style>