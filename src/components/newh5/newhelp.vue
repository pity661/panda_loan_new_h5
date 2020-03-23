<template>
    <div style="background-color:#f5f5f5;height:100%;">
        <div v-if="show">
            <div class="help-top" ref="maincolor">
                <!-- <span class="top-text"  ref="toptext">常见问题</span> -->
                <span class="top-text" >常见问题</span>
            </div>
            <div class="help-middle">
                <div class="middle-block" v-for="(item,index) in listQuestion" :key="index">
                    <div class="middle-border"></div>
                    <div class="middle-left" @click="skip(index)">
                        <span class="middle-point" ref="we">●</span>
                        <span class="middle-text">{{item.value}}</span>
                    </div>
                    <div class="icon"><img src="~src/assets/helpclick.png" class="click-icon"></div>
                </div>
            </div>
            <div class="help-bottom">如未能解答您的疑问，可以反馈意见给我们</div>
        </div>
        <div v-if="!show">
            <div class="helpt-top" @click="back()">
                <span class="topt-text">{{listQuestion[questionNum].value}}</span>
            </div>
            <div class="help-middle" v-for="(item,index) in dataArr" :key="item.index" v-if="index === questionNum">
                <div class="middlet-block" >
                    <div class="middle-border"></div>
                    <div class="middlet-left">
                        <span class="middle-text" v-html="item.value">{{item.value}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import resources from "../../resources";
import qs from 'qs'
    export default {
		data() {
			return {
                packageName:'',
                name:'',
                jsonHeader: '',
                strHeadData: '',
                dataArr:[],
                listQuestion: [
                    {value:"短信验证码没收到怎么办？"},
                    {value:"如何选择合适的贷款产品？"},
                    {value:"如何申请贷款产品，需要哪些条件？"},
                    {value:"如何申请贷款产品，通过率更高？"},
                    {value:"贷款额度是多少？"},
                    {value:"申请一笔借款需要多长时间?"},
                    {value:"借款后如何还款？"}
                ],
                listAnswer: [
                    {value:"有多种可能会影响您成功接受验证码短信，请逐一排查:<br>(1) 验证码短信被您的手机安全软件拦截或标识为垃圾短信。 <br>解决方法：查看安全管理软件的短信拦截模式与黑名单设置，关闭短信拦截设置。<br><div style='margin-top:10px;'></div>(2) 您请求验证码的次数超过当天最高条数限制。 <br>解决方法：等待一天后再尝试使用相关服务。 <br><div style='margin-top:10px;'></div>(3) 网络通信状况不佳，由于网络或地域问题，服务器发出的验证信息可能存在不同程度的延迟。<br> 解决方法：耐心等待，或者等待一分钟后重试。" },
                    {value:"打开packageNameAPP，可根据自己的贷款需求，从首页的新品推荐、苹果专区、用信用卡、用公积金贷等专区进入产品列表页，也可以浏览贷款产品进行选择。"},
                    {value:"不同的贷款产品，对借款人的要求不同。在packageNameAPP上，展示了每一款贷款产品的金额和费用等信息，选择与自身匹配度高的产品，申请成功率更高。"},
                    {value:"packageName为您搜集整理了，市场上主流的贷款产品。据统计，同时申请7家以上的产品，通过率能达到90%以上。"},
                    {value:"packageNameAPP提供给借款人不同额度区间的多款贷款产品，依据借款人的个人资质，贷款产品的额度高低也不一样。建议在申请时保证个人信息填写正确、完整，贷款机构要求验证的材料尽量充分验证，有助于额度的提升。"},
                    {value:"packageNameAPP上有众多的贷款产品，从申请、审核到最终放款，快至1小时完成。因不同贷款产品的审核时间有所差异，您提供的信息越完整，验证材料越充分，审核速度就越快。"},
                    {value:"根据借款产品所属机构不同，还款方式也不同。常见还款方式有两种，自动还款：贷款机构会从您所绑定的借记卡中按期扣除应还金额；主动还款：还款日当天登陆自己在该机构的账户，自行使用银行卡进行还款。机构放款前会与您确认，请提前确认还款日期，以免造成逾期影响您的信用记录；还款中如有问题，请及时拨打相关机构客服电话寻求帮助。"}
                ],
                questionNum: '',
                show: true
            }
        },
        methods: {
            getPackagename(){ //获取参数
                let url = resources.jsonParameter();
                let params = { 
                    'packageName': this.packageName,
                };
                this.$axios.post(url,qs.stringify(params)).then( res => {
                    var jsonParameter = JSON.parse(res.data.jsonParameter); //由JSON字符串转换为JSON对象
                    this.name = jsonParameter.name
                    var _this = this
                    _this.dataArr = []
                    for(var i = 0; i<this.listAnswer.length;i++){
                        var str = this.listAnswer[i].value
                        var str2 = str.replace(/packageName/g,_this.name);
                        var obj =  {}
                        obj.value = str2
                        _this.dataArr.push(obj)
                        _this.datatxt = _this.dataArr
                    }
                })
                localStorage.setItem("packageName",this.packageName)
            }, 
            skip(index) {
                this.questionNum = index;
                this.show = false;
            },
            // back() {
            //     this.questionNum = '';
            //     this.show = true;
            // }
        },

        mounted(){

            this.jsonHeader = JSON.parse(decodeURIComponent(this.$route.query.strHeader));
            this.packageName = this.jsonHeader['Package-Name'];
            this.getPackagename()
        }
    }
</script>
<style lang="scss">
@import '~src/styles/var.scss';

        .helpt-top{
            height: 2rem;
            background-color: $white;
            .topt-text{
                line-height: 2rem;
                font-size: 0.65rem;
                padding-left: 1rem;
                color: $themeColor;
            }
        }
        .help-top{
            height: 2rem;
            background-color: $white;
            .top-text{
                line-height: 2rem;
                font-size: 0.65rem;
                padding-left: 1rem;
                color: $themeColor;
            }
        }
        .help-middle{
            background-color: $white;
            .middlet-block{
                .middle-border{
                    background-color: $backgroundColor;
                    width: 100%;
                    height:2.1px;
                    margin-left: 1rem;
                }
                .middlet-left{
                    padding-left: 1rem;
                    .middle-text{
                        display: inline-block;
                        line-height: 1rem;
                        font-size: 0.6rem;
                        padding-top: 0.5rem;
                        padding-bottom: 0.5rem;
                        // color: $themeColor;
                    }
                }
            }
            .middle-block{
                height: 2rem;
                .middle-border{
                    background-color: $backgroundColor;
                    width: 100%;
                    height: 2px;
                    margin-left: 1rem;
                }
                .middle-left{
                    display: inline-block;
                    .middle-point{
                        margin-left: 1rem;
                        display: inline-block;
                        line-height: 2rem;
                        color: $themeColor;
                        //font-size: 0.1rem;
                    }
                    .middle-text{
                        width: 16rem;
                        display: inline-block;
                        padding-left: 0.3rem;
                        font-size: 0.6rem;
                    }
                }
                .icon{
                    display: inline-block;
                    vertical-align: top;
                    margin-top: 0.6rem;
                    .click-icon{
                        width:0.35rem;
                    }
                }
            }
        }
        .help-bottom{
            background-color: $backgroundColor;
            color: rgb(101,101,101);
            margin-top: 0.6rem;
            font-size: 0.6rem;
            margin-left: 1rem;
        }
</style>
