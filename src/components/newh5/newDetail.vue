<template>
<div class="newdetails"  :style="{'min-height': (wrapperHeight + 60) + 'px'}">
    <Newheader :jsonHeader='strHeadData' :title="titlename"></Newheader>
    <div class="detail-box" :style="{'min-height': (wrapperHeight + 60) + 'px'}">
        <div class="detail-info">
            <!-- 名字 -->
            <div class="detail-name clear">
                <div class="detail-name-content">
                    <div class="detail-name-title">
                        <img class="detail-img fl" :src="product.imgUrl" alt="">
                        <span class="detail-title fl">{{product.title}}</span>
                    </div>
                    <!-- 最高额度 -->
                    <div class="details-maxedu">
                        最高额度(元)
                    </div>
                    <div class="details-edu">
                        {{product.maxAmount}}
                    </div>
                    <!-- 放款时效、月利率 -->
                    <div class="details-menu">
                        <div class="details-menucontent fl">
                            <span class="menucontent-title">放款时效</span>
                            <p class="menucontent-info">{{product.creditExpiryDate}}</p>
                        </div>
                        <div class="details-menucontent fl">
                            <span class="menucontent-title">月利率</span>
                            <p class="menucontent-info">{{product.monthRateText}}</p>
                        </div>
                        <div class="details-menucontent fl" style="border:none;">
                            <span class="menucontent-title">贷款期限</span>
                            <p class="menucontent-info">{{product.termName}}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="detail-description">
                <div class="description-line">
                    <span class="description-title icon-line application-icon">申请条件</span>
                    <p class="description-value">{{product.applyConditionName}}</p>
                </div>
                <div class="description-line dk-tip">
                    <span class="description-title tip-title dk-tip-icon">借款说明</span>
                    <p class="description-value tip-info">{{product.productIntroduction}}</p>
                </div>
            </div>
        </div>
        <div class="refund-tips">
            <div class="refund-title">
                <span class="title icon-line refund-icon">还款说明</span>
            </div>
            <ul class="refund-type-list">
                <li class="refund-item">
                    <span class="item-title">还款方式：</span>
                    <span class="item-info">{{product.repayTypeName}}</span>
                </li>
                <li class="refund-item">
                    <span class="item-title">提前还款：</span>
                    <span class="item-info">{{product.earlyRepayName}}</span>
                </li>
            </ul>
        </div>
        <button class="go-btn" @click="goImmediately(product)" :disabled="!product.accordWithRule" v-if="!product.accordWithRule">
            立即申请
        </button>
        <button class="go-btn" @click="goImmediately(product)" :disabled="product.reachLimit" v-else>
           <span v-if="product.reachLimit" class="go-btn-span">今日申请人数已满</span>
           <span v-else class="go-btn-span">立即申请</span>
        </button>
    </div>
</div>

</template>

<script charset="UTF-8">
import { Toast } from 'mint-ui';
import resources from 'src/resources';
import Newheader from 'common/newheader' //顶部导航
let qs = require('qs');

export default {
    components:{
        Newheader
    },
    data() {
        return {
            titlename:'',
            productId: this.$route.query.productId,
            product: [],
            jsonHeader: '',
            strHeadData: '',
            userId: 0,
            gourl: '',
            detailImg:Math.ceil(this.globalFunction.BASESIZE * 1.25) ? Math.ceil(this.globalFunction.BASESIZE * 1.25) : 60,
            wrapperHeight: 0
        }
    },
    methods: {

        getDetail() {  // 获得产品详情
            //跳转链接
            let url = resources.getProductWithRule;
            let params = {
                "userId": this.userId,
                "productId": this.productId
            };
            this.$axios.post(url, qs.stringify(params)).then(res => {
                if(!res.data.obj1) {
                    return;
                }
                this.product = this.globalFunction.setProduct(res.data.obj1);
                this.product.imgUrl = this.globalFunction.getProperImgSize(this.product.imgUrl, this.detailImg+10);
            });
        },

        detailsSuccess(userObj){   // 是否成功调起登录
            let params = {
				goUrl: resources.goUrl,
				urlThird: resources.goProductDetail,
				product: this.product,
				jsonHeader: this.jsonHeader,
				strHeadData: this.strHeadData
			}
            this.userId = userObj && userObj.id ? userObj.id : 0;
			this.globalFunction.productLoginSuccess(userObj, params);
        },

        goImmediately(product) {
            //跳转链接
            let params = {
                isDetail: true,
                goUrl: resources.goUrl,
                urlThird: resources.goProductDetail,
                product: product,
                jsonHeader: this.jsonHeader,
                strHeadData: this.strHeadData
            }
            let tip = this.globalFunction.goThirdWithoutUserId(params);
            if(tip == 'needLogin') {
                this.globalFunction.Weaklogin('', 'detailsSuccess');
            }
        }
    },
    created() {
        this.jsonHeader = JSON.parse(decodeURIComponent(this.$route.query.strHeader));
        this.userId = parseInt(localStorage.getItem('Userid')) ? localStorage.getItem('Userid') : parseInt(this.jsonHeader['User-Id']);
        this.strHeadData = encodeURIComponent(JSON.stringify(this.jsonHeader));
        this.titlename = this.$route.query.productname; //h5导航名字
        this.getDetail();
        this.wrapperHeight = document.documentElement.clientHeight;

        let eleHtml = document.getElementsByTagName('html')[0],
            eleBody = document.getElementsByTagName('body')[0];

        eleHtml.style.width = '100%';
        eleHtml.style.height = '100%';
        eleBody.style.width = '100%';
        eleBody.style.height = '100%';
    },
    mounted(){
        window.detailsSuccess = this.detailsSuccess;
    }
};

</script>

<style lang="scss" scoped>
@import '~src/styles/var.scss';

.newdetails {
    width: 100%;
    height: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
}
.detail-box {
    height: 100%;
    overflow: auto;
    .detail-info,
    .refund-tips {
        background-color: $white;
        border-radius: 12 * $rem;
    }

    .refund-tips {
        margin-top: 15 * $rem;
        margin-bottom: 50 * $rem;
        padding: 15 * $rem 30 * $rem 30 * $rem 30 * $rem;
        color: $darkTextColor;

        .refund-title {
            font-size: 26 * $rem;
            line-height: 60 * $rem;
        }
        .refund-icon {
            padding-left: 36 * $rem;

            &::after {
                top: 0 * $rem;
                width: 28 * $rem;
                height:  28 * $rem;
                background-image: url(~src/assets/refundExplain@3x.png);
                background-size: 27 * $rem 29 * $rem;
            }
        }

        .refund-item {
            font-size: 26 * $rem;
            line-height: 52 * $rem;

            .item-info {
                color: $lighterTextColor;
            }
        }
    }
    //   m名称
    .detail-name {
        border-bottom: 15*$rem solid #f5f5f5;;
        padding: 25*$rem 35*$rem;
        width: 100%;
        height: auto;
        background: $themeColor;
        overflow: hidden;

        .detail-name-content {
            padding: 20*$rem;
            width: 680 * $rem;
            height: 360 * $rem; 
            background:url('~src/assets/detailsbackgeround017.png');
            background-size:100% 100%; 
            border-radius:5px; 
            overflow: hidden;

            .detail-name-title {
                width: 100%;
                height: 50 * $rem; 
                line-height: 50 * $rem; 
                font-size: 24*$rem;
                color: #292929;

                .detail-img {
                    margin-right: 15*$rem;
                    border-radius: 100%; 
                    width: 50*$rem;
                    height: 50*$rem; 
                }
            }
        }
    }

    .details-maxedu { //最高额度
        width: 100%;
        height: 45 * $rem; 
        line-height: 45 * $rem; 
        text-align: center;
        font-size: 30*$rem;
        color: $themeColor;
    }
    .details-edu { //额度
        width: 100%;
        height: 90 * $rem;
        line-height: 90 * $rem; 
        text-align: center;
        font-size: 70*$rem;
        color: $themeColor;
    }
    // 放款时效
    .details-menu {
        margin: 0 auto;
        margin: 50*$rem 0rem  25*$rem 0rem;
        width: 640*$rem;
        height: auto;
        overflow: hidden;

        .details-menucontent {
            border-right:2.1*$rem solid $lightBorder; 
            width: 33.3%;
            height: 70*$rem;
            text-align: center;
            font-size: 24*$rem;

            .menucontent-title {
                color: $themeColor;
            }

            .menucontent-info {
                line-height: 45*$rem;
                font-size: 26*$rem;
                font-weight: bold;
                color: $themeColor;
            }
        }
    }
    .detail-description {
        padding: 15 * $rem 30 * $rem 50 * $rem 30 * $rem;
        .description-line {
            font-size: 26 * $rem;
            line-height: 60 * $rem;

            .description-title {
                    position: relative;
                    color: $darkTextColor;
                    padding-left: 36 * $rem;

                    &::after {
                        position: absolute;
                        content: "";
                        top: 0 * $rem;
                        left: 0;

                        width: 26 * $rem;
                        height: 30 * $rem;
                        background-image: url(~src/assets/application.png);
                        background-size: 26 * $rem 30 * $rem;
                        background-repeat: no-repeat;
                    }

                    &.examine-limit-icon::after {
                        background-image: url(~src/assets/examineLimit@3x.png)
                    }

                    &.limit-icon::after {
                        background-image: url(~src/assets/dkTimeDeadLine@3x.png)
                    }

                    &.dk-tip-icon::after {
                        left: 2 * $rem;
                        background-image: url(~src/assets/borrowingThat@3x.png);
                        background-size: 24 * $rem 30 * $rem;
                    }
            }
            .description-value {
                text-indent: 36 * $rem;
                color: $lighterTextColor;

                &.tip-info {
                    color: $themeColor;
                }
            }
        }
    }

    .icon-line {
        position: relative;

        &::after {
            position: absolute;
            content: "";
            top: 0 * $rem;
            left: 0;

            width: 26 * $rem;
            height: 30 * $rem;
            background-size: 26 * $rem 30 * $rem;
            background-repeat: no-repeat;

        }
    }

    .go-btn {
        display: block;
        margin: 0 auto;
        margin-bottom: 120 * $rem;
        width: 690 * $rem;
        height: 100 * $rem;
        font-size: 32 * $rem;
        background-color: $btnColor;
        border: none;
        border-radius: 10 * $rem;
        color: $white;

        &:disabled {
            background-color: $darkerBorder;
        }
        .go-btn-span{
            font-size: 32 * $rem;
            color: $white;
        }
    }
}
</style>

