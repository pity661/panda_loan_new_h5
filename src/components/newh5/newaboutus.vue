<template>
	<div class="about-us-box">
        <!-- 返回按钮 -->
        <div class="appback" @click="$router.go(-1)">
            <img src="~@/assets/iframaBack.png" class="appbackimg">
        </div>
        <div class="companyDiv">
            <div class="companyCount">
                <div class="companyLogo"> <!--logo文字-->
                    <img src="~@/assets/qjjguanjialogo.jpg" alt="" class="companyLogoimg">
                    <div class="companyName">
                        <!-- <p class="companyNamep">123</p> -->
                    </div>
                       
                </div>
                <div class="companyIntroduction"> <!--公司介绍-->
                    <p class="companyIntroductionp"></p> <br/>
                </div>
            </div>
            <div class="companyFoot"> <!--底部-->
                <div class="companyaddress"> <!--公司版权-->
                    <p class="companyaddressp">{{name}}</p>
                    <span class="companyaddresspan">v1.0.2</span>
                </div>
            </div>
        </div> 
	</div>
</template>
<script charset="UTF-8">
import resources from "../../resources";
import qs from 'qs'
export default {

  data() {
    return {
        packageName:this.$route.query.packageName,
        name:'',
    };
  },
  methods: {
   getPackagename(){ //获取参数
        if(this.packageName==undefined){
            this.packageName = localStorage.getItem('packageName')
        }
        let url = resources.jsonParameter();
        let params = { 
            'packageName': this.packageName,
        };
        this.$ajax.post(url,qs.stringify(params)).then( res => {
            var jsonParameter = JSON.parse(res.data.jsonParameter); //由JSON字符串转换为JSON对象
            this.name = jsonParameter.name
            this.logo = jsonParameter.logo
            this.slogan = jsonParameter.slogan
        })
        localStorage.setItem("packageName",this.packageName)
    }, 
  },
  mounted(){
    // this.getPackagename()
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
@import '~src/styles/var.scss';

.about-us-box {
    .appback{
        position:fixed;
        width:150*$rem;
        height:150*$rem;
        z-index: 99;
        text-align: center;
        .appbackimg{
            margin-top: 35*$rem;
            width:80*$rem;
            height:80*$rem;
        }
    } 

    .companyFoot{
        padding: 1rem 0;
    }

    .companyDiv{
        width: 100%;
        height: auto;
    }

    .companyCount{
        width: 100%;
        overflow: hidden;
    }

    .companyLogo{
        margin-top: 150*$rem;
        width: 100%;
        height: auto;
        overflow: hidden;
        text-align: center;

        .companyLogoimg {
            width: 160*$rem;
        }
    }

    .companyName{
        width: 100%;
        height: auto;
        line-height: 70*$rem;
        font-size: 26*$rem;
        color:$darkTextColor;
        text-align: center;
        font-family:微软雅黑,Arial, Helvetica, sans-serif;
        overflow: hidden;
        .companyNamep{
            margin-top: 30*$rem;
            color:#000 !important;
            font-size: 34*$rem !important;
            text-align: center;
        }
    }

    .companyLogo p{
        font-size: 24*$rem;
        color:$textColor;
    }

    .companyIntroduction{ 
        margin-top: 450*$rem;
        padding:0 33*$rem;
        width:100%;
        height: auto;
        overflow: hidden;
        font-size: 28*$rem;
        line-height: 45*$rem;
        color:$darkTextColor;
        text-align: center;
        companyIntroductionp{
            font-size: 40*$rem;
        }
    }

    .companyaddress{
        width:100%;
        height: auto;
        line-height: 45*$rem;
        text-align: center;
        overflow: hidden;
        .companyaddressp{
            font-size: 32*$rem;
        }
        .companyaddresspan{
            color:$lighterTextColor;
            font-size: 30*$rem;
        }
    }
}
</style>