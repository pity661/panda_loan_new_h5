<template>
    <div class="mask-layer" v-if="mask">
        <div>
            <div class="layer-text">累计贷款人数</div>
            <div class="num-box">
                <span class="num-text">{{dynamicDigital}}</span>
           </div>
        </div>
    </div>
</template>

<script charset="UTF-8">
export default {

  data() {
    return {
        num: 859203,
        mask: true,
        maskoneout: true,
        dynamicDigital: 0
    };
  },
  
  methods: {
    initial(time) { //定时器
        var that = this;
        var timer = setInterval(function(){
            var nowNum = Math.floor(Math.random()*11)+40; //随机生成10-20之间的任意数
            that.num = that.num + nowNum;
        },time)
    },
    oldInitial(start_Date) { //第一次
        var start_Date= new Date(start_Date);
        var sec = (new Date().getTime()-start_Date.getTime())/1000/60/10;
        var nowNum = parseInt(sec);
        var overNum = Math.floor(Math.random()*11)+40; //随机生成10-20之间的任意数
        var overnumnum = nowNum+overNum;
        this.num = this.num + overnumnum;
        this.showNum();
    },

    showNum() { // 动态展示数字
        var startNum = this.dynamicDigital; // 起始数字
        var d = this.num;//跳动到最后的数字
        var s = parseInt(startNum);//起始起始值 一般是 0 或其他
        var time = 1000;  //所用时间 1000毫秒（ 在1秒内 数值增加到d）;
        var outTime = 0;  //所消耗的时间
        var interTime = 30;
        let _this = this;
        var timer = setInterval(function(){
            outTime += interTime;
            if(outTime < time) {
                _this.dynamicDigital = parseInt(d / time * outTime);
            } else {
                _this.dynamicDigital = d;
                clearInterval(timer);
            }
        }, interTime);
    },
  },

  created() {
    this.oldInitial('2018/6/10 00:00');
    if(localStorage.getItem("maskoneout")=="false"){
        this.mask = false;
    }
  },

  mounted(){
    this.initial(1200000); //20分钟执行一次
    this.maskoneout = false;
    localStorage.setItem("maskoneout", this.maskoneout)
    var that = this;
    setTimeout(function(){
        that.mask = false;
    },2000)
    // 初始数值，初始日期，增加数值间隔(ms)
  }
};
</script>

<style lang="scss" scoped>
@import '~src/styles/var.scss';
.mask-layer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:rgba(0, 0, 0, 0.6);
    z-index: 99;
    color: $white;
    text-align: center;
    padding-top: 600*$rem;
    .layer-text {
        display: inline-block;
        color: $white;
        font-size: 40*$rem;
        line-height: 108 * $rem;
    }

    .num-box {
        display: inline-block;
        min-width: 240 * $rem;

        .num-text {
            color: $white;
            margin: 0 auto;
            font-size: 60 * $rem;
            line-height: 108 * $rem;
        }
    }
}
</style>
