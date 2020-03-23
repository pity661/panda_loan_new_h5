<template>
	<div class="tag-box" :class="{'simple-theme': theme == 'simple'}">
        <div class="tagdiv">
            <span class="tagtxt">{{tagtxt}}</span>
            <div class="tagicon" @click="$emit('go-list')" v-show="showArrow">
                <img src="~src/assets/newrighticon.png" alt="" class="tagimgs">
            </div>
        </div>
	</div>
</template>
<script charset="UTF-8">
export default {

  data() {
    return {

    };
  },
  props: ['tagtxt', 'showArrow', 'theme'],
  methods: {

  },
  mounted(){
      this.$emit('goList');
  }
};
</script>

<style lang="scss" scoped>
@import '~src/styles/var.scss';
.tag-box {
    width: 100%;
    height: auto;
    background-color: $backgroundColor;
    border-bottom: 2.1 * $rem solid $lightBorder;
    overflow: hidden;

    &.simple-theme {
        .tagdiv {
            &::before{
                background-color: $themeSimpleColor;
            }
        }
    }

    .tagdiv {
        position: relative;
        padding: 0rem 30*$rem;
        width: 100%;
        height: 80 * $rem;
        line-height: 80*$rem;
        font-size: 30*$rem;
        color: #000;
        overflow: hidden;
        background-color: $white;
        font-weight: bold;
       
        &::before{
            position: absolute;
            top: 25 * $rem;
            left: 35*$rem;
            content: '';
            width: 10*$rem;
            height: 28 * $rem;
            background-color: #2182cf;
        }

        .tagtxt{
            width: auto;
            margin-left: 30 * $rem;
            line-height: 80 * $rem;
            height: 30 * $rem;

        }
        // 图片
        .tagicon{
            float: right;
            width: 80 * $rem;
            height: 80*$rem;
            line-height: 80*$rem;
            font-size: 30*$rem;
            text-align: right;
            .tagimgs{
                width: 16*$rem;
                height: 27*$rem;
                vertical-align: middle;
            }
        }
    
    }

}

</style>