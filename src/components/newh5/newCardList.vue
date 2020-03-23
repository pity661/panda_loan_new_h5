<template>
    <div class="newdk-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }"> 
        <Newheader :jsonHeader="strHeadData" :title="titlename"></Newheader>
        <div class="banner-box" v-if="bannerImg" ref="bannerIamge">
            <div class="banner">
                <img :src="bannerImg" alt="" class="banner-img">
            </div>
        </div>
        <mt-loadmore :top-method="loadTop" :bottom-all-loaded=true @top-status-change="handleTopChange"  ref="loadmore" :max-distance="100" >
            <div class="dk-box" :class="{'has-tab' : showtab == 'true'}" :style="{'min-height': contentHeight + 'px'}">
                <div class="product-list">
                    <Newcard v-if="cardList.length > 0" :cardProductlist="cardList" :hasEmpty=true :hasTopBorder=true></Newcard>
                </div>
                <page-list :allLoaded=true :topStatus="topStatus"></page-list>
            </div>
        </mt-loadmore>
    </div>
</template>

<script charset="UTF-8">
let qs = require('qs');
import resources from "src/resources";
import Newcard from 'common/newcard' //信用卡
import Newheader from 'common/newheader' //顶部导航
import PageList from 'common/pageList' // 分页

export default {
    components:{
        Newcard,
        Newheader,
        PageList
    },
  data() {
    return {
        titlename: this.$route.query.title,
        cardList:[],
        bannerImg: '' ,

        wrapperHeight: 0,
        contentHeight: 0,

        loading: false, //加载中
        topStatus: "",
        loadingStatus: "",

        jsonHeader: '',
        packagename: '',
        channelId: '',
        strHeadData: '',
        properImgSize: parseInt(this.globalFunction.BASESIZE * 3.5) ? parseInt(this.globalFunction.BASESIZE * 3.5) : 65,
        banner: Math.ceil(this.globalFunction.BASESIZE * 18.75) ? Math.ceil(this.globalFunction.BASESIZE * 18.75) : 750,
    };
  }, 
    methods: {
        getCardList(event, id) {
            let _this = this;
            let params = {
                 query : `
                    {
                    creditCardPageList(
                        productCode: "creditCard"
                    ){
                        data{
                            id
                            title
                            firstTags
                            url
                            directJump
                            imgUrl
                        }
                    },cardBanner: columnDetail(
                        columnKey: "app_h5_credit_01"
                    ){
                        id
                        title
                        iconUrl
                        url
                    }
                    }`
            };
            _this.loading = true;

            _this.$axios.post(`${resources.v2GraphQlApi}`, qs.stringify(params),
                {}
            )
            .then(res => {
                    _this.loading = false;
                    if(!res.data.data) {
                        return;
                    }
                    if(event || id) {
                        _this.cardList = [];
                    }
                    if(res.data.data.creditCardPageList.data) {
                        _this.cardList = this.cardList.concat(res.data.data.creditCardPageList.data);
                        _this.cardList.forEach(item => {
                            item = _this.globalFunction.setProduct(item, 'imgUrl', _this.properImgSize);
                        });
                    }
                    if(res.data.data.cardBanner) {
                        _this.bannerImg = _this.globalFunction.getProperImgSize(res.data.data.cardBanner.url, _this.banner);
                        // _this.bannerImg = res.data.data.cardBanner.url;
                    }
                }).catch(error => {
                });
        },
        handleTopChange(status) {   //下拉状态
            this.moveTranslate = 1;
            this.topStatus = status;
        },
        loadTop() {  //下拉刷新成功
            let _this = this;
            setTimeout(() => {
                _this.getCardList(null, 'refresh');
                _this.$refs.loadmore.onTopLoaded();
            }, 850);
        }
    },
    created(){
        this.jsonHeader = JSON.parse(decodeURIComponent(this.$route.query.strHeader));
        this.packagename = this.jsonHeader['Package-Name'];
        this.channelId = this.jsonHeader['Channel-Id'];

        this.strHeadData = encodeURIComponent(JSON.stringify(this.jsonHeader));

        this.showtab =  this.globalFunction.showtab(this.jsonHeader);

        this.getCardList();
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    },
    mounted(){
        let _this = this;
        setTimeout(() => {
            _this.wrapperHeight = document.documentElement.clientHeight - _this.$refs.wrapper.getBoundingClientRect().top;
            if(_this.$refs.bannerIamge) {
                _this.contentHeight = _this.wrapperHeight - _this.$refs.bannerIamge.offsetHeight;

            }
        }, 500);
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
            overflow: hidden;
            .banner-img {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>