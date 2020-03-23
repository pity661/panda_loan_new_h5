<template>
    <div class="newdk-loadmore-wrapper" ref="wrapper" id="dk-list"  :style="{height: wrapperHeight + 'px', '-webkit-overflow-scrolling' : scrollMode}"> 
        <div class="dk-filter clear" ref='filterBox'>
            <div class="select-box fl">
                <select class="select-item"  name="dkAmount" @change="getProductList($event)" id="dkAmount">
                    <option v-for="(amount) in filterList.dkAmountRanges" :key="amount.id"  :value="amount.id" :disabled="amount.id === -1" :selected="amount.id == selectedParams.dkAmount.id">{{amount.rang}}</option>
                </select>
            </div> 
            <div class="select-box fr">
                <select class="select-item" name="terms" @change="getProductList($event)" id="terms">
                    <option v-for="(term) in filterList.terms" :key="term.id" :value="term.id"  :disabled="term.id === -1" :selected="term.id == selectedParams.terms.id">{{term.duration}}</option>
                </select>
            </div>
        </div>
        <mt-loadmore :top-method="loadTop" :bottom-all-loaded="allLoaded" :max-distance="150" :auto-fill="false"  @top-status-change="handleTopChange" ref="loadmore">
            <div class="dk-box" id="dk-result" infinite-scroll-disabled="allLoaded"  :style="{'min-height': contentHeight + 'px'}">
                <div class="dk-result-list" ref="resultList">
                    <product-item  v-if="allProduct.length > 0" :strHeadData = 'strHeadData' v-for="(product, index) in allProduct" :index="index" :product="product" :key="index"></product-item>
                    <page-list :allLoaded="allLoaded" :topStatus="topStatus" :nextPageClicked="nextPageClicked" :pageLoaded="pageLoaded" v-on:load-more="loadMore"></page-list>
                </div>
            </div>
        </mt-loadmore>
    </div>
</template>
 
<script charset="UTF-8">
import resources from "../../resources";
import productItem from "common/productItem.vue";
import PageList from 'common/pageList' // 分页

let qs = require('qs');

export default {
    components: {
        productItem,
        PageList
    },
    data() {
        return {
            pageSize: 10,
            pageNumber: 1,
            packageName: '',
            pagesCount: 1,
            channelId: '',
            jsonHeader: '',
            strHeadData: '',
            Uid: this.$route.params.Uid,

            allLoaded: false, //这个
            topStatus: "",
            loading: false, //加载中
            nextPageClicked: false,
            scrollMode: 'auto',
            
            wrapperHeight: 0,
            contentHeight: 0,

            allProduct: [],
            filterList: {
                dkAmountRanges: [],
                terms: []
            },
            selectedParams: {
                dkAmount: {
                    id: -1
                },
                terms: {
                    id: -1
                }
            },
            pageLoaded: false,

            pageName: 'newdk',
            defaultTitle: '贷款',
            properImgSize: parseInt(this.globalFunction.BASESIZE * 3.55) ? parseInt(this.globalFunction.BASESIZE * 3.55) : 70
        };
    },
    methods: {

        getFilterList() {  // 获取筛选条件数据
            // 筛选条件
            let that = this;
            let params = {
                query : `{amountRanges{
                                        id 
                                        minAmount
                                        maxAmount
                                    } 
                                    terms{
                                        id
                                        duration
                                    }
                                }`
            };

            // 请求数据
            that.$axios.post(`${resources.v2GraphQlApi}`, qs.stringify(params),
                {}
            ).then(res => {
                // console.log(res)
                that.list = res.data.data.amountRanges;
                if (res.data.data && res.data.data.amountRanges) {
                    that.filterList.dkAmountRanges = res.data.data.amountRanges;
                    that.filterList.dkAmountRanges.forEach(amount => {
                        amount.rang = amount.minAmount + "-" + amount.maxAmount;
                        if(amount.rang=='0-0'){
                            amount.rang = '全部'
                        }
                        if(amount.rang=='10001-0'){
                            amount.rang = '10001以上'
                        }
                    });
                    that.filterList.dkAmountRanges.splice(0, 0, {
                        id: -1,
                        rang: "贷款金额"
                    });
                }
                if (res.data.data && res.data.data.terms) {
                    that.filterList.terms = res.data.data.terms;
                    that.filterList.terms.forEach(amount => {
                        if(amount.duration=='0'){
                            amount.duration = '全部'
                        }
                    });
                    that.filterList.terms.splice(0, 0, {
                        id: -1,
                        duration: "贷款期限"
                    });
                }
            });
        },

        getProductList(event, id) {  // 获得产品列表
            let that = this;
            if (event || id) {
                if (event) {
                    that.selectedParams[event.target.name].id = event.target.value;
                }
            }
            //请求数据
            that.loading = true;
            let params = {
            query: `{recommendProductsPage(
                        amountRangeId: ${that.selectedParams.dkAmount.id},
                        term: ${that.selectedParams.terms.id},
                        pageSize: ${that.pageSize},
                        pageNumber: ${that.pageNumber},
                        packageName: "${that.packageName}",
                        channelId: ${that.channelId}
                        ){
                            dataCount
                            pagesCount
                            pageSize
                            pageNumber
                            data {
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
                        }
                    }`
            };
            setTimeout(() => { //延时请求数据

                that.$axios.post(`${resources.v2GraphQlApi}`, qs.stringify(params),
                    {}
                ).then(res => {
                    // console.log(res)
                    that.loading = false;
                    var array = [];
                    if (res.data.data.recommendProductsPage && res.data.data.recommendProductsPage.data.length > 0) {
                        that.pagesCount = res.data.data.recommendProductsPage.pagesCount;
                        array = res.data.data.recommendProductsPage.data;
                        array.forEach(item => {
                            item = that.globalFunction.setProduct(item, 'imgUrl', that.properImgSize);
                        });
                    }

                    if(event || id) {
                        that.allProduct = [];
                    }
                    that.allProduct = that.allProduct.concat(array);

                    setTimeout(() => {
                        that.pageLoaded = true;
                        that.nextPageClicked = false;
                    }, 100);

                    that.$nextTick(function () {
                        that.scrollMode = "touch";
                    });

                    if (that.pagesCount <= that.pageNumber) {
                        that.allLoaded = true; //判断是否为空终止无限加载
                        return
                    }
                });
            },700);
        },

        loadMore() { //底部判断
            if(!this.loading) {
                this.nextPageClicked = true;
                this.$refs.loadmore.onBottomLoaded(); //通知loadmore组件从新渲染，计算
                this.pageNumber++;
                this.getProductList();
            }
        },

        handleTopChange(status) {   //下拉状态
            // this.moveTranslate = 1;
            this.topStatus = status;
        },

        loadTop() {  //下拉刷新
            let that = this;
            setTimeout(() => {
                that.pageNumber = 1;
                that.allLoaded = false;
                that.getProductList(null, 'refresh');
                that.$refs.loadmore.onTopLoaded();
            }, 850);
        },

    },
    created() {
        let headerInfo = this.globalFunction.getHeader(this.jsonHeader, this.$route);
        this.jsonHeader = headerInfo.jsonHeader;
        this.strHeadData = headerInfo.strHeadData;

        this.packageName = this.jsonHeader['Package-Name'];
        this.channelId = this.jsonHeader['Channel-Id'];

        this.userId = parseInt(localStorage.getItem('Userid')) ? localStorage.getItem('Userid') : parseInt(this.jsonHeader['User-Id']);

        this.strHeadData = encodeURIComponent(JSON.stringify(this.jsonHeader));

        this.getFilterList();
        this.getProductList();
    },
    mounted(){
        let _this = this;
        let height = _this.globalFunction.BASESIZE * 2.5;
        setTimeout(() => {
            if(_this.globalFunction.showtab(_this.jsonHeader) === 'false'){
                _this.wrapperHeight = document.documentElement.clientHeight - _this.$refs.wrapper.getBoundingClientRect().top;
            }else{
                _this.wrapperHeight = (document.documentElement.clientHeight - _this.$refs.wrapper.getBoundingClientRect().top) - height;
            }
            _this.contentHeight = _this.wrapperHeight - _this.$refs.filterBox.offsetHeight;
        }, 500);

    }
};
</script>

<style lang="scss" scoped> /*当前页面样式*/
    @import '~src/styles/var.scss';

    .newdk-loadmore-wrapper{

        overflow: scroll;
        -webkit-overflow-scrolling: touch; //ios加载缓慢
        background:$backgroundColor;

        .dk-filter {
            background-color: $backgroundColor;
            padding: 30 * $rem;

            .select-item {
                width: 330 * $rem;
                height: 90 * $rem;
                padding-left: 28 * $rem;
                padding-right: 20 * $rem;

                font-size: 30 * $rem;
                color: $textColor;

                border-radius: 10px;
                background-color: $white;


                appearance:none;  
                -moz-appearance:none;  
                -webkit-appearance:none;

                &::-ms-expand{ display: none; }
            }

            .select-box {
                position: relative;

                &::after {
                    position: absolute;
                    content: "";

                    top: 38 * $rem;
                    right: 20 * $rem;

                    width: 27 * $rem;
                    height: 15 * $rem;
                    background: url(~src/assets/down@2x.png) no-repeat scroll right center transparent;
                    background-size: 27 * $rem 15 * $rem;
                }
            }
        }
    }     
</style>
