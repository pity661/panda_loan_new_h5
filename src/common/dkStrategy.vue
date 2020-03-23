<template>
    <div class="dk-strategy-template" @click="goUrl(dkItem.id)">
        <div class="dk-box clear">
            <div class="dk-info fl">
                <p class="dk-title">{{dkItem.title}}</p>
                <span class="reading-quality">{{dkItem.count}}次阅读</span>
            </div>
            <img class="dk-img fr" v-lazy="dkItem.imgUrl" alt="">
        </div>
    </div>
</template>

<script>
import resources from 'src/resources';

export default {
    props: ['dkItem'],
    data() {
        return {
            jsonHeader: ''
        };
    },
    methods: {
        goUrl(id) {
            window.location.href = `${resources.goUrl}/newStrategy?title=${this.dkItem.title}&id=${id}&strHeader=${this.jsonHeader}`;
        }
    },
    created() {
        let headerInfo = this.globalFunction.getHeader(this.jsonHeader, this.$route);
        this.jsonHeader = encodeURIComponent(JSON.stringify(headerInfo.jsonHeader));
    }
}
</script>

<style lang="scss" scoped>
@import '~src/styles/var.scss';
.dk-strategy-template {
    padding-left:30 * $rem;
    background-color: $white;

    .dk-box {
        padding: 24 * $rem 35 * $rem 24 * $rem 0;
        border-bottom: 2.1 * $rem solid $lightBorder;
    }

    .dk-info {
        .dk-title {
            box-sizing: content-box;
            width: 400 * $rem;
            height: 118 * $rem;
            margin-bottom: 20 * $rem;
            font-size: $bigFontSize;
            line-height: 60 * $rem;
            color: $darkerTextColor;
            overflow: hidden;
        }

        .reading-quality {
            font-size: $smallFontSize;
            color: $textColor;
        }
    }
    .dk-img {
        width: 245 * $rem;
        height: 167 * $rem;
    }
}
</style>
