<template>
    <div class="bran-box">
        <div class="brand-recomendation-box clear" @click="getbrandurl(brandProduct)">
            <img class="product-img fl" v-lazy="brandProduct.imgUrl" alt="">
            <div class="brand-info fl">
                <p class="brand-title">{{brandProduct.title}}</p>
                <p class="brand-edu">最高{{brandProduct.maxAmount}}元</p>
            </div>
            <div class="brand-detail fl">
                <p class="brand-limit-time" v-if="brandProduct.minTerm == brandProduct.maxTerm">期限{{brandProduct.maxTerm}}个月</p>
                <p class="brand-limit-time" v-else>期限{{brandProduct.minTerm}}~{{brandProduct.maxTerm}}个月</p>
                <p class="brand-rate">{{brandProduct.monthRateText}}</p>
            </div>
        </div>
    </div>
</template>

<script  charset="UTF-8">
import resources from "src/resources";
import { Toast } from 'mint-ui';
export default {
    props: ['brandProduct', 'strHeadData'],
    data() {
        return {
            userId: 0,
            sunJsonHeader: this.strHeadData,
            jsonHeader: JSON.parse(decodeURIComponent(this.strHeadData)) 

        }
    },
    methods: {
        brandSuccess(userObj){ //调起登录成功
            let params = {
				goUrl: resources.goUrl,
				urlThird: resources.goProductDetail,
				product: this.brandProduct,
				jsonHeader: this.jsonHeader,
				strHeadData: this.strHeadData
            }
            this.userId = userObj && userObj.id ? userObj.id : 0;
			this.globalFunction.productLoginSuccess(userObj, params);
        },
        getbrandurl(product){
            //跳转链接
            let params = {
                goUrl: resources.goUrl,
                urlThird: resources.goProductDetail,
                product: product,
                callLoginName: 'brandSuccess',
                jsonHeader: this.jsonHeader,
                strHeadData: this.strHeadData
            }
            let tip = this.globalFunction.goThirdWithoutUserId(params);
            if(tip == 'needLogin') {
                this.globalFunction.Weaklogin('', 'brandSuccess');
            }
        }
    },
    created() {
        this.userId = parseInt(localStorage.getItem('Userid')) ? localStorage.getItem('Userid') : parseInt(this.jsonHeader['User-Id']);
    },
    mounted() {
        window.brandSuccess = this.brandSuccess;
    }
}
</script>

<style lang="scss" scoped>
@import '~src/styles/var.scss';
.brand-recomendation-box {
    border-top: 1px solid $lightBorder;
    padding: 30 * $rem;
    background-color: $white;

    .product-img {
        width: 132 * $rem;
        height: 132 * $rem;
        border-radius: 12px;
    }

    .brand-info {
        margin-top: 22 * $rem;
        margin-left: 32 * $rem;
        margin-right: 46 * $rem;

        width: 182 * $rem;

        .brand-title {
            font-size: 28 * $rem;
            color: $darkerTextColor;
        }

        .brand-edu {
            font-size: 28 * $rem;
            color: $hitColor;
        }
    }

    .brand-detail {
        position: relative;
        margin-top: 22 * $rem;
        padding-left: 39 * $rem;
        border-left: 1px solid $lightBorder;

        width: 280 * $rem;

        &::after {
            position: absolute;
            content: '';
            top: 31 * $rem;
            right: 0;

            width: 13 * $rem;
            height: 26 * $rem;
            background: url(~src/assets/right-cross.png) no-repeat;
            background-size: 13 * $rem 26 * $rem;
        }

        .brand-limit-time {
            font-size: 28 * $rem;
            color: $lighterTextColor;
            line-height: 44 * $rem;
        }

        .brand-rate {
            font-size: 28 * $rem;
            color: $lighterTextColor;
            line-height: 44 * $rem;
        }
    }
}
</style>
