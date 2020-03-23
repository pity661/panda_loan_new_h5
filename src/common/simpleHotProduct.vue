<template>
    <div class="little-half-product" :class="{'simple-theme': theme == 'simple'}">
        <div class="box-div" v-for="(product, index) in productList" :key="index">
            <div class="product-list-box" @click="goProductOrThird(product)">
                <img class="img" v-lazy="product.imgUrl" alt="">
                <div class="product-info">
                    <p class="product-title">
                        <span class="title-line">{{product.title}}</span>
                        <span class="tag-line" v-show="product.tagText" :data-tip="product.tagText"></span>
                    </p>
                    <p class="product-amount">最高{{product.maxAmount}}元</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import resources from 'src/resources';

export default {
    props: ['productList','strHeadData', 'theme'],
    data() {
        return {
            currentProduct: {},
            jsonHeader: {},

            userId: 0

        };
    },
    methods: {
        // 跳转之前，检查是否登录
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
				this.globalFunction.Weaklogin('', 'simpleProductSuccess');
			}
        },

        simpleProductSuccess(userObj) {
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
    },

    created() {
        this.jsonHeader = JSON.parse(decodeURIComponent(this.strHeadData));      
        this.userId = parseInt(localStorage.getItem('Userid')) ? localStorage.getItem('Userid') : parseInt(this.jsonHeader['User-Id']);
    },

    mounted() {
        window.simpleProductSuccess = this.simpleProductSuccess;
    }
}
</script>

<style lang="scss" scoped>
@import '~src/styles/var.scss';

.little-half-product {
    padding: 20 * $rem;
    background-color: $white;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .box-div {
        &:nth-of-type(even) {
            .product-list-box {
                .tag-line {
                    &::after {
                        background-color: $tagSecondColor;
                    }
                }
            }
        }
    }

    &.simple-theme {
        .product-list-box {
            .img {
                border: 4 * $rem solid $white;
                box-shadow: 0 0 6px #eee;
                -webkit-box-shadow: 0 0 6px #eee;
            }
        }
    }

    .product-list-box {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;

        margin: 10 * $rem;
        width: 335 * $rem;
        height: 124 * $rem;
        border-radius: 4px;
        background-color: #fafafa;

        .img {
            display: block;
            margin-left: 16 * $rem;
            width: 72 * $rem;
            height: 72 * $rem;

            border-radius: 50%;
        }

        .product-info {
            margin-left: 24 * $rem;
            font-size: $middleFontSize;
            color: $darkerTextColor;

            .product-amount {
                color: $hitColor;
            }

            .title-line {
                width: 160 * $rem;
                white-space: nowrap;
                word-wrap: keep-all;
                overflow: hidden;
            }

            .tag-line {
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
                    color: $white;
                    white-space: nowrap;
                    border-bottom-right-radius: 6px;
                    border-top-right-radius: 6px;
                    border-top-left-radius: 4px;
                    background-color: $hitColor;
                }
            }
        }
    }
}
</style>
