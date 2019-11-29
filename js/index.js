$(function () {
    var tab = $("#tab");

    /*@description 处理表格数据并显示，为数据添加分页
    * @param {number} showNum 每一页显示多少条数据
    * @param {string} dataName 选择要加载的数据的名称
    * */
    function tabData(showNum, dataName) {
        $.getJSON("./js/data.json", function (data) {
            var newData;
            var allNum;
            var th = "<tr><th>序号</th><th>标准名称</th><th>PDF查看/下载</th><th>PDF下载</th></tr>";

            $("#barcon").html("");  //清空分页
            newData = data[dataName];
            allNum = newData.length / showNum;  //总页数
            allNum = (allNum > parseInt(allNum) ? (Math.ceil(allNum)) : (Math.floor(allNum)));  //总页数
            createPageBtn({
                id: "#barcon",
                nowPage: 1,
                allPage: allNum,
                numPage: 5,
                callBack: function (nowPage, dataName) {
                    console.log("当前页是：" + nowPage + "，总共页是：" + allNum);
                    showData(nowPage, 12, newData);
                }
            });

            //侧边导航栏高度自适应函数
            changeParentEleHeight(".date-left", ".date-right");
            $(".date-left").css("min-height", $(".date-left>ul").innerHeight());
            $(".date-right").css("min-height", $(".date-left>ul").innerHeight());

            /*
             * @description 生成页面数组
             * @param {number} nowPage 当前页码
             * @param {number} hasPages 共有多少页码
             * @param {number} numPage 最多能显示多少个页面按钮页码
             * */
            function mathPages(nowPage, hasPages, numPage) {
                var pageArray = [];

                //先根据总页数创建数组，将全部页标添加到数组中
                for (var i = 0; i < hasPages; i++) {
                    pageArray.push(i);
                }

                if (hasPages < numPage) {
                    return pageArray;
                }  //如果总页数小于最多能显示的页数直接返回
                //当前页<=2时，当前页的页标就不能显示在第三位了，直接截取0~6输出
                if (nowPage <= (numPage + 1) / 2) {
                    pageArray = pageArray.slice(0, numPage);
                    return pageArray;
                } else {//如果当前页标>(numPage+1)/2)，则从当前页标-3开始截取总页标数组，截取numPage个
                    var newPageArray = pageArray.slice(nowPage - ((numPage + 1) / 2), nowPage + ((numPage + 1) / 2) - 1);

                    if (newPageArray.length >= numPage) {
                        return newPageArray;
                    } else {//如果当前页是倒数后3页，就截取不到6个页标，那么直接截取最后6个页标即可
                        newPageArray = pageArray.splice(-numPage);
                        return newPageArray;
                    }
                }
            }

            /*
         * @description 创建分页按钮并添加点击事件
         * @param {string} pa.id 在哪创建分页
         * @param {number} pa.nowPage 当前页
         * @param {number} pa.allPage 总共页
         * @param {number} pa.numPage 最多能显示多少个按钮
         * */
            function createPageBtn(pa) {
                var id = pa.id;
                var nowPage = pa.nowPage;
                var allPage = pa.allPage;
                var numPage = pa.numPage;
                var callBack = pa.callBack;
                var barcon = $(id);
                var array = mathPages(nowPage, allPage, numPage);
                var pre = "<a href='#" + (nowPage - 1) + "'>«</a>";
                var next = "<a href='#" + (nowPage + 1) + "'>»</a>";
                var num = parseInt(numPage / 2 + 2);

                /*@description 根据数组创建分页按钮*/
                function btn() {
                    $.each(array, function (index, value) {
                        var str = "<a href='#" + (value + 1) + "'>" + (value + 1) + "</a>";
                        if (pa.nowPage === value + 1) {  //为当前页按钮添加样式
                            str = "<a href='#" + (value + 1) + "' class='action'>" + (value + 1) + "</a>";
                        }
                        barcon.append(str);
                    })
                }

                if (nowPage >= 2) {  //当前页大于二时创建上一页按钮
                    if (pa.nowPage >= num) {  //创建首页按钮
                        pre = "<a href='#1'>首页</a><a href='#" + (nowPage - 1) + "'>«</a>";
                    }
                    barcon.append(pre);
                    btn();
                    if (allPage - nowPage >= 1) {  // //当总页数减去当前页大于等于一（不等于零，等于零说明是最后一页了）创建下一页
                        if (allPage - nowPage >= (numPage + 1) / 2) {
                            next = "<a href='#" + (pa.nowPage + 1) + "'>»</a><a href='#" + pa.allPage + "'>尾页</a>";  //添加尾页按钮
                        }
                        barcon.append(next);
                    }
                } else {
                    btn();
                    if (allPage - nowPage >= 1) {  //添加下一页按钮
                        if (allPage - nowPage >= (numPage + 1) / 2) {
                            next = "<a href='#" + (nowPage + 1) + "'>»</a><a href='#" + allPage + "'>尾页</a>";  //添加尾页按钮
                        }
                        barcon.append(next);
                    }

                }

                callBack(nowPage, allPage);

                //给分页按钮点击事件
                {
                    var aObj = barcon[0].getElementsByTagName("a");
                    for (var i = 0; i < aObj.length; i++) {
                        $(aObj[i]).on({
                            click: function () {
                                var nowPage = parseInt(this.getAttribute("href").substring(1)); //取得当前点击按钮的href值（因为取到的是str类型的，所以要转换）
                                document.querySelector("#caption").scrollIntoView({
                                    block: "start",
                                    behavior: "smooth"
                                });  //滚动视图，每点击分页按钮都会链接到表格顶部，相当于给分页按钮添加锚链接
                                barcon[0].innerHTML = "";  //清空分页内容
                                //从新执行分页
                                createPageBtn({
                                    id: pa.id,
                                    nowPage: nowPage,
                                    allPage: pa.allPage,
                                    numPage: pa.numPage,
                                    callBack: pa.callBack
                                });
                                // forbidSelect($("#barcon>a"));

                                return false;
                            }
                        })
                    }
                }
            }

            //禁止分页文字被选中
            // forbidSelect($("#barcon>a"));
            /*@description 将选择的数据显示到tab中
            * @param {number} nowPage 当前页
            * @param {number} showNum 每页显示多少条数据
            * */
            function showData(nowPage, showNum, newData) {

                var lastDataNum = (nowPage * showNum) > newData.length ? newData.length : (nowPage * showNum);
                var i = (lastDataNum <= showNum) ? 0 : (lastDataNum - showNum);

                tab.html("");
                tab.append(th);

                for (i; i < lastDataNum; i++) {
                    var str = "<tr><td>" + (i + 1) + "</td><td>" + newData[i].staName + "</td><td><a href='./other/pdf.js/web/viewer.html?file=../../" + encodeURIComponent(newData[i].url) + "' target='_blank'>查看/下载</a></td><td><a href='./other/" + newData[i].url + "' download='./other/" + newData[i].url + "'>下载</a></td></tr>";
                    tab.append(str);
                }
            }

            //搜索
            {
                var allData = [];  //保存全部的数据
                var dataNameArray = ["waterage", "irrigation", "railway", "power", "roadBridge", "aviation", "materials"];
                var keyWord;
                var cpLock = false;  //控制中英文搜索
                for (var i = 0; i < dataNameArray.length; i++) {
                    for (var j = 0; j < data[dataNameArray[i]].length; j++) {
                        allData.push((data[dataNameArray[i]])[j]);
                    }
                }

                //给输入框绑定回车搜索


                function addDataTab(dataTab) {
                    tab.html("");
                    tab.append(th);
                    $("#barcon").html("");  //清空分页
                    for (var i = 0; i < dataTab.length; i++) {
                        var str = "<tr><td>" + (i + 1) + "</td><td>" + dataTab[i].staName + "</td><td><a href='./other/" + dataTab[i].url + "' target='_blank'>查看/下载</a></td><td><a href='other/" + dataTab[i].url + "' download='./other/" + dataTab[i].url + "'>下载</a></td></tr>";
                        tab.append(str);
                    }
                    var allNum = dataTab.length / showNum;  //总页数
                    allNum = (allNum > parseInt(allNum) ? (Math.ceil(allNum)) : (Math.floor(allNum)));  //总页数

                    createPageBtn({
                        id: "#barcon",
                        nowPage: 1,
                        allPage: allNum,
                        numPage: 5,
                        callBack: function (nowPage, dataName) {
                            console.log("当前页是：" + nowPage + "，总共页是：" + allNum);
                            showData(nowPage, 12, dataTab);
                        }
                    });

                }

                $("#successInp").on({
                    keydown: function (e) {
                        if (e.keyCode === 13) {
                            inputFun(this);
                        }
                    },
                    compositionstart: function () {
                        cpLock = true;
                        console.log("不搜索！");
                    },
                    compositionend: function () {
                        cpLock = false;
                        console.log("汉字搜索！");
                        inputFun(this);
                    },
                    propertychange: function () {
                        inputFun(this);
                    },
                    change: function () {
                        inputFun(this);
                    },
                    click: function () {
                        inputFun(this);
                    },
                    keyup: function () {
                        inputFun(this);
                    },
                    input: function () {
                        inputFun(this);
                    },
                    paste: function () {
                        inputFun(this);
                    }
                });
                // 给搜索按钮绑定点击事件
                $("#successBtn").click(function () {
                    if (keyWord.value === " ") {
                        return false;
                    } else {
                        inputFun($("#successInp")[0]);
                    }
                });

                function inputFun(el) {
                    $("#caption").html("工程规范");
                    keyWord = el.value.replace(/^\s*|\s*$/g, "");  //去除头尾空格后的输入框值
                    if (keyWord === "") {
                        return false;
                    } else {
                        var dataTab = searchByRegExp(keyWord, allData);
                        addDataTab(dataTab);
                        changeParentEleHeight(".date-left", ".date-right");
                    }
                }

                /*
                * @descrition 正则匹配 ，不区分大小写
                * @param {string} keyWord 要匹配的关键词
                * @param {string} dataArr 从哪里取出数据进行匹配
                * */
                function searchByRegExp(keyWord, dataArr) {

                    var array = [];
                    var keywordNew = keyWord.replace(/\(/g, "\\(").replace(/\)/g, "\\)"); //针对搜索关键词中有括号的情况，先将括号转换成正则能识别的英文括号
                    var keywordNew1 = keyWord.replace(/\(/g, "\uff08").replace(/\)/g, "\uff09");  //将关键词包含的英文括号转变成中文括号再进行匹配
                    var keywordNew2 = keyWord.replace(/\uff08/g, "\\(").replace(/\uff09/g, "\\)");  //将关键词包含的中文括号转变成正则能识别的英文括号再进行匹配
                    var reg = new RegExp(keywordNew, "i");
                    var reg1 = new RegExp(keywordNew1, "i");
                    try {
                        var reg2 = new RegExp(keywordNew2, "i");
                    } catch (e) {
                        reg2 = new RegExp(keywordNew1, "i");
                    }

                    for (var i = 0; i < allData.length; i++) {
                        if (allData[i].staName.match(reg) || allData[i].staName.match(reg1) || allData[i].staName.match(reg2)) {
                            array.push(allData[i]);
                        }
                    }
                    return array;
                }
            }
        });
    }

    //监听屏幕大小发生变化函数
    window.onresize = function () {
        changeParentEleHeight(".date-left", ".date-right");
        var bottomNav = $("#hide-bottomNav");

        //当屏幕宽度小于768px时设置底边footer部分距离底部的距离
        if ($(window).width() <= 768) {
            $("footer").css("margin-bottom", $(bottomNav).innerHeight());
            console.log("5");
        } else {
            $("footer").css("margin-bottom", 0)
        }
    };

    tabData(12, "waterage");

    /*@description 给侧边栏、底边栏添加点击事件并更改表格的标题*/
    (function () {
        var dateLeftLis = $(".date-left>ul>li:not(.clearfix)");
        var hide_bottomNavLis = $("#hide-bottomNav>ul>li");

        for (var j = 0; j < hide_bottomNavLis.length; j++) {
            $(hide_bottomNavLis[j]).on("click", function () {
                changeTable(this, "div");
            });
        }
        for (var i = 0; i < dateLeftLis.length; i++) {
            $(dateLeftLis[i]).on("click", function (i) {
                changeTable(this, "span");
            });
        }

        function changeTable(el, childrenEl) {
            var dataName;  //保存要加载的数据
            var title = el.getElementsByTagName(childrenEl)[0].innerHTML;  //保存要加载的标题
            title = (title.length >= 4 ? (title.replace(/规范/, "工程规范")) : title + "工程规范");

            $("#caption").html(title);
            if (childrenEl === "div") {
                switch ($(el).index()) {
                    case 0:
                        dataName = "waterage";
                        break;
                    case 1:
                        dataName = "irrigation";
                        break;
                    case 2:
                        dataName = "railway";
                        break;
                    case 3:
                        dataName = "power";
                        break;
                    case 4:
                        dataName = "roadBridge";
                        break;
                    case 5:
                        dataName = "aviation";
                        break;
                    case 6:
                        dataName = "materials";
                        break;
                }
            } else {
                switch ($(el).index()) {
                    case 1:
                        dataName = "waterage";
                        break;
                    case 2:
                        dataName = "irrigation";
                        break;
                    case 3:
                        dataName = "railway";
                        break;
                    case 4:
                        dataName = "power";
                        break;
                    case 5:
                        dataName = "roadBridge";
                        break;
                    case 6:
                        dataName = "aviation";
                        break;
                    case 7:
                        dataName = "materials";
                        break;
                }
            }
            tabData(12, dataName);
        }
    })();
    //底部导航栏内容区所占宽度自适应
    (function () {
        var bottomNav = $("#hide-bottomNav");

        //当屏幕宽度小于768px时设置底边footer部分距离底部的距离
        if ($(window).width() <= 768) {
            $("footer").css("margin-bottom", $(bottomNav).innerHeight());
        } else {
            $("footer").css("margin-bottom", 0)
        }

        $("#slideToggle").on({
            click: function () {
                var bgImg = $(this).css("backgroundImage").replace('url(', '').replace(')', '').split("/").slice(-1);
                $("#hide-bottomNav>ul>li[class*='hide']").slideToggle("slow");
                console.log(bgImg);
                if (bgImg == "down.png\"") {
                    $(this).css({
                        "background": 'url("./images/norm/up.png") center no-repeat',
                        "backgroundSize": "contain"
                    });
                } else {
                    $(this).css({
                        "background": 'url("./images/norm/down.png") center no-repeat',
                        "backgroundSize": "contain"
                    });
                }
            }
        })

    })();

    /*@description 侧边栏菜单鼠标进入/离开事件*/
    (function () {
        //鼠标进入侧边栏菜单事件
        $(".date-left>ul>li").on({
            mouseover : function () {
                var liObjIndex = $(this).index();
                var imgObj = $(this).children()[0].children[0]; //标签图片
                var hideNavObj = $(this).children()[1];

                $(".date-left>ul>li").eq(liObjIndex - 1).css("border-bottom", "none");
                $(this).css("border-bottom", "none");
                switch (liObjIndex) {
                    case 1:
                        $(imgObj).attr("src", "./images/norm/1change.png");
                        $(hideNavObj).css("top", liObjIndex * 70);  //设置隐藏侧边栏距离顶部的高度
                        break;
                    // $(hideNavObj).show();  //显示侧边栏
                    case 2:
                        $(imgObj).attr("src", "./images/norm/2change.png");
                        break;
                    case 3:
                        $(imgObj).attr("src", "./images/norm/3change.png");
                        break;
                    case 4:
                        $(imgObj).attr("src", "./images/norm/4change.png");
                        break;
                    case 5:
                        $(imgObj).attr("src", "./images/norm/5change.png");
                        break;
                    case 6:
                        $(imgObj).attr("src", "./images/norm/6change.png");
                        break;
                    case 7:
                        $(imgObj).attr("src", "./images/norm/7change.png");
                        break;
                }
            },
            mouseleave : function () {
                var liObjIndex = $(this).index();
                var imgObj = $(this).children()[0].children[0];  //图片
                var hideNavObj = $(this).children()[1];

                $(".date-left>ul>li").eq(liObjIndex - 1).css("border-bottom", "1px solid #ccc");
                $(this).css("border-bottom", "1px solid #ccc");
                switch (liObjIndex) {
                    case 1:
                        $(imgObj).attr("src", "./images/norm/1.png");
                        $(hideNavObj).hide();
                        break;
                    case 2:
                        $(imgObj).attr("src", "./images/norm/2.png");
                        break;
                    case 3:
                        $(imgObj).attr("src", "./images/norm/3.png");
                        break;
                    case 4:
                        $(imgObj).attr("src", "./images/norm/4.png");
                        break;
                    case 5:
                        $(imgObj).attr("src", "./images/norm/5.png");
                        break;
                    case 6:
                        $(imgObj).attr("src", "./images/norm/6.png");
                        break;
                    case 7:
                        $(imgObj).attr("src", "./images/norm/7.png");
                        break;
                }
            }
        });

        if ($(window).width() <= 768) {
            var carSpanOne = $("#carousel-span span:nth-child(1)");
            var carSpanTwo = $("#carousel-span span:nth-child(2)");
            carSpanOne.removeClass("out-left");
            carSpanOne.addClass("over-left");
            carSpanTwo.removeClass("out-right");
            carSpanTwo.addClass("over-right");
        }
    })();
});