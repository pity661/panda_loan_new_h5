<template>
    <div class="newheader" v-if="newheadershow">
        <div class="newheaderback" @click="$router.go(-1)">
            <img src="~src/assets/newheaderback.png" alt="" />
        </div>
        {{title}}
    </div>
</template>

<script charset="UTF-8">
	export default {
		data() {
			return {
                newheadershow: false,
                sunJsonHeader: this.jsonHeader
			}
		},
		props: ['title', 'jsonHeader'],
		methods: {
            getheader(){ //判断header是否要显示
                if(this.sunJsonHeader.headershow == undefined || (this.sunJsonHeader.headershow).indexOf('true') >= 0 ){
                    this.newheadershow = false;
                }else{
                    this.newheadershow = false;
                }
            }
        },
        created(){
            this.sunJsonHeader = JSON.parse(decodeURIComponent(this.sunJsonHeader));
            this.getheader();
        }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '~src/styles/var.scss';
	.newheader{
        padding: 0rem 25*$rem;
		width:100%;
		height: 88*$rem;
		line-height: 88*$rem;
		background:$white;	
        font-size: 32*$rem;
        text-align: center;
        color: $darkTextColor;
        border-bottom: 2.1*$rem solid $lightBorder;
        overflow: hidden;
	}
	.newheader .newheaderback{
        float: left;
		width: auto;
		height: 88*$rem;
		line-height: 88*$rem;
        overflow: hidden;
	}
	.newheader .newheaderback img{
		width: 21*$rem;
		height: 37*$rem;
		vertical-align:middle;
	}
</style>