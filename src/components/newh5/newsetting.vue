<template>
    <div>
        <!-- 返回按钮 -->
        <!-- <Newheader :title="titlename"></Newheader> -->
        <div class="settingOut" @click="loginOut">
            退出登录
        </div>
    </div>
</template>
<script charset="UTF-8">
    import Newheader from 'common/newheader' //顶部导航
    export default {
        components:{
            Newheader
        },
        data() {
            return {
                titlename:document.title,
                strHeadData: '',
                jsonHeader: '',
                userId: '',
            };
        },
        methods: {
            loginOut(){
                    localStorage.clear();
                    window.location.href = "pdlogout://"
            }
        },
       
        created() {
            let headerInfo = this.globalFunction.getHeader(this.jsonHeader, this.$route);
            this.jsonHeader = headerInfo.jsonHeader;
            this.strHeadData = headerInfo.strHeadData;

            
            if(this.jsonHeader['User-Id']   !=  '0' ){  //如果获取url参数不等于0存储userid并赋值给data中的userid否则为默认userid0

                localStorage.setItem("Userid", this.jsonHeader['User-Id']);
            }

        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.mint-msgbox-confirm{
    color: #fb4d3e !important;
}
</style>

<style lang="scss" scoped>
@import '~src/styles/var.scss';
.settingOut{
    margin: 0 auto;
    margin-top: 165*$rem;
    width: 390*$rem;
    height: 75*$rem;
    line-height: 75*$rem;
    color:$white;
    font-size: 32*$rem;
    text-align: center;
    background: #e5e5e5;
    border-radius: 20*$rem;
}

</style>