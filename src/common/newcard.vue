<template>
	<div class="new-card-box">
        <div class="newcard clear" :class="{'mt': hasEmpty, 'top-border': hasTopBorder}" v-for="(item,index) in cardProductlist" :key="index" @click="gocardurl(item)">
            <div class="newcardimg fl">
                <img class="img" v-lazy="item.imgUrl" alt="">
            </div>
            <div class="newcardtxt fl">
                <div class="newcardname">{{item.title}}</div>
                <div v-for="(tag,index) in item.firstTagArray" :key="`tag-${index}`" class="newcardtag fl">{{tag}}</div>
            </div>
        </div>
	</div>
</template>
<script charset="UTF-8">
import resources from 'src/resources';

export default {
    
  data() {
    return {
        jsonHeader: '',
        strHeadData: '',
        userId: 0,
        currentItem: '',
        properImgSize: parseInt(this.globalFunction.BASESIZE * 5.3) ? parseInt(this.globalFunction.BASESIZE * 5.3) : 100,
    };
  },
  props:['cardProductlist', 'hasEmpty', 'hasTopBorder'],
  methods: {

    cardSuccess(userObj){ //调起登录成功
        let params = {
            goUrl: resources.goUrl,
            urlThird: resources.goProductDetail,
            product: this.currentItem,
            jsonHeader: this.jsonHeader,
            strHeadData: this.strHeadData
        }
        this.userId = userObj && userObj.id ? userObj.id : 0;
        this.globalFunction.productLoginSuccess(userObj, params);
    },

    gocardurl(item){
        item.directJump = true;
        this.currentItem = item;
        //跳转链接
        let params = {
            goUrl: resources.goUrl,
            urlThird: resources.goProductDetail,
            product: item,
            jsonHeader: this.jsonHeader,
            strHeadData: this.strHeadData
        }
        let tip = this.globalFunction.goThirdWithoutUserId(params);
        if(tip == 'needLogin') {
            this.globalFunction.Weaklogin('', 'cardSuccess');
        }
    }
  },
  mounted(){
        let headerInfo = this.globalFunction.getHeader(this.jsonHeader, this.$route);
        this.jsonHeader = headerInfo.jsonHeader;
        this.strHeadData = headerInfo.strHeadData;
        this.userId = parseInt(localStorage.getItem('Userid')) ? localStorage.getItem('Userid') : parseInt(this.jsonHeader['User-Id']);
        window.cardSuccess = this.cardSuccess;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
@import '~src/styles/var.scss';
.newcard{
    padding: 35*$rem 30*$rem;
    width: 100%;
    height: auto;
    border-bottom: 2.1*$rem solid $lightBorder;
    background-color: $white;
    &.mt {
        margin-top: 12 * $rem;
    }

    &.top-border {
        border-top: 2.1*$rem solid $lightBorder;
    }

    .newcardimg{
        margin-right: 30*$rem;
        width: 200*$rem;
        height: 125*$rem;
        .img{
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 5px;
        }
    }
    .newcardtxt{
        width: 415*$rem;
        height: auto;
        overflow: hidden;
        .newcardname{
            width: 100%;
            line-height: 72*$rem;
            font-size: 34*$rem;
            color: $darkerTextColor;
            overflow: hidden;
        }
        .newcardtag{
            border-radius: 2px;
            margin-right: 12*$rem;
            width: 120*$rem;
            height: auto;
            line-height: 35*$rem;
            font-size: 18*$rem;
            color: #ff7297;
            text-align: center;
            border: 2.1*$rem solid #e8dde1;
            background: #ffeff2;
            overflow: hidden;
        }
    }
}

</style>