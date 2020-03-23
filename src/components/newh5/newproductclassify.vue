<template>
    <div class="newdk-loadmore-wrapper" ref="wrapper" :style="{height: wrapperHeight + 'px'}"> 
        <Newheader :jsonHeader="strHeadData" :title="titlename"></Newheader>
        <div class="classify" v-if="bannerImg" ref="bannerIamge">
            <div class="classifybanner">
                <img :src="bannerImg" alt="" class="classifybannerimg">
            </div>
        </div>
        <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange"  ref="loadmore" :max-distance="100" >
            <div class="dk-box" :class="{'has-tab' : showtab == 'true'}" :style="{'min-height': contentHeight + 'px'}">
                <div class="product-list">
                    <product-item  v-if="classifyProductlist.length > 0" :strHeadData="strHeadData" :product="product" v-for="(product, index) in classifyProductlist" :key="index"></product-item>
                </div>
                <div class="reshow-classify-list clear" v-if="reshowClassifyList.length > 0">
                    <div class="classify-item fl" @click="toClassification(item, item.index)" v-for="(item, index) in reshowClassifyList" :key="`A-${index}`">
                        <img class="img" v-lazy="item.iconUrl" alt="">
                        <p class="title">{{item.title}}</p>
                    </div>
                </div>
                <page-list :allLoaded=true :topStatus="topStatus" v-on:load-more="loadTop"></page-list>
            </div>
        </mt-loadmore>
    </div>
</template>

<script charset="UTF-8">
let qs = require('qs');
import resources from "src/resources";
import productItem from 'common/productItem';
import Newheader from 'common/newheader' //顶部导航
import PageList from 'common/pageList' // 分页

export default {
    components:{
        productItem,
        Newheader,
        PageList
    },
  data() {
    return {
        classnewhader:true,
        titlename:this.$route.query.title,
        classifyProductlist:[],
        classifyId: this.$route.query.id,
        bannerImg: decodeURIComponent(this.$route.query.url),

        topStatus: "",
        loadingStatus: "",

        wrapperHeight: 0,
        contentHeight: 0,

        jsonHeader: '',
        packagename: '',
        channelId: '',
        strHeadData: '',
        properImgSize: parseInt(this.globalFunction.BASESIZE * 3.5) ? parseInt(this.globalFunction.BASESIZE * 3.5) : 65,
        reshowClassifyList: [],
        classifyIndex: 0,
        sunJsonHeader: encodeURIComponent(this.$route.query.strHeader)
    };
  }, 
    methods: {
        getclassifyproduct(event, id){
            let _this = this;
            let params = {
                 query : `
                 {
                    recommendProducts(
                    productTypeId: ${this.$route.query.id},
                    packageName: "${this.packagename}",
                    channelId: ${this.channelId}
                 ){
                    id
                    title
                    maxTerm
                    minTerm
                    dayRate
                    imgUrl
                    url
                    minAmount
                    maxAmount
                    firstTags
                    directJump
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
                        _this.classifyProductlist = [];
                    }
                    if(res.data.data.recommendProducts && res.data.data.recommendProducts.length > 0) {
                        _this.classifyProductlist = this.classifyProductlist.concat(res.data.data.recommendProducts);
                        _this.classifyProductlist.forEach(item => {
                            item = _this.globalFunction.setProduct(item, 'imgUrl', _this.properImgSize);
                        });
                    }
                }).catch(error => {
                });
        },

        // 去另一个产品分类页
        toClassification(item,index) {
            window.location.href = `${resources.goUrl}/newproductclassify?index=${index}&title=${item.title}&id=${item.id}&uid=${this.Uid}&url=${item.url}&strHeader=${this.sunJsonHeader}`;
        },
        handleTopChange(status) {   //下拉状态
            this.moveTranslate = 1;
            this.topStatus = status;
            if (status == "pull") {
                this.loadingStatus = "下拉刷新";
            }
            if (status == "drop") {
                this.loadingStatus = "";
            }
        },
        loadTop() {  //下拉刷新成功
            let _this = this;
            setTimeout(() => {
                _this.getclassifyproduct(null, 'refresh');
                _this.$refs.loadmore.onTopLoaded();
            }, 850);
        }
    },
    created(){
        this.jsonHeader = JSON.parse(decodeURIComponent(this.$route.query.strHeader));
        this.packagename = this.jsonHeader['Package-Name'];
        this.channelId = this.jsonHeader['Channel-Id'];
        this.classifyIndex = parseInt(this.$route.query.index);

        this.strHeadData = encodeURIComponent(JSON.stringify(this.jsonHeader));

        this.showtab =  this.globalFunction.showtab(this.jsonHeader);

        this.getclassifyproduct();

        // 拿到后三个分类
        let classifyList = JSON.parse(localStorage.getItem('ClassifyList'));
        this.reshowClassifyList = this.globalFunction.getReshowClassifyList(classifyList, this.classifyIndex);

        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    },

    mounted(){
        let _this = this;
        setTimeout(() => {
            _this.wrapperHeight = document.documentElement.clientHeight - _this.$refs.wrapper.getBoundingClientRect().top;
            _this.contentHeight = _this.wrapperHeight - _this.$refs.bannerIamge.offsetHeight;

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

    .classify {
        background-color: $backgroundColor;

        .classifybanner{
            margin-bottom: 12 * $rem;
            width: 100%;
            height: 230*$rem;

            .classifybannerimg {
                width: 100%;
                height: 100%;
            }
        }
    }

    .page-infinite-loading {
        text-align: center;
        height: 3.5rem;
        line-height: 3.5rem;
        font-size: 0.7rem;
        background: $backgroundColor;
    }

    .reshow-classify-list {
        margin-top: 12 * $rem;
        padding: 30 * $rem 18 * $rem;
        background-color: $white;

        .classify-item {
            width: 214 * $rem;
            height: 214 * $rem;
            margin: 0 12 * $rem;

            .img {
                padding: 35 * $rem 58 * $rem;
                padding-bottom: 10 * $rem;
                width: 95 * $rem;
                height: 95 * $rem;
            }

            .title {
                text-align: center;
                font-size: $smallFontSize;
                color: $textColor;
            }
        }
    }
}
</style>