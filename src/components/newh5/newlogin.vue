<template>
    <div class="newlogin">
        <!-- logo -->
        <div class="newlogo">
            <!-- <img src="~src/assets/qjjguanjialogo.jpg" alt=""> -->
            <img src="http://olpic.tgbusdata.cn/uploads/allimg/130826/152-130R6155H2-52.jpg" alt="">
        </div>
        <!-- phone -->
        <div class="newphoneinput"> 
            <div class="newphoneinputimg">
            <img src="~src/assets/loginicon.png" alt="">
            </div>
            <input type="number" class="pnone-input" placeholder="请输入手机号码" v-model="phone"/>
        </div>
        <!-- password -->
        <div class="newpasswordinput"> 
            <div class="newpasswordinputimg">
            <img src="~src/assets/duanxinicon.png" alt="">
            </div>
            <input type="number" class="password-input" placeholder="请填写短信验证码" v-model="smsCode"/>
            <div class="password-button" v-bind:class="{passwordClick:is_show}" :value="count+codeButtonText"  @click="getCode()">{{overtime+count+codeButtonText}}</div>
        </div>
        <!-- imgcode -->
        <div class="newimgcode" v-if="picCode"> 
            <div class="newimgcodeimg">
                <img src="~src/assets/imgcode.png" alt="">
            </div>
            <input type="number" class="newimgcode-input" placeholder="请填写验证码" v-model="imaCode"/>
            <div class="imgcode"> 
                <span></span>
                <img :src="imageCode" alt="" class="newgetcodeimg" @click="getImageCode">
            </div>
        </div>
        <!-- login -->
        <div class="newloginbutton"  @click="comfirm()">
            登录
        </div> 
        <!-- newcopy -->
        <div class="newcopy">
            <span class="newcopy-left">点击立即借款既表示同意</span>
            <span class="newcopy-right" @click="agreement()">《平台服务协议》</span>
        </div>
    </div>
</template>

<script charset="UTF-8">
    import resources from "src/resources";
    import { Toast } from 'mint-ui';

    export default {
        data() {
            return {
                picCode: false, //是否显示图形验证码
                is_show: false, //显示获取验证码
                is_click: false, //倒计时
                codeButtonText: '获取验证码',
                show: true,
                overtime:false,
                count: '',
                timer: null,
                flagNum: 0,
                imageCode: '',
                Sid: '0',
                phone: '',
                smsCode: '',
                imaCode: '',
                keySMSCapt: '',
                keyImage:'',
                Uid: this.$route.params.Uid,
                overtime:''
            };
        },
        methods: {
            agreement(){ //跳转协议
                this.$router.push({ path: '/newareement'  })
            },
            toProduct(){ //跳转产品列表页面
                this.$router.push({ path: '/newindex' })
            },
            getCode(){
                //倒计时的时候不能点按钮
                // this.toast('222')
                if (this.is_show) {return;}
                //如果输入的手机号不符合格式直接返回，不走下面的逻辑
                if (!(/^1\d{10}$/.test(this.phone))){ 
                    Toast('手机号格式不符');
                    return ;
                }
                //获取验证码
                this.smsCaptcha();
                //倒计时开始
                this.is_show = true;
                this.is_click = true;
                this.codeButtonText = "S";
                this.overtime = '剩余';
                const TIME_COUNT = 60;
                if (!this.timer) {
                    this.count = TIME_COUNT;
                    this.show = false;
                    this.timer = setInterval(() => {
                        if (this.count > 0 && this.count <= TIME_COUNT) {
                            this.count--;
                        } else {
                            this.show = true;
                            clearInterval(this.timer);
                            this.timer = null;
                            this.count = '';
                            this.codeButtonText = '获取验证码';
                            this.is_show = false;
                            this.overtime = '';
                        }
                    }, 1000)
                }
            },
            smsCaptcha(){ //表单手机号正确时调用返回验证码
                let url = resources.smsCaptcha();
                let params = {
                    'phone': this.phone
                }
                var qs = require('qs');
                this.$axios.post(url, qs.stringify(params),{
                    headers: {
                        'H5-Web-Name': 'moneysteward',
                        'Landing-Channel-Uid': this.Uid,
                        'Sid': this.Sid,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(res => {
                    this.keySMSCapt = res.data.obj1.keySMSCapt;
                })
            },
            comfirm(){
                if (!this.is_click) {
                    return ;
                }
                if (this.phone == '') {
                    Toast('手机号不能为空');
                    return ;
                } else if (this.smsCode == ''){
                    Toast('短信验证码不能为空');
                    return ;
                }
                if (this.flagNum < 4) {
                    this.postMes();
                    this.flagNum ++;
                } else {
                    if (this.imaCode == '') {
                        Toast('图片验证码不能为空');
                        return ;
                    }
                    this.postMes();
                }
            },
            postMes(){  //登录
                let url = resources.token();
                let params = { }
                if (this.keyImage != '') {
                    params = {
                        'username': this.phone,
                        'keySMSCapt': this.keySMSCapt,
                        'smsCapt': this.smsCode,
                        'keyImageCapt': this.keyImage,
                        'imageCapt': this.imaCode
                    }
                } else {
                    params = {
                        'username': this.phone,
                        'keySMSCapt': this.keySMSCapt,
                        'smsCapt': this.smsCode
                    }
                }
                var qs = require('qs');
                this.$axios.post(url, qs.stringify(params), {
                    headers: {
                        'H5-Web-Name': 'moneysteward',
                        'Landing-Channel-Uid': this.Uid,
                        'Sid': this.Sid,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                }).then(res => {
                    this.toProduct()
                    localStorage.setItem("Uid",this.Uid)
                    localStorage.setItem("userId",res.data.obj1.id)
                    localStorage.setItem("phone",this.phone)
                }).catch(error => {
                    Toast(error.response.data.statusMsg);
                    if (error.response.data.statusMsg === '短信验证码不正确') {
                        this.smsCode = '';
                    }
                    if (this.flagNum > 2) {
                        this.imaCode = '';
                        this.getImageCode()
                    }
                });
            },
            enterMes(){
                let url = resources.landingPage();
                var qs = require('qs');
                let params = { }
                this.$axios.post(url,qs.stringify(params),{
                    headers: {
                        'H5-Web-Name': 'moneysteward',
                        'Landing-Channel-Uid': this.Uid,
                        'Sid': this.Sid,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                }).then(res => {
                })
            },
            getImageCode(){ //获取验证码
                let url = resources.imageCode();
                var qs = require('qs');
                let params = { };
                this.$axios.post(url, qs.stringify(params), {
                    headers: {
                        'H5-Web-Name': 'moneysteward',
                        'Landing-Channel-Uid': this.Uid,
                        'Sid': this.Sid,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    responseType: 'arraybuffer'
                }).then(res => {
                    this.keyImage = res.headers.keyimagecapt
                    return 'data:image/jpeg;base64,' + btoa(
                    new Uint8Array(res.data)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                    );
                }).then(data => {
                    this.imageCode = data;
                    this.picCode = true;
                });
            },
            createSid(){  //生成用户操作唯一标识
                this.Sid = this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+(new Date()).valueOf().toString(16);
            },
            S4() {     //生成一个4位16进制字符串
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);  
            }
        },
        mounted(){
            this.createSid();
            this.enterMes();
        },
        created(){
            // if(localStorage.getItem("userId")==null){

            // }else{
            //     this.$router.push({ path: '/newindex' })
            // }
        }
    };

</script>

<style lang="scss" scoped>
@import '~src/styles/var.scss';
    .newlogin{ //最外层
        .newlogo{ // logo
            margin: 258*$rem 0rem 75*$rem 0rem;
            text-align: center;
            img{
                width: 145*$rem;
            }
        }
        .newphoneinput{ //手机号
            margin:0 auto;
            margin-bottom: 40*$rem;
            width: 565*$rem;
            height: 85*$rem;
            line-height:85*$rem;
            background: #f9f9f9;
            border-top-left-radius:50*$rem;
            border-top-right-radius:50*$rem;
            border-bottom-right-radius:50*$rem;
            border-bottom-left-radius:50*$rem;
            .newphoneinputimg{
                float: left;
                margin-left: 35*$rem;
                margin-right: 20*$rem;
                width: 30*$rem;
                height: 85*$rem;
                line-height:85*$rem;
                img{
                    vertical-align: middle;
                    width:30*$rem;
                }
            }
            input{
                float: left;
                width: 400*$rem;
                height: 85*$rem;
                line-height:85*$rem;
                font-size: 26*$rem;
                background: #f9f9f9;
                color:#b2b2b2;
            }
            input::-webkit-input-placeholder{
                text-align: left;
                color: #b2b2b2;
                font-size: 26*$rem;
                color:rgb(148,148,148);
            }
        }
        .newpasswordinput{ //密码
            margin:0 auto;
            width: 565*$rem;
            height: 85*$rem;
            line-height:85*$rem;
            background: #f9f9f9;
            border-top-left-radius:50*$rem;
            border-top-right-radius:50*$rem;
            border-bottom-right-radius:50*$rem;
            border-bottom-left-radius:50*$rem;
            .newpasswordinputimg{
                float: left;
                margin-left: 35*$rem;
                margin-right: 20*$rem;
                width: 30*$rem;
                height: 85*$rem;
                line-height:85*$rem;
                img{
                    vertical-align: middle;
                    width:30*$rem;
                }
            }
            input{
                float: left;
                width: 250*$rem;
                height: 85*$rem;
                line-height:85*$rem;
                font-size: 26*$rem;
                background: #f9f9f9;
                color:#b2b2b2;
            }
            input::-webkit-input-placeholder{
                text-align: left;
                color: #b2b2b2;
                font-size: 26*$rem;
                color:rgb(148,148,148);
            }
            .password-button{
                margin-top:30*$rem;
                float:right;
                padding-left:15*$rem;
                margin-right:35*$rem;
                width: 150*$rem;
                height:27*$rem;
                line-height:27*$rem;
                border-left:1px solid $hitColor;
                font-size:25*$rem;
                color: $hitColor;
                text-align:center;
                overflow:hidden;
            }
        }
        .newimgcode{//图片验证码
            margin:0 auto;
            margin-top:40*$rem;
            width: 565*$rem;
            height: 85*$rem;
            line-height:85*$rem;
            background: #f9f9f9;
            border-top-left-radius:50*$rem;
            border-top-right-radius:50*$rem;
            border-bottom-right-radius:50*$rem;
            border-bottom-left-radius:50*$rem;
            .newimgcodeimg{
                float: left;
                margin-left: 35*$rem;
                margin-right: 20*$rem;
                width: 30*$rem;
                height: 85*$rem;
                line-height:85*$rem;
                img{
                    vertical-align: middle;
                    width:30*$rem;
                }
            }
            .newimgcode-input{
                float: left;
                width: 250*$rem;
                height: 85*$rem;
                line-height:85*$rem;
                font-size: 26*$rem;
                background: #f9f9f9;
                color:#b2b2b2;
                .newimgcode-input::-webkit-input-placeholder{
                    text-align: left;
                    color: #b2b2b2;
                    font-size: 26*$rem;
                    color:rgb(148,148,148);
                }
            }
            .newimgcode-code{
                margin-top:30*$rem;
                float:right;
                padding-left:15*$rem;
                margin-right:35*$rem;
                width: 1*$rem;
                height:25*$rem;
                line-height:25*$rem;
                border-left:1px solid $hitColor;
                font-size:25*$rem;
                color: $hitColor;
                text-align:center;
                overflow:hidden;
            }
            .imgcode{
                width:150*$rem;
                margin-right:35*$rem;
                float:right;
                span{
                    margin-top:30*$rem;
                    margin-right:15*$rem;
                    float:left;
                    width: 2.1*$rem;
                    height:27*$rem;
                    line-height:25*$rem;
                    border-left:2.1*$rem  solid $hitColor;
                }
                img{
                    margin-top:20*$rem;
                    float:right;
                    display:block;
                    width: 120*$rem;
                    height:50*$rem;
                }
            }
        }
        .newloginbutton{ //login
            margin: 0 auto;
            margin-top:50*$rem;
            width: 565*$rem;
            height:80*$rem;
            background: $hitColor;
            line-height:80*$rem;
            color:$white;
            text-align:center;
            font-size:30*$rem;
            border-top-left-radius:50*$rem;
            border-top-right-radius:50*$rem;
            border-bottom-right-radius:50*$rem;
            border-bottom-left-radius:50*$rem;
        }
        .newcopy{ //注册协议
            margin: 0 auto;
            width: 565*$rem;
            height: auto;
            margin-top:24*$rem;
            text-align: center;
            overflow: hidden;
            .newcopy-left{
                color: $textColor;
                font-size: 22*$rem;
            }
            .newcopy-right{
                color: #e24637;
                font-size: 22*$rem;
            }
        }
    }
</style>
