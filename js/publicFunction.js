//封装相对定位的父元素高度自适应绝对定位的子元素高度
/**
 * @description 封装相对定位的父元素高度自适应绝对定位的子元素高度
 * @param {string} parentEleId 需要适应高度元素的id
 * @param {string} childrenEleId 被使用高度的元素的id
 */
var changeParentEleHeight = function (parentEleId, childrenEleId) {
    var parentEleHeight = $(parentEleId).innerHeight();
    var childrenEleHeight = $(childrenEleId).innerHeight();
    var heightArr = [];

        //指定元素高度等于其指定子元素高度
    // if ($(childrenEleId).length > 1){
        for (var i = 0; i < $(childrenEleId).length; i++){
            if ($($(childrenEleId)[i]).innerHeight() > 0){
                heightArr.push($($(childrenEleId)[i]).innerHeight());
            }
        }
        $(parentEleId).innerHeight(Math.max.apply(null,heightArr));
    // }
}


/*
    * @description 获取某个元素距离文档顶部的高度
    * @param {object} el 元素对象
    * @param {number} border 父元素的顶部的边框高度
    * @param {object} el.offsetParent 元素对象的最近有定位的父级元素
    * */
function getOffsetTop(el, border) {
    var offsetTop = el.offsetTop + border;

    if (el.offsetParent != null){ //el.offsetParent != null证明父级元素已到达最顶部
        offsetTop += el.offsetParent.clientTop; //父元素的顶部边框高度
        return getOffsetTop(el.offsetParent, offsetTop);
    }else {
        return offsetTop;
    }
}

var first  = document.getElementById('first');
//第二种获取某个元素距离文档顶部的高度的方法
// var getOffsetTop = first.getBoundingClientRect().top;

//判断元素是否在可视区域
function inSight(el) {
    //屏幕可视区域高度
    var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.offsetHeight;
    //屏幕被卷去的高度
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    //方法一
    // return getOffsetTop(el, 0) < winHeight + scrollTop;
    // 方法二
    return el.getBoundingClientRect().top < winHeight;
}
/*
        * @description 更改元素的src
        * @paran */
function changImgSrc() {
    var imgS = document.getElementsByTagName("img");
    for (var i=0; i<imgS.length; i++){
        if (inSight(imgS[i]) && !(imgS[i].src)){
            imgS[i].src = imgS[i].getAttribute("data-src");
        }
    }

}

/*
* @description 节流函数
* @param {function} fun 执行的方法
* @param {number} setTime 需要延迟的时间
* @param {number} time 多长事件执行一次函数*/
function throttle(fun, setTime, time){
    var timeOut;
    var lastDate = null;

    return function () {
        var nowDate = +new Date();
        clearTimeout(timeOut);
        if (nowDate - lastDate >= time || !lastDate){
            fun();
            lastDate = nowDate;
        }else {
            timeOut = setTimeout(function () {
                fun();
            }, setTime);
        }

    }
}


