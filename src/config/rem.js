//FIX rem 适配 配合postcss  将来提到工具方法里
(function(win, doc) {
    var UA = navigator.userAgent,
        isAndroid = /android|adr/gi.test(UA),
        isIos = /iphone|ipod|ipad/gi.test(UA) && !isAndroid; //据说某些国产机的UA会同时包含android iphone 字符
    var docEl = doc.documentElement;
    var refreshRem = function() {
            var w = docEl.getBoundingClientRect().width || 375;
            var fs = w / 375 * 20;
            fs = fs > 46.875 ? 46.875 : fs; // 限制最大宽度 750
            docEl.style.fontSize = fs + 'px';
        },
        refreshRemId;
    win.addEventListener('resize', function() {
        clearTimeout(refreshRemId);
        refreshRemId = setTimeout(refreshRem, 100);
    }, false);
    win.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(refreshRemId);
            refreshRemId = setTimeout(refreshRem, 100);
        }
    }, false);
    refreshRem();
})(window, document);