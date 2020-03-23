<template>
    <div class="product-box" :class="{'no-top': index == 0, 'simple-theme': theme == 'simple'}" @click="gotoUrl(product)">
        <div class="product-img" >
            <img class="img" v-lazy="product.imgUrl" alt="">
            <p class="product-title">{{product.title}}</p>
        </div>
        <div class="product-detail">
            <p class="product-edu">{{product.minAmount}}~{{product.maxAmount}}元</p>
            <p class="product-term" >{{product.timeLimit}}</p>
            <div class="product-tag-info" v-if="product.firstTagArray && product.firstTagArray.length > 0">
                <span class="tag" >{{product.firstTagArray[0]}}</span>
            </div>
        </div>
        <div class="to-borrow">
            <button class="borrow-btn">立即借钱</button>
        </div>
    </div>
</template>

<script type="text/babel" charset="UTF-8">
import resources from 'src/resources';
import { Toast } from 'mint-ui';

export default {
    data() {
        return {
            jsonHeader: '',
            userId:0
        };
    },

    props: ["product", "index", "strHeadData", "theme"],

    methods: {
        
        gotoUrl(product) {
            //跳转链接
            let params = {
                goUrl: resources.goUrl,
                urlThird: resources.goProductDetail,
                product: product,
                callLoginName: 'productItemsuccess',
                jsonHeader: this.jsonHeader,
                strHeadData: this.strHeadData
            }
            let tip = this.globalFunction.goThirdWithoutUserId(params);
            if(tip == 'needLogin') {
                this.globalFunction.Weaklogin('', 'productItemsuccess');
            }
        },
        productItemsuccess(userObj){ //调起登录成功
            let params = {
                goUrl: resources.goUrl,
                urlThird: resources.goProductDetail,
                product: this.product,
                jsonHeader: this.jsonHeader,
                strHeadData: this.strHeadData
            }
            this.userId = userObj && userObj.id ? userObj.id : 0;
            this.globalFunction.productLoginSuccess(userObj, params);
        }
    },
    created() {
        this.jsonHeader = JSON.parse(decodeURIComponent(this.strHeadData));      
        this.userId = parseInt(localStorage.getItem('Userid')) ? localStorage.getItem('Userid') : parseInt(this.jsonHeader['User-Id']);
        this.product.firstTagArray = this.product.firstTagArray && this.product.firstTagArray[0] ? this.product.firstTagArray : [];
        if(this.product.minTerm == this.product.maxTerm) {
            this.product.timeLimit = `期限${this.product.maxTerm}个月`;
        }else {
            this.product.timeLimit = `期限${this.product.minTerm}~${this.product.maxTerm}个月`;
        }
    },
    mounted() {
        window.productItemsuccess = this.productItemsuccess;   
    }
};
</script>

<style lang="scss" scoped>
@import '~src/styles/var.scss';

.product-box {
    display: flex;
    flex-direction: row;
    align-content: flex-end;
    align-items: center;

    width: 100%;
    height: 192 * $rem;
    border-bottom: 2.1*$rem solid $lightBorder;
    background-color: $white;

    &.no-top {
        border-top: none;
    }

    &.simple-theme {
        .to-borrow {
            .borrow-btn {
                background-color: $themeSimpleColor;
            }
        }
        
    }
    .product-img {
        margin-right: 10*$rem;
        width: 140*$rem;
        height: 122 * $rem;
        text-align: center;
        overflow: hidden;

        .img {
            width: 80*$rem;
            height: 80*$rem;
            border-radius: 8px;
        }

        .product-title {
            width: auto;
            height: 42 * $rem;
            padding: 0 4* $rem;
            line-height: 42 * $rem;
            font-size: 22 * $rem;
            color: $darkerTextColor;
        }
    }

    .product-detail {
        width: 324 * $rem;
        height: 124 * $rem;
        padding: 0 16 * $rem;

        .product-edu {
            font-size: 40*$rem;
            height: 40 * $rem;
            line-height: 40 * $rem;
            color: $darkerTextColor;
            font-family: 'PingFangSC-Medium';
        }

        .product-term {
            font-size: 24 * $rem;
            height: 44 * $rem;
            line-height: 44 * $rem;

            color: $lighterTextColor;
        }

        .product-tag-info {
            line-height: 34 * $rem;
            font-size: 20 * $rem;
            text-align: left;
            .tag {
                display: inline-block;
                max-width: 274 * $rem;
                margin: 0;
                padding: 0 10*$rem;

                font-size: 20 * $rem;
                color: #fe7d9b;

                border-radius: 5 * $rem;
                border: 2.1*$rem solid #f0dbe2;
                background:#ffeef2;

                white-space: nowrap;
                overflow: hidden;
            }
        }
    }

    .to-borrow {
        position: relative;
        width: 284 * $rem;
        height: 80 * $rem;
        padding: 0 30 * $rem;

        &::before {
            position: absolute;
            content: '';
            width: 2.1 * $rem;
            height: 120 * $rem;
            background-color: $lightBorder;

            left: 0;
            top: -20 * $rem;
        }

        .borrow-btn {
            width: 224 * $rem;
            height: 80 * $rem;
            line-height: 80 * $rem;

            font-size: 28 * $rem;
            color: $white;

            border-radius: 4px;
            background-color: $themeColor;
        }
    }
}
</style>
