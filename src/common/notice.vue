<template>
  <div>
    <div class="newbanner-roll">
        <div class="newbannerimg">
            <img src="~src/assets/bannernewimg.png" alt="">
        </div>
        <div v-for="(item,index) in bannernewlist" ref="rollul" :class="{anim:animate==true}" :key="index">
           {{item.description }}
        </div>
    </div>
  </div>
</template>

<script charset="UTF-8">

// bannernew请求
export default {

  data() {
    return {
            animate:true
      }
    },
    props: ['bannernewlist'],
    methods: {
        scroll(){
            let con1 = this.$refs.rollul;
            if(!con1 || con1.length < 1) {
                return;
            }
            con1[0].style.marginTop='30px';
            this.animate=!this.animate;
            var that = this; // 在异步函数中会出现this的偏移问题，此处一定要先保存好this的指向
            setTimeout(function(){
                that.bannernewlist.push(that.bannernewlist[0]);
                that.bannernewlist.shift();
                con1[0].style.marginTop='0px';
                that.animate=!that.animate;  // 这个地方如果不把animate 取反会出现消息回滚的现象，此时把ul 元素的过渡属性取消掉就可以完美实现无缝滚动的效果了
            },0)
        }
    },
    created () {
        setInterval(this.scroll,2000);
    }
}
</script>

<style  lang="scss" scoped="scoped">
@import '~src/styles/var.scss';
.newbanner-roll {
    margin-bottom:0.3rem; 
    padding: 0rem 30*$rem;
    width: 100%;
    height: 70*$rem;
    line-height: 70*$rem;
    transition: all 0.5s;
    font-size: 24*$rem;
    color: $lighterTextColor;
    background: $white;
    overflow: hidden;
    .newbannerimg{
        float: left;
        margin-right: 24*$rem;
        width: auto;
        height: 70*$rem;
        line-height: 65*$rem;
        overflow: hidden;
        img{
            width: 36*$rem;
            height: 30*$rem;
            vertical-align: middle;
        }
    }
}
.anim{
  transition: all 1s;
}
</style>
