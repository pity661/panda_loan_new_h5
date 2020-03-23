const debug = process.env.NODE_ENV === 'development' ? true : false;
// 测试环境地址
if (debug) {
    var goUrl = 'http://192.168.3.157:8080/login_h5' //绝对地址测试本地
    var host = 'http://47.104.109.123:84/h5_api'; // api新的测试环境地址
} else {
    //正式环境地址 !!!注意，复制这里的地址的时候要去掉 https 中的 “s”，特此标记。
    // var host = 'https://api.pinganzhiyuan.com/panda_loan'; //正式
    // var goUrl = 'https://static.pinganzhiyuan.com/login_h5' //绝对地址线上
    var host = 'http://47.104.109.123:84/api'; // api新的测试环境地址
    // var host = 'https://api.pinganzhiyuan.com/gray';
    var goUrl = 'http://47.104.109.123:86/login_h5' //绝对地址线上
}

console.warn('当前resource: ', host);
console.warn('当前resource', goUrl);

let resources = {
    host: host,
    goUrl: goUrl,
    // graphQL查询Api
    v2GraphQlApi: `${host}\/v2\/graphql\/query`,
    graphQlApiOld: `${host}\/graphql`,
    graphQlApi: `${host}\/graphql\/query`,
    goProductDetail: `${host}\/v2\/app\/h5\/redirect\/product\/details`,
    getProductWithRule: `${host}\/product\/details`,
    getArticle(id) {
        return `${host}\/artical\/${id}`
    },
    users(id) {
        return `${host}\/users\/${id}`
    },
    imageCode() {
        return `${host}\/imageCaptchas`
    },
    smsCaptcha() {
        return `${host}\/smsCaptcha`
    },
    token() {
        return `${host}\/tokens`
    },
    landingPage() {
        return `${host}\/landingPage`
    },
    recordUrl() {
        return `${host}\/recordH5`
    },
    h5DownloadUrl() {
        return `${host}\/h5DownloadUrl`
    },
    recordDownload() {
        return `${host}\/recordDownload`
    },
    jsonParameter() { //APP内嵌H5页面取值
        return `${host}\/jsonParameter`
    },
    v2(userid, partner) { //百融测试
        return `${host}\/v2/partner/diversion/product/list?userId=` + userid + '&partner=' + partner
    },
    client() { //认证状态
        return `${host}\/client`
    },
    feedback() { //反馈信息
        return `${host}\/v2/usr/feedback`
    },
    clients() { //提交实名接口
        return `${host}\/clients`
    },
    postmaterial() { //提交提升额度资料接口
        return `${host}\/v2/usr/material/increaseLimit`
    },
    getincreaseLimit(userId) { //获取提升额度资料接口
        return `${host}\/v2/usr/material/increaseLimit/` + userId
    },
    getProductInfo(productId) {
        return `${host}\/product\/` + productId;
    },
    miaozhuan() { //秒赚
        return `${host}\/redirectMiaoZhuan/`;
    }
};

export default resources;