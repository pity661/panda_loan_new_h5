import { Toast } from 'mint-ui';

// 页面基准值
const BASESIZE = parseFloat(getComputedStyle(window.document.documentElement)['font-size']);

// 判断是iOS 还是 Android，或其他
const ISAPPLEDEVICE = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) ? true : false;
const ANDROIDDEVICE = /(Android)/i.test(navigator.userAgent) ? true : false;

/**
 * 
 * @param {*} parameterData 传递参数  isShowClose   0:不显示按钮，1：显示按钮；isOnLoadPop  0:二级， 1：一级页面
 * @param {*} callbackName 回调方法
 */
function Weaklogin(parameterData, callbackName) { // 调用APP登录全局函数 
    // TODO 有待改进，有默认参数，如果传递过来的 parameterData 里面只有一个属性，剩下的就需要用默认的，这样即使漏传也不会有问题
    var urljson;

    if (!parameterData) { //如果参数传的为空执行默认参数

        var defaultData = { //定义传入参数
            goBackUrl: window.location.href, //当前url
            isShowClose: '1', //强登弱登
            isOnLoadPop: '0' //一级二级调起登录
        };

        urljson = escape(JSON.stringify(defaultData)); //默认的参数转码为json字符串
    } else { //如果是手动传入的配置参数执行

        urljson = escape(JSON.stringify(parameterData)); //传入的参数转码为json字符串

    }

    window.location.href = `wode-schema://callLogin?data=${urljson}&callback=${callbackName}`; //重新定义的调起弱登录代码

}


/**
 *  封装截取接口返回产品名称
 * @param {string} str  
 * @param {number} len
 */

function methodGetByteLen(str, len) {
    return str.substring(0, len)
}


/**
 * 封装产品的数据
 * @param {object} product 
 * @param {string} keyName 
 * @param {number} properSize 
 */
function setProduct(product, keyName, properSize) {
    // 如果最大额度超过万以上进行处理数值
    if (product.maxAmount > 10000) {
        product.maxAmount = product.maxAmount / 10000 + "万";
    } else {
        product.maxAmount = product.maxAmount;
    }
    // 如果最小额度超过万以上进行处理数值
    if (product.minAmount > 10000) {
        product.minAmount = product.minAmount / 10000 + "万";
    } else {
        product.minAmount = product.minAmount;
    }

    if (product.firstTags === "") {
        product.tagText = '';
        product.firstTagArray = [];
        product.isFirstTags = false;
    } else {
        product.isFirstTags = true;
        product.firstTagArray = product.firstTags.split('|');
        product.tagText = product.firstTagArray[0];

    }

    if (product.dayRate) {
        product.monthRateText = `${(product.dayRate * 30 ).toFixed(2)}%`;
    }

    if (keyName && properSize) {
        product[keyName] = getProperImgSize(product[keyName], properSize);
    }
    return product;
}

/**
 * 替换图片地址为 根据大小获得图片的图片地址
 * @param {string} imgUrl 
 * @param {number} properSize 
 */
function getProperImgSize(imgUrl, properSize) {
    var properSize2X = properSize * 2;
    imgUrl =  imgUrl.replace('https://static.pinganzhiyuan.com/', `https://img.pinganzhiyuan.com/${properSize2X}/www.pinganzhiyuan.com/`);
    return imgUrl;
}

/**
 * iOS记录uv需要的URL
 * @param {string} redirectUrl 
 */
function getUrlForUv(redirectUrl) {
    var str = "redirect=";
    var stringUrl = redirectUrl.split(str).length > 1 ? redirectUrl.split(str)[1] : '';
    return decodeURIComponent(stringUrl); //赋值跳转url
}

/**
 * tabbar是否展示
 * @param {object} jsonHeader 
 */
function showtab(jsonHeader) {
    let showtab = 'true';
    if (jsonHeader.showtab != undefined && (jsonHeader.showtab).indexOf('false') > -1) {
        showtab = 'false';
    } else {
        showtab = 'true';
    }
    return showtab;
}

/**
 * 得到URL中携带的头信息
 * @param {object} jsonHeader 
 * @param {object}  $route
 */
function getHeader(jsonHeader, $route) {
    let header = {
        jsonHeader: '',
        strHeadData: ''
    };
    if ($route.query['User-Id']) {
        var strQuery = JSON.stringify($route.query);
        header.jsonHeader = JSON.parse(strQuery);
        if (!header.jsonHeader.strHeader) {
            header.strHeadData = encodeURIComponent(strQuery);
        } else {
            let tmp = JSON.parse(header.jsonHeader.strHeader);
            header.jsonHeader.strHeader = JSON.stringify(tmp);
            header.strHeadData = JSON.stringify(tmp);
        }
    } else if ($route.query.strHeader) {
        header.jsonHeader = JSON.parse(decodeURIComponent($route.query.strHeader));
        header.strHeadData = encodeURIComponent(JSON.stringify(header.jsonHeader));
    }
    return header;
}

/**
 * 获得分类列表页中，要展示的后三个分类（循环）
 * @param {array} classifyList 所有的分类列表
 * @param {number} index 索引值
 */
function getReshowClassifyList(classifyList, index) {
    // 拿到当前分类的后面三个，存在localstorage里
    let length = classifyList.length;
    let reLength = index + 4 - length;
    let threeArr = classifyList.slice(index + 1, index + 4);
    if (reLength > 0) {
        let tmp = classifyList.splice(0, reLength);
        threeArr = threeArr.concat(tmp);
    }
    return threeArr;
}

/**
 * 设置 贷款攻略 的数据
 * @param {object} item 
 * @param {number} properSize 
 */
function setArticle(item, properSize) {
    let maxNum = 800,
        minNum = 700;
    let initNum = parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);

    item.count = initNum;
    initial(item, 10 * 60 * 1000);
    item.imgUrl = getProperImgSize(item.imgUrl, properSize);
    return item;
}

/**
 * 数字累加  每隔 time 时间，就增加 10 - 20 直接的随机数
 * @param {object} item 
 * @param {number} time 
 */
function initial(item, time) {
    var that = this;
    var timer = setInterval(function() {
        var nowNum = Math.floor(Math.random() * 11) + 10;
        item.count += nowNum;
        if (item.count >= 20000) {
            clearInterval(timer);
        }
    }, time)
}

/**
 * 给定一个起始时间，然后计算一个阅读量
 * @param {date} start_Date
 */
// function setArticleCount(start_Date, initNum) {
//     let multiple = Math.ceil(Math.random()) + 10;
//     var start_Date = new Date(start_Date).getTime();
//     let currentTime = new Date().getTime();
//     var sec = (currentTime - start_Date) / 1000 / 60 / 10;
//     var nowNum = parseInt(sec);

//     nowNum = nowNum * multiple;
//     return initNum + nowNum;
// }

/**
 * 逻辑修改，所有去详情页之前，都要用户信息，没有登录信息时，需要调用的方法，如果是需要立即跳转的判断登录信息，不是立即跳转，则跳转到己方详情页
 * @param {object} params 
 */
function goThirdWithoutUserId(params) {
    let userId = parseInt(localStorage.getItem('Userid')) ? parseInt(localStorage.getItem('Userid')) : parseInt(params.jsonHeader['User-Id']);

    if (!userId) {
        return 'needLogin';
    } else {
        goThirdWithUserId(params);
    }

    return 'needNotLogin';
}

/**
 * 逻辑修改，都需要用户信息，在有用户信息时，可能直接去第三方，可能直接去详情页
 * @param {object} params 
 */
function goThirdWithUserId(params) {
    let isDetail = params.isDetail ? params.isDetail : false;

    let tmpParams = {
        "url": params.urlThird,
        "productId": params.product.id,
        "userId": parseInt(params.jsonHeader['User-Id']),
        "packageName": params.jsonHeader['Package-Name'],
        "channelId": params.jsonHeader['Channel-Id'],
        "version": params.jsonHeader['Version'],
        "deviceId": params.jsonHeader['Device-Id']
    };

    // 360产品，信用卡等，直接跳转
    if (isDetail || params.product.directJump) {
        window.location.href = `${tmpParams.url}?userId=${tmpParams.userId}&productId=${tmpParams.productId}&packageName=${tmpParams.packageName}&channelId=${tmpParams.channelId}&version=${tmpParams.version}&deviceId=${tmpParams.deviceId}`;
    } else {
        // 普通产品，调转 详情页
        window.location.href = `${params.goUrl}/newDetail?productId=${params.product.id}&productname=${params.product.title}&title=${params.product.title}&strHeader=${params.strHeadData}`;

    }
}

/**
 * 产品登录成功后处理，拿到user信息，调转第三方页面
 * @param {object} userObj
 * @param {object} params
 */
function productLoginSuccess(userObj, params) {
    if (userObj && userObj.id) {
        localStorage.setItem("Userid", userObj.id);
        localStorage.setItem("userPhone", userObj.username);

        goThirdWithUserId(params);

    } else {
        Toast('用户信息错误，请重试');
        return;
    }
}

/**
 * 成功调起登录后，保存用户信息，userId，userPhone为在个人中心使用
 * @param {object} userObj
 * @param {function} callback
 */
function loginSuccess(userObj, callback) {
    if (userObj && userObj.id) {
        localStorage.setItem("Userid", userObj.id);
        localStorage.setItem("userPhone", userObj.username);

        callback();
    } else {
        Toast('用户信息错误，请重试');
        return;
    }
}

/**
 * 自定义弹窗 定义弹窗持续时间 默认值 为 3000ms，时间太长
 * @param {string} message 
 * @param {number} time 
 */
function customToast(message, time) {
    time = time ? time : 1000;
    Toast({
        message: message,
        duration: time
    });
}

export default {
    BASESIZE,
    ISAPPLEDEVICE,
    ANDROIDDEVICE,
    Weaklogin, //抛出方法
    setProduct,
    getProperImgSize,
    getUrlForUv,
    showtab,
    getHeader,
    getReshowClassifyList,
    setArticle,
    goThirdWithoutUserId,
    goThirdWithUserId,
    methodGetByteLen,
    loginSuccess,
    productLoginSuccess,
    customToast
}