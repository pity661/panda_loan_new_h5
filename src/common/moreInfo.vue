<template>
    <div class="more-info-template">
        <div class="more-info" @click="$emit('go-list')">
            <span class="tips">{{tips}}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: ['tips'],
    data() {
        return {};
    },
    mounted() {
        this.$emit('goList');
    }
}
</script>

<style lang="scss" scoped>
@import '~src/styles/var.scss';

.more-info-template {
    width: 100%;
    height: 124 * $rem;
    font-size: $baseFontSize;
    line-height: 124 * $rem;
    text-align: center;
    background-color: $white;
    color: $darkerTextColor;

    .tips {
        position: relative;

        &::after {
            position: absolute;
            content: '';
            width: 18 * $rem;
            height: 18 * $rem;
            top: 10 * $rem;;
            right: -24 * $rem;
            transform: rotate(45deg);
            border-top: 1px solid $darkerTextColor;
            border-right: 1px solid $darkerTextColor;
        }
    }
}
</style>
