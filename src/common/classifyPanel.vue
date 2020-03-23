<template>
    <div class="classify-box clear">
        <div class="classify-panel"  v-for="(item, index) in classifyList" :key="index"  @click="toClassification(item,index)" :class="{ 'two-panel': classifyList.length === 2, 'gt-four-panel': classifyList.length > 3}">
            <img class="icon" v-lazy="item.iconUrl" alt="">
            <p class="classify-title">{{item.title}}</p>
        </div>
    </div>
</template>

<script charset="UTF-8">
import resources from "src/resources";
export default {
  data() {
    return {
        Uid: this.$route.params.Uid,
        sunJsonHeader: this.strHeadData
    };
  },
  props: ["classifyList", "strHeadData"],
  methods: {
    //跳转商品分类详情
    // toClassification(item) {
    //     this.$router.push(`/newproductclassify?title=${item.title}&id=${item.id}&uid=${this.Uid}&url=${item.url}`)
    // },

    
    toClassification(item, index) {
        window.location.href = `${resources.goUrl}/newproductclassify?index=${index}&title=${item.title}&id=${item.id}&uid=${this.Uid}&url=${item.url}&strHeader=${this.sunJsonHeader}`;
    }

  },
  mounted(){
    //   console.log(resources.goUrl)
  }
};
</script>

<style lang="scss" scoped>
@import '~src/styles/var.scss';

.classify-box {
    padding: 30*$rem 30*$rem 5*$rem 30*$rem;
    width: 100%;
    height: auto;
    background: #fff;
    overflow: hidden;

  .classify-panel {
    margin-bottom: 25*$rem;
    float: left;
    width: 25%;
    height: auto;
    text-align: center;
    overflow: hidden;
    }

    .icon {
        width: 95 * $rem;
        height: 95 * $rem;
        border-radius:100%; 
    }

    .classify-title {
        line-height: 45*$rem;
        font-size: 24 * $rem;
        color: #292929;
    }
}
</style>
