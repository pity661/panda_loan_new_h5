<template>
    <div class="page-list-template">
        <!-- 点击加载 -->
        <p v-if="!allLoaded" :class="{'hide': !pageLoaded, 'clicked': nextPageClicked}" class="page-infinite-loading" @click="$emit('load-more')">
            <span class="load-more-btn">点击加载</span>
        </p>
        <!--底部加载完毕样式-->
        <div class="loadwrap" v-if="allLoaded">
            <span class="allLoaded-tip">{{allLoadedTip}}</span>
        </div>
        <!-- 下拉刷新按钮 -->
        <div  v-show="!allLoaded && topStatus != 'pull'" :class="{'show': topStatus != 'pull'}" class="mint-loadmore-top">
            <span class="refresh-btn" v-show="topStatus !== 'loading'">
                {{loadingStatus}}
            </span>
        </div>
    </div>
</template>

<script>
export default {
    props: ['allLoaded', 'topStatus', 'pageLoaded', 'nextPageClicked'],
    data() {
        return {
            loadingStatus: this.topStatus == 'pull' ? '下拉刷新' : '',
            allLoadedTip: '到底了，看看其他产品吧'
        }
    },
    mounted() {
        this.$emit('loadMore');
    }
}
</script>
<style lang="scss" scoped>
@import '~src/styles/var.scss';
.page-list-template {
    margin-bottom: 120 * $rem;

    .page-infinite-loading {
        text-align: center;
        height: 3.5rem;
        line-height: 3.5rem;
        font-size: 0.7rem;
        background: $white;

        &.clicked {
            .load-more-btn {
                &::after {
                    top: 16 * $rem;
                    right: 28 * $rem;
                    width: 24 * $rem;
                    height: 24 * $rem;
                    border: none;
                    background-image: url('~src/assets/loading.gif');
                    background-size: 20 * $rem 20 * $rem;
                    background-repeat: no-repeat;
                    transform: rotate(0);
                    z-index: 2;
                }
            }
        }

        .load-more-btn {
            position: relative;
            padding: 8 * $rem 58 * $rem 8 * $rem 38 *$rem;
            border: 2.1 * $rem solid $darkerBorder;
            color: $darkerTextColor;
            &::after {
                position: absolute;
                content: '';
                width: 14 * $rem;
                height: 14 * $rem;
                border-top: 2.1 * $rem solid $darkTextColor;
                border-right: 2.1 * $rem solid $darkTextColor;
                transform: rotate(45deg);
                bottom: 18 * $rem;
            }
        }
    }
    // 到底了
    .loadwrap {
        height: 3rem;
        line-height: 3rem;
        font-size: 24 * $rem;
        text-align: center;
        overflow: hidden;

        .allLoaded-tip {
            position: relative;
            display: inline-block;
            color: $lighterTextColor;

            &::after {
                position: absolute;
                content: '';
                width: 30%;
                height: 1px;
                top: 50%;
                right: -33%;

                background-color: #b0b0b0;
            }

            &::before {
                position: absolute;
                content: '';
                width: 30%;
                height: 1px;
                top: 50%;
                left: -33%;

                background-color: #b0b0b0;
            }
        }
    }
}
</style>

