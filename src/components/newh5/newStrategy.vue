<template>
    <div class="article-box" :style="{'min-height': (wrapperHeight) + 'px'}">
        <div :style="{'min-height': (wrapperHeight + 60) + 'px'}" v-html="strategyItem.content"></div>
    </div>
</template>
<script>
import resources from 'src/resources';

export default {
    data() {
        return {
            jsonHeader: '',
            wrapperHeight: 0,
            strategyItem: {},
            id: 0,
        }
    },

    methods: {
        getInfo() {
           let url = resources.getArticle(this.id);
            this.$axios.get(url).then(res => {
                if(res.data.obj1) {
                    this.strategyItem = res.data.obj1;
                }
            });
        }
    },
    created() {
        this.jsonHeader = JSON.parse(decodeURIComponent(this.$route.query.strHeader));
        this.id = this.$route.query.id;
        this.title = this.$route.query.title;

        this.getInfo();
        this.wrapperHeight = document.documentElement.clientHeight;
        let eleHtml = document.getElementsByTagName('html')[0],
            eleBody = document.getElementsByTagName('body')[0];

        eleHtml.style.width = '100%';
        eleHtml.style.height = '100%';
        eleBody.style.width = '100%';
        eleBody.style.height = '100%';

    }
}
</script>
<style lang="scss" scoped>
@import '~src/styles/var.scss';

.article-box {
    width: 100%;
    height: 100%;
    padding: 16 * $rem;
    background-color: $white;

    overflow: scroll;
    -webkit-overflow-scrolling: touch;
}
</style>

