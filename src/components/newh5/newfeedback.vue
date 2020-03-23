<template>
    <div class="newfeedback">
        <!-- <Newheader :title="titlename"></Newheader> -->
        <div class="feedback-box">
            <!-- 反馈信息 -->
            <div class="feedbackdata">
                <textarea type="text" placeholder="我们将尽快处理您的反馈意见，客服MM会在24小时内与您联系，感谢支持！" maxlength="100" @input="descInput" v-model="desc" class="feedbacktext"></textarea>
                <span class="feedbackspan">还可输入{{remnant}}字</span>
            </div>
            <!-- 邮箱 -->
            <div class="emailtoast">
                <h1 class="emailh1">您的邮箱或者微信号：</h1>
                <input type="text" placeholder="请输入您的邮箱或者微信号，以便我们给您回复" v-model="emaildata" class="emailinput">
            </div>
            <!-- 提交按钮 -->
                <div class="submitButton" @click="submit">
            提交
            </div>
        </div>
    </div>

</template>

<script charset="UTF-8">
import { Toast } from 'mint-ui';
import resources from "src/resources";
import Newheader from 'common/newheader' //顶部导航
export default {
    components:{
        Newheader
    },
    data() {
        return {
            titlename:document.title,
            remnant: '100',
            desc:'',
            emaildata:'',
            userId:'',
            jsonHeader:''
        };
  },
  methods: {
    descInput(){ //剩余字数
        var txtVal = this.desc.length;
        this.remnant = 100 - txtVal;
    },
    submitdata(){ //提交反馈
        if(this.userId == ''){
            this.userId = '0'
        }
        let url = resources.feedback();
        let qs = require('qs');
        let params = {
            "userId":this.userId,
            "opinion":this.desc,
            "contactWay":this.emaildata
        };
        this.$axios.post(url, qs.stringify(params),{

        }).then( res=> {

            // console.log(res)
            Toast('您的意见已经提交，请耐心等待~');
            // window.history.back(); //返回上一页

        }).catch (error=> {

            Toast('提交错误请重新尝试提交');
            // console.log(error)

        })
    },
    submit(){ //提交
        if(this.desc==''){
            Toast('请输入您的反馈意见');
        }else{
            // if(this.emaildata !=''){
            //     if(/[\u4E00-\u9FA5]/i.test(this.emaildata)){
            //         this.emaildata='';
            //         Toast('请确认您的的联系方式格式');
            //     }else{
            //         this.submitdata()
            //         this.desc='',
            //         this.emaildata=''
            //     }
            // }else{

                this.submitdata()
                this.desc='',
                this.emaildata=''
            
            // }
        }
    },
  },
  mounted(){

    this.jsonHeader = JSON.parse(decodeURIComponent(this.$route.query.strHeader));
    this.userId = parseInt(localStorage.getItem('Userid')) ? localStorage.getItem('Userid') : parseInt(this.jsonHeader['User-Id']);

  }
}
</script>

<style lang="scss" scoped>
@import '~src/styles/var.scss';

.newfeedback{
    min-height: 100%;
    background: $backgroundColor;
}
.feedback-box{

        padding: 25*$rem 30*$rem;
            .feedbackdata{ //反馈信息内容
                position: relative;
                width:100%;
                height: 365*$rem;
                background: $white;
                border-radius:10*$rem; 
                overflow: hidden;
                .feedbacktext{
                    padding: 30*$rem 25*$rem;
                    width: 100%;
                    height:100%;
                    line-height:45*$rem;
                    font-size: 28*$rem;
                }
                .feedbackspan{
                    position: absolute;
                    bottom: 30*$rem;
                    right: 25*$rem;
                    color: #000;
                    font-size: 28*$rem;
                }
            }
    .emailtoast{ //邮箱提示文字和输入内容部分
        margin-top: 50*$rem;
        width:100%;
        height: auto;
        overflow: hidden;
        .emailh1{
            font-size: 28*$rem;
        }
        .emailinput{ 
            padding-left:25*$rem;
            margin-top: 15*$rem;
            width:100%;
            height: 85*$rem;
            background: $white;
            border-radius:10*$rem;
            font-size:24*$rem;
        }
    }
    .submitButton{  // 提交样式
        margin: 0 auto;
        margin-top: 95*$rem;
        width:700*$rem;
        height: 90*$rem;
        line-height: 90*$rem;
        background: $hitColor;
        color: $white;
        font-size: 32*$rem;
        text-align: center;
        border-radius:10*$rem;
    }
}
</style>