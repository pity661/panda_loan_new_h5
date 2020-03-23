<template>
    <div>
        <!-- 'margin-bottom': tabHeight + 'px', -->
        <div>
            <router-view  :tabName='appTitle'></router-view>
        </div>
        <m-tabbar v-if="showtab == 'true'" fixed v-model="select">
            <m-tabbar-item :id='tab.schemeUrl' v-for="(tab, index) in tabList" :key="index" isRouter>
                <img :src="tab.iconUrl" alt="" slot="icon-normal"> 
                <img :src="tab.activeIconUrl" alt="" slot="icon-active"> 
                {{tab.name}}
            </m-tabbar-item>
        </m-tabbar>
    </div>
</template>

<script charset="UTF-8">
import mTabbar from "common/tabbar";
import mTabbarItem from "common/tabbar-item";
import resources from "../../resources";

let qs = require('qs');

export default {
    components: {
        mTabbar,
        mTabbarItem
    },
    data() {
        return {
            select: "newindex",
            showtab: 'true',
            tabList: {},
            appTitle: '',
            wrapperHeight: 0,
            tabHeight: 42,
            strHeadData: '',
            jsonHeader: ''
        };
    },
    methods: {
        getTabbar() {
            let _this = this;
            let params = {
                query: `{tabs(
                        versionCode: ${_this.jsonHeader.Version},
                        channelId: ${_this.jsonHeader['Channel-Id']},
                        packageName: "${_this.jsonHeader['Package-Name']}"
                        ){     
                                id
                                name
                                iconUrl
                                sequence
                                schemeUrl
                        }}`
            };
            if(_this.showtab == 'false'){
                return;
            }

            // 判断 头信息是否有，并正确，至少保证CONTENT-TYPE是对的

            let contype = _this.jsonHeader['Content-Type'];
            if(!contype || contype.indexOf('application/x-www-form-urlencoded') < 0) {
                _this.jsonHeader['Content-Type'] = 'application/x-www-form-urlencoded';
            }
            _this.$axios.post(`${resources.graphQlApi}`, qs.stringify(params),{
                headers: _this.jsonHeader
            }).then(res => {
                if(res.data.data) {
                    _this.tabList = res.data.data.tabs;
                    _this.tabList.forEach(tab => {
                        if(_this.showtab != 'false') {
                            let icon = `src/assets/${tab.schemeUrl}.png`;
                            let iconActive = `src/assets/${tab.schemeUrl}active.png`;
                            tab.iconUrl = require(`src/assets/${tab.schemeUrl}.png`);
                            tab.activeIconUrl = require(`src/assets/${tab.schemeUrl}active.png`);
                        }
                    });
                    localStorage.setItem('tabList', JSON.stringify(_this.tabList));
                }else {
                }
            }).catch(e => {
            });
        }
    },
    created() {
        if(!this.$route.query.strHeader && this.$route.query) {
            var strQuery = JSON.stringify(this.$route.query);
            this.jsonHeader = JSON.parse(strQuery);
            this.strHeadData = encodeURIComponent(strQuery);
        }else if(this.$route.query.strHeader){
            this.jsonHeader = JSON.parse(decodeURIComponent(this.$route.query.strHeader));
            this.strHeadData = encodeURIComponent(JSON.stringify(this.jsonHeader));
        }

        this.showtab = this.globalFunction.showtab(this.jsonHeader);
        if(this.showtab == 'false') {
            return;
        }
        this.getTabbar();
    },
    mounted() {
    }
};
</script>

<style scoped="scoped">
.has-tab {
    /* padding-bottom: 2.5rem; */
}
</style>
