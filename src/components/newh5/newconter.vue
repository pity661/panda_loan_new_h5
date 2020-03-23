<template>
    <div class="conter-box" :style="{'height': wrapperHeight + 'px'}">
        <div class="profile-head">
            <div class="profile-img">
                <img class="img" src="~src/assets/profileimg.png" alt="">
            </div>
            <p class="procenom-phone">{{phone}}</p>
            <div class="profile-name">
                <span v-if="name" class="profile_namedata">{{name}}</span>
                <span class="isCertifiedstyle" @click="gonewauther">{{isCertified}}</span>
            </div>
        </div>
        <!-- 多个表格 -->
        <div class="profile-tables">
            <div class="profile-tabs"  @click="gohelp()">
                <div class="profile-icons">
                    <img class="img" src="~src/assets/newhelp1416.png" alt="">
                </div>
                <div class="profile-tabmenu">
                    <div class="profileicon-texs">
                        常见问题
                    </div>
                    <div class="profileicons-right">
                        <img src="~src/assets/localtions.png" alt="" class="profileicons-right-img">
                    </div>
                </div>
            </div>
            <div class="profile-tabs"  @click="goxiaoxi()">
                <div class="profile-icons">
                    <img class="img" src="~src/assets/backxin1417.png" alt="">
                </div>
                <div class="profile-tabmenu">
                    <div class="profileicon-texs">
                        联系我们
                    </div>
                    <div class="profileicons-right">
                        <img src="~src/assets/localtions.png" alt="" class="profileicons-right-img">
                    </div>
                </div>
            </div>
            <div class="profile-tabs"  @click="goSetting()" >
                <div class="profile-icons">
                    <img class="img" src="~src/assets/newsetting0724.png" alt="">
                </div>
                <div class="profile-tabmenu" style="border:none;">
                    <div class="profileicon-texs">
                        设置
                    </div>
                    <div class="profileicons-right">
                        <img src="~src/assets/localtions.png" alt="" class="profileicons-right-img">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script charset="UTF-8">
import resources from "../../resources";
import { Toast } from 'mint-ui';

let qs = require('qs');
export default {
    name:'msconter',
    data() {
        return {
            phone:'',
            name:'',
            versionCode:'',
            isCertified:'未认证',
            pageName: 'newconter',
            defaultTitle: '我',
            wrapperHeight: 0,
            jsonHeader: '',
            userId: 0
        };
    },

    watch:{
        userId(newuserid,olduserid){
            if(olduserid != newuserid){
                if(localStorage.getItem('Userid')){
                    this.userId = parseInt(localStorage.getItem('Userid'));
                    this.getclient();
                }
            }
        }
    },
    methods: {
        gonewauther(){ //如果未认证跳转到认证页面
            if(this.name == ''){
                window.location.href = `${resources.goUrl}/newauthentication?strHeader=${this.strHeadData}` //跳转常见问题页面
            }
        },

        //个人中心登录回调函数
        newContercallback(userObj){
            if(userObj && userObj.id){
                this.userId = userObj.id;
                this.phone = userObj.username;
                localStorage.setItem("Userid",userObj.id);
                localStorage.setItem("userPhone",userObj.username);

            } else {
                Toast('用户信息错误，请重试');
                return;
            }
        },

        getclient() { //获取认证状态
            let _this = this;
            let params = {
                 query : `{client(
                                    userId: ${_this.userId}
                                    ){ 
                                        id
                                        userId
                                        name
                                    }}`};

            _this.$axios.post(`${resources.v2GraphQlApi}`,  qs.stringify(params),
                {}
            ).then(res => {
                if(!res.data.data.client){
                    _this.isCertified='未认证'
                    return;
                }else{
                    _this.isCertified='已认证'
                }
                _this.name = res.data.data.client.name
            });
        },
        gohelp(){ //常见问题
            window.location.href = `${resources.goUrl}/newhelp?strHeader=${this.strHeadData}` //跳转常见问题页面
        },
        goSetting(){
            window.location.href = `${resources.goUrl}/newsetting?strHeader=${this.strHeadData}` //跳转常见问题页面
        },
        goxiaoxi(){
            window.location.href = `${resources.goUrl}/newfeedback?strHeader=${this.strHeadData}` //跳转常见问题页面
        }
    },
    created() {
        window.newContercallback = this.newContercallback; //回调
        let headerInfo = this.globalFunction.getHeader(this.jsonHeader, this.$route);
        this.jsonHeader = headerInfo.jsonHeader;
        this.strHeadData = headerInfo.strHeadData;
        this.userId = parseInt(localStorage.getItem('Userid')) ? localStorage.getItem('Userid') : parseInt(this.jsonHeader['User-Id']);
        if(!this.userId){ //如果个人中心页面没有userid继续调用登录
            var parameterData =  { //定义传入参数
                goBackUrl: window.location.href, //当前url
                isShowClose: '1', //强登弱登
                isOnLoadPop: '1' //一级二级调起登录
            }
            this.globalFunction.Weaklogin(parameterData,'newContercallback');
        }
        let phone = localStorage.getItem('userPhone');
        if(phone) {
            this.phone = phone;
        }

        this.getclient();
        // tabbar高度问题
        let _this = this;
        let height = _this.globalFunction.BASESIZE * 2.5;
        setTimeout(() => {

            if( this.globalFunction.showtab(this.jsonHeader) == 'false'){
                _this.wrapperHeight = document.documentElement.clientHeight;
            }else{
                _this.wrapperHeight = (document.documentElement.clientHeight) - height;
            }
        }, 10);

    },
    mounted(){

    }
}
</script>

<style lang="scss" scoped>
@import '~src/styles/var.scss';

.conter-box {
    width: 100%;
    min-height: 1334*$rem;
    background: $backgroundColor;

    // 个人信息
    .profile-head{
        padding-bottom: 80*$rem;
        width: 100%;
        height:auto;
        background:url('~src/assets/newconterbackground0724.png');
        background-size:100% 100%; 
        overflow: hidden;

        .profile-title{
            width: 100%;
            height: 88*$rem;
            line-height: 88*$rem;
            text-align: center;
            font-size: 30*$rem;
            color: $white;
        }
        .profile-img{
            margin: 15*$rem 0rem 18*$rem 0rem;
            text-align: center;

            .img{
                width: 138*$rem;
                height: 138 * $rem;
                border-radius: 50%;
                border: 6 * $rem solid $white;
            }
        }

        .procenom-phone{
            text-align: center;
            font-size: 32*$rem;
            color: $white !important;
            overflow: hidden;
        }
        .profile-name{
            margin-top: 15*$rem;
            width: 100%;
            height: auto;
            text-align: center;

            .profile_namedata {
                position: relative;
                top: 1px;
                margin-right: 10*$rem;

                width: auto;
                // height: 30*$rem;
                line-height: 30*$rem;
                font-size: 30*$rem;

                color: $white;
            }
            .isCertifiedstyle {
                padding: 6*$rem 10 * $rem;
                border-radius: 4px;
                font-size: 18*$rem;
                line-height: 30px;
                color: $themeColor;
                background: $white;
            }
        }
    }
    // 设置、关于我们表格
    .profile-tables{
        // margin-top: 15*$rem;
        width: 100%;
        height: auto;
        background: $white;
        overflow: hidden;

        .profile-tabs{
            padding-left:25*$rem;
            width: 100%;
            height: 105*$rem;
            background: $white;
        }

        .profile-icons{
            float: left;
            width: 40*$rem;
            height: 105*$rem;
            line-height: 105*$rem;
            .img{
                width: 100%;
                vertical-align: middle;
            }
        }

        .profile-tabmenu{ //菜单下载
            float: right;
            padding-right: 25*$rem;
            width: 665*$rem;
            height: 105*$rem;
            border-bottom: 2.1*$rem solid $lightBorder;
            overflow: hidden;

            .profileicon-texs{
                float: left;
                width: 520*$rem;
                height: 105*$rem;
                line-height: 105*$rem;
                font-size: 28*$rem;
                color:#696969;
            }
            .profileicons-right{
                float: right;
                width: 20*$rem;
                height: 105*$rem;
                line-height: 105*$rem;
                
            }
        }

        .profileicons-right-img{
            width: 100%;
            vertical-align: middle;
        }
    }
}

</style>