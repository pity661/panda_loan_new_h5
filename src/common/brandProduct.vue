<template>
    <div class="hot-product-box clear">
        <div class="product-panel fl" v-for="(product, index) in productList" :key="index" @click="getDetail(product)">
            <img class="product-img fl" v-lazy="product.imgUrl" alt="">
            <div class="product-info fl">
				<div class="product-name-box">
					<span class="product-name">
						{{product.title}}
					</span>
					<!-- <span class="relative-name"> -->
						<span class="product-tag hot-tag" data-tip="热门"></span>
					<!-- </span> -->
				</div>
                <p class="product-edu">最高{{product.maxAmount}}元</p>
                <!-- <p class="left-bottom product-term" v-if="product.minTerm == product.maxTerm">期限{{product.maxTerm}}个月</p> -->
                <!-- <p class="left-bottom product-term" v-else>期限{{product.minTerm}}~{{product.maxTerm}}个月</p> -->
                <!-- <span class="product-tag" :class="'tag' + index" v-show="product.tagText">{{product.tagText}}</span> -->
            </div>
        </div>
    </div>
</template>     

<script  charset="UTF-8">
import resources from 'src/resources';

export default {
  	data() {
		return {
			userId: 0,
			currentProduct: {},
			sunJsonHeader: this.strHeadData,
			jsonHeader: JSON.parse(decodeURIComponent(this.strHeadData)),
		};
 	 },
  	props: ["productList", "strHeadData"],
  	methods: {
		//跳转商品详情
		getDetail(product) {
			//跳转链接
			this.currentProduct = product;
			let params = {
				goUrl: resources.goUrl,
				urlThird: resources.goProductDetail,
				product: this.currentProduct,
				jsonHeader: this.jsonHeader,
				strHeadData: this.strHeadData
			}
            
			let tip = this.globalFunction.goThirdWithoutUserId(params);
			if(tip == 'needLogin') {
				this.globalFunction.Weaklogin('', 'brandSuccess');
			}
		},

		//调起登录成功
		brandSuccess(userObj){
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
    	this.userId = parseInt(localStorage.getItem('Userid')) ? parseInt(localStorage.getItem('Userid')) : parseInt(this.jsonHeader['User-Id']);

		window.brandSuccess = this.brandSuccess;
	}
};
</script>

<style lang="scss" scoped>
@import '~src/styles/var.scss';

.hot-product-box {
    margin-bottom: 15*$rem;
    background: $white;
	.product-panel {
		width: 50%;
		padding: 52 * $rem 0rem 40 * $rem 30 * $rem;

		text-align: left;

		&:first-child {
			border-right: 2.1*$rem solid $lightBorder;
		}
	}

	.product-img {
		width: 120 * $rem;
		height: 120 * $rem;
		margin-top: 14 * $rem 0;
		border-radius: 12px;
	}

	.product-info {
		width: 208 * $rem;
		padding-left: 20 * $rem;

		.product-tag {

			position: relative;

			&::after {
				position: absolute;
				content: attr(data-tip);
				left: 8*$rem;
				top: -23 * $rem;

				padding: 0 2px;
				min-width: 50 * $rem;
				height: 26 * $rem;
				overflow: hidden;
				text-align: center;

				font-size: 18 * $rem;
				color: $white;

				border-bottom-right-radius: 6px;
				border-top-right-radius: 6px;
				border-top-left-radius: 4px;
			}

			&.hot-tag {
				&::after {
					background-color: $hitColor;
				}
			}
		}
		.product-name {
			font-size: 28 * $rem;
			color: $darkerTextColor;
			max-width: 145 * $rem;
		}
	}
    .product-name-box{
        padding-top: 19*$rem;
    }
	.product-edu {
        font-family: "微软雅黑";
		font-size: 28 * $rem;
		color: #999;

		height: 46 * $rem;
		line-height: 46 * $rem;
	}
	.product-term {
		font-size: 24 * $rem;
		color: $lighterTextColor;

		height: 30 * $rem;
		line-height: 30 * $rem;
	}
}
</style>
