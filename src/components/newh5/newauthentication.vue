<template>
	<div class="authentication-box">
        <!-- 资料认证文字 --> 
        <div class="newrenztxt">
            请您尽快完成认证，以便我们提升您的额度！
        </div>
        <!-- 表单 -->
        <div class="newreninput"> 
            <!-- 姓名 -->
            <div class="newauther">
                <div class="newauthericon">
                    <img class="newautherimg" src="~src/assets/name.png" alt="">
                </div>
                <div class="newauthercenter">
                    <div class="newtitle">姓名</div>
                    <input class="input-el" type="text" placeholder="姓名" v-model="authername" :disabled="disabledInfo">
                </div>
            </div>
            <!-- 身份证 -->
            <div class="newauther">
                <div class="newauthericon" >
                    <img class="newautherimg" src="~src/assets/id.png" alt="">
                </div>
                <div class="newauthercenter" style="border:none;">
                    <div class="newtitle">身份证</div>
                    <input class="input-el" type="text" placeholder="身份证号" v-model="autherid" :disabled="disabledInfo">
                </div>
            </div>
        </div>
        <!-- 提升额度表单 -->
        <div class="tishengedu">
            <div class="newauther" v-for="(item, key) in infoList" :key="key">
                <div class="newauthericon">
                    <img class="newautherimg" :src='item.icon' alt="">
                </div>
                <div class="newauthercenter">
                    <div class="newtitle">{{item.title}}</div>
                    <div :id="item.id"  class="selectstyle"></div>
                </div>
            </div>
        </div>
        <!-- 提交信息 -->
        <button class="newrenzhengbutton" @click="postmaterial()" >
            保存
        </button>
	</div>
</template>
<script charset="UTF-8">
import resources from 'src/resources';
import MobileSelect from 'mobile-select'
import Newheader from 'common/newheader' //顶部导航
let qs = require('qs');

export default {
    components:{
        Newheader
    },
    data() {
        return {
            titlename: document.title,
            disabledInfo: false, //禁止修改名字/身份证号
            authername:'', //输入框姓名
            autherid:'', //身份证号
            selectedParams: {
                "occupation": '', //职业
                "education": '',
                "car": '',
                "house": '',
                "accumulationFund": '',
                "creditCard": '',
                "socialSecurity": '',
                "empPost": '', //职务
                "repayMoneyAmount": '',
                "age": ''
            },
            // 选中的值
            infoList: {
                'occupation': {
                    id: 'occupation',
                    icon: require('src/assets/leixin.png'),
                    title: '职业类型',
                    titleBgColor: '#f0f0f0',
                    ensureBtnColor: '#ee3031',
                    toastTip: '请选择职业类型',
                    options: [{
                        "valuedata":'A',
                        "value":'打工族'
                    },
                    {
                        "valuedata":'B',
                        "value":'自由职业'
                    },
                    {
                        "valuedata":'C',
                        "value":'企业主'
                    },
                    {
                        "valuedata":'D',
                        "value":'个体户'
                    }]
                },
                'education': {
                    id: 'education',
                    icon: require('src/assets/edu.png'),
                    title: '教育程度',
                    titleBgColor: '#f0f0f0',
                    ensureBtnColor: '#ee3031',
                    toastTip: '请选择教育程度',
                    options: [{
                        "valuedata":'F',
                        "value":'初中及以下'
                    },
                    {
                        "valuedata":'E',
                        "value":'高中'
                    },
                    {
                        "valuedata":'D',
                        "value":'大专'
                    },
                    {
                        "valuedata":'A',
                        "value":'本科'
                    },
                    {
                        "valuedata":'B',
                        "value":'硕士'
                    },
                    {
                        "valuedata":'C',
                        "value":'博士'
                    },
                    {
                        "valuedata":'G',
                        "value":'其他'
                    }]
                },
                'house': {
                    id: 'house',
                    icon: require('src/assets/house2.png'),
                    title: '有无房产',
                    titleBgColor: '#f0f0f0',
                    ensureBtnColor: '#ee3031',
                    toastTip: '请选择有无房产',
                    options: [{
                        "valuedata":'A',
                        "value":'自置无按揭'
                    },
                    {
                        "valuedata":'C',
                        "value":'自置按揭'
                    },
                    {
                        "valuedata":'D',
                        "value":'集体宿舍'
                    },
                    {
                        "valuedata":'E',
                        "value":'亲属楼宇'
                    },
                    {
                        "valuedata":'F',
                        "value":'租房'
                    },
                    {
                        "valuedata":'B',
                        "value":'其他'
                    }]
                },
                'creditCard': {
                    id: 'creditCard',
                    icon: require('src/assets/card.png'),
                    title: '信用卡',
                    titleBgColor: '#f0f0f0',
                    ensureBtnColor: '#ee3031',
                    toastTip: '请选择信用卡情况',
                    options: [{
                        "valuedata":'Y',
                        "value":'有'
                    },
                    {
                        "valuedata":'N',
                        "value":'无'
                    }]
                },
            },
            jsonHeader: '',
            userId: 0
        };
    },

    methods: {
        getauther(){ //第一步：获取用户实名认证信息接口
            let _this = this;
            // 如果获取不到设置userid为0
            let params = {
                query:`{
                    client(
                        userId:${_this.userId}
                    ){
                        id
                        userId 
                        name 
                        identityNo
                    }
                }`                
            };

            _this.$axios.post(`${resources.v2GraphQlApi}`, qs.stringify(params),{
            }).then( res=> {
                if(res.data.data.client==null){
                    _this.authenticationStatus = false;   //没有认证状态
                }else{
                    _this.authenticationStatus = true;    //已认证
                    _this.disabledInfo = true; //禁止修改身份证号/姓名
                    _this.authername = res.data.data.client.name;
                    _this.autherid = res.data.data.client.identityNo;
                }
            }).catch( error=> {
            })
        },

        postMoney(time){ // 提交个人信息并获取额度
            let _this = this,
                toastStr = '',
                intervalTime = time > 0 ? time : 0;
            let url = resources.postmaterial();
            _this.selectedParams.userId =  _this.userId;

            // 是否都全部选择
            Object.keys(_this.selectedParams).some(key => {
                if(!_this.selectedParams[key] && _this.infoList[key]) {
                    toastStr = _this.infoList[key].toastTip;
                    return toastStr;
                }
            });

            if(toastStr) {
                setTimeout(() => {
                    _this.globalFunction.customToast(toastStr);
                }, intervalTime);
                return;
            }
                
            _this.$axios.post(url, qs.stringify(_this.selectedParams),{
            }).then( res=> {
                if(res){
                    _this.globalFunction.customToast('成功激活额度');
                    window.history.back(); //返回上一页
                }else{
                    _this.globalFunction.customToast('信息错误请重试', 2000);
                }
            }).catch (error=> {
                this.globalFunction.customToast('信息错误请重试', 2000);
            })
        },

        postmaterial(){ //点击保存按钮
            let toastStr = '';
            if(!this.authenticationStatus){ // 未认证时
                if(this.authername.trim() == ''){
                    toastStr = '姓名不能为空';
                }else if(this.autherid.trim() == ''){
                    toastStr = '身份证号不能为空';
                }
                if(toastStr) {
                    this.globalFunction.customToast(toastStr);
                    return;
                }
                // 调用实名认证接口
                this.postautherapi();
            }
            else{
                this.postMoney(); //调用提升额度方法
            }
        },

        postautherapi(){ // 提交实名接口
            let _this = this;
            let url = resources.clients();
            let params = {
                "userId": _this.userId,
                "name": _this.authername,
                "guarantee": '',
                "idNo": _this.autherid
            };

            // 判断 头信息是否有，并正确，至少保证CONTENT-TYPE是对的
            let contype = _this.jsonHeader['Content-Type'];
            if(contype.indexOf('application/x-www-form-urlencoded') < 0) {
                _this.$axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                _this.jsonHeader['Content-Type'] = 'application/x-www-form-urlencoded';
            }

            _this.$axios.post(url, qs.stringify(params),{
                headers: _this.jsonHeader
            }).then( response=> {
                if(response.status==201){
                    _this.globalFunction.customToast('实名认证成功')
                    _this.disabledInfo = true; //禁止修改名字/身份证号
                    _this.authenticationStatus = true;    //修改认证状态值为已认证
                }else{
                    _this.globalFunction.customToast('已实名认证')
                }
            }).then(res => { // 已认证 后，调用保存个人信息，获取额度
                this.postMoney(1400);
            }).catch (error=> {
                if(error.response.status==401){
                    this.globalFunction.customToast('实名认证失败')
                }else if(error.response.status==500){
                    this.globalFunction.customToast('实名认证失败')
                }
            })
        },

        initInfoList() {
            let _this = this;
            Object.keys(_this.infoList).forEach(key => {
                var occupationselect = new MobileSelect({
                    trigger: `#${key}`,
                    title: _this.infoList[key].title,
                    titleBgColor: _this.infoList[key].titleBgColor,
                    ensureBtnColor: _this.infoList[key].ensureBtnColor,
                    wheels: [{
                        data: _this.infoList[key].options
                    }],
                    callback(indexArr, data){
                        _this.selectedParams[key] = data[0].valuedata;
                    }
                });
            });
        }
    },
    mounted(){

        this.jsonHeader = JSON.parse(decodeURIComponent(this.$route.query.strHeader));
        this.userId = this.jsonHeader['User-Id'];
        this.getauther();

        // 初始化数据信息
        this.initInfoList();
        
    }
}
</script>

<style lang="scss" scoped>
@import '~src/styles/var.scss';
// 提示文字
.newrenztxt{
    padding: 0rem  30*$rem;
    width: 100%;
    height: auto;
    line-height: 70*$rem;
    font-size: 24*$rem;
    color: #ee3031;
    text-align: left;
    background:#f6e3e2;
    overflow: hidden;
}
// 输入框
.newreninput{
    // margin: 12*$rem 0rem;
    border-top: 12*$rem solid $backgroundColor;
    border-bottom: 12*$rem solid $backgroundColor;
    width: 100%;
    height: auto;
    background: $white;
    overflow: hidden;
}
// 选框默认样式
.newauther{
    position: relative;
    width: 100%;
    height: auto;
    line-height: 100*$rem;
    font-size: 30*$rem;
    color: $textColor;
    overflow: hidden;
    .newauthericon{
        float: left;
        width: 85*$rem;
        height: 100*$rem;
        line-height: 100*$rem;
        text-align: center;
        .newautherimg{
            width: 32*$rem;
            height: 32*$rem;
            vertical-align: middle;
        }
    }
    .newauthercenter{
        padding-right: 30*$rem;
        float: left;
        width: 665*$rem;
        height: 100*$rem;
        border-bottom:1*$rem solid $lightBorder;
    }
    .newtitle{
        float: left;
        width: auto;
        height: 100*$rem;
        line-height: 100*$rem;
        font-size: 30*$rem;
        color: $darkTextColor;
        overflow: hidden;
        font-family: "黑体"
    }
    .input-el {
        float: right;
        width: 500*$rem;;
        height:  98*$rem;
        line-height: 100*$rem;
        font-size: 30*$rem;
        color: $darkTextColor;
        text-align: right;
        background: $white;

        &::-webkit-input-placeholder {
            text-align: right;
            color: #d3d3d6;
            font-size: 0.8rem;
            color: rgb(148, 148, 148);
        }
    }
}

// 提升额度最大表单
.tishengedu{
    background: $white;
}
// 组件必配样式
.selectstyle{
    padding-right: 50*$rem;
    float: right;
    height:  98*$rem;
    line-height: 100*$rem;
    font-size: 30*$rem;
    color: $darkTextColor;
    background: $white;
    text-align: right;
     &::after {
            position: absolute;
            content: "";
            top: 47 * $rem;
            right: 30 * $rem;
            width: 26 * $rem;
            height: 14 * $rem;
            background-image: url(~src/assets/down@2x.png);
            background-size: 26 * $rem 14 * $rem;
            background-repeat: no-repeat;
        }
}

// 提交按钮
.newrenzhengbutton{
    display: block;
    margin: 0 auto;
    margin-top: 50*$rem;
    width: 695*$rem;
    height: 95*$rem;
    line-height: 95*$rem;

    color: $white;
    font-size: 32*$rem;
    text-align: center;
    border-radius: 10*$rem;
    background: $btnColor;
}
</style>