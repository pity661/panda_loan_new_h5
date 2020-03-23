<template>
	<div id="new404">
        <div class="newimg">
            <img src="~src/assets/new404img.png" alt="" class="newimgicon">
        </div>
        <div class="new404txt">
          抱歉！产品跑丢了，看看其他产品吧~~
        </div>
        <div class="gonewindex" @click="goindex()">返回</div>
	</div>
</template>
<script charset="UTF-8">
export default {

  data() {
    return {

    };
  },
  methods: {
    goindex(){ //跳转到首页
        window.history.back(); //返回上一页
    }
  },
  mounted(){
      document.title = '';
  }
};
</script>

<style lang="scss" scoped>
@import '~src/styles/var.scss';

#new404{
    padding-top:350*$rem; 
    width: 100%;
    height: 100%;
    background: $white;
}
.newimg{
    text-align: center;
    .newimgicon{
        width: 278*$rem;
        height: 214*$rem;
    }
}
.new404txt{
    margin-top: 40*$rem;
    width: 100%;
    height: auto;
    line-height: 50*$rem;
    text-align: center;
    font-size: 28*$rem;
    color: #bfbfbf;
    overflow: hidden;

}
.gonewindex{ //点击回到首页
    margin: 0 auto;
    margin-top:213*$rem;
    margin-bottom: 334*$rem;
    width: 456*$rem;
    height:95*$rem;
    border:1px solid #1e81d2;
    line-height:95*$rem;
    color:#1e81d2;
    text-align:center;
    font-size:30*$rem;
    border-top-left-radius:50*$rem;
    border-top-right-radius:50*$rem;
    border-bottom-right-radius:50*$rem;
    border-bottom-left-radius:50*$rem;

}

</style>