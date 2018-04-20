var app = getApp();
Page({
    data: {
        organizations: [
            "常用",
            "校区综合办",
            "校区工会",
            "校区组织人事部",
            "校区学生处",
            "校区团工委",
            "校区教务处",
            "校区财务处",
            "校区校园管理处",
            "公安保卫处",
            "校医院",
            "研究生学院",
            "工商管理学院",
            "软件学院",
            "电子与信息工程学院",
            "电气与控制工程学院",
            "营销管理学院",
            "矿业技术学院",
            "安全科学与工程学院",
            "图书馆",
            "葫芦岛校区后勤集团",
            "其他"
        ],
        telephones: [
            // 常用
            [
                {name: '电气维修', tel: '0429-5313621'},
                {name: '门窗维修', tel: '0429-5312747'},
                {name: '上下水维修', tel: '0429-5313622'},
                {name: '宿管科', tel: '0429-5314116'},
                {name: '门窗维修', tel: '0429-5312747'},
                {name: '暖气维修', tel: '0429-5313623'},
                {name: '电费查询/后勤服务热线', tel: '0429-5313352'},
                {name: '暖气维修负责人', tel: '13591999775'},
                {name: '校园报警', tel: '13591998110'},
                {name: '送水', tel: '13591990794'},
            ],
            // 校区综合办
            [
                {name: '主任室', tel: '0429-5310160'},
                {name: '办公室', tel: '0429-5310147'},

            ],
            //校区工会
            [
                {name: '主席办公室', tel: '0429-5310158'},
                {name: '主任室', tel: '0429-5310160'}
            ],
            //校区组织人事部
            [
                {name: '部长室', tel: '0429-5310036'},
                {name: '组织科', tel: '0429-5310037'},
                {name: '人事科', tel: '0429-5310038'},
                {name: '宣传科', tel: '0429-5310039'}
            ],
            //校区学生处
            [
                {name: '副处长室(就业）', tel: '0429-5310255'},
                {name: '副处长室(公寓）', tel: '0429-5310252'},
                {name: '学生教育管理科', tel: '0429-5310256'},
                {name: '公寓学生教育服务中心', tel: '0429-5310259'},
                {name: '大学生心理健康发展中心', tel: '0429-5310257'},
                {name: '大学生就业指导服务中心', tel: '0429-5310260'}
            ],
            //校区团工委
            [
                {name: '书记室', tel: '0429-5310130'},
                {name: '大学生素质拓展中心', tel: '0429-5310136'},
                {name: '办公室', tel: '0429-5310131'}
            ],
            //校区教务处
            [
                {name: '处长室(305室)', tel: '0429-5110305'},
                {name: '副处长室(304室)', tel: '0429-5110306'},
                {name: '副处长室(304室)', tel: '0429-5110307'},
                {name: '综合科(201室)', tel: '0429-5110308'},
                {name: '综合科(202室)', tel: '0429-5110309'},
                {name: '教务科(207室)', tel: '0429-5110310'},
                {name: '考试中心(206室)', tel: '0429-5110311'},
                {name: '教学研究与质量科(301室)', tel: '0429-5110312'},
                {name: '实践教学科(303室)', tel: '0429-5110313'},
                {name: '教材管理中心(100室)', tel: '0429-5110315'},
                {name: '督导室(203室)', tel: '0429-5110316'},
                {name: '玉龙校园办公室(办公楼208室)', tel: '0429-5110318'}
            ],
            //校区财务处
            [
                {name: '处长室', tel: '0429-5310311'},
                {name: '事业财务科', tel: '0429-5310316'},
                {name: '财务管理科(1)', tel: '0429-5310317'},
                {name: '财务管理科(2)', tel: '0429-5310318'},
                {name: '教学运行科', tel: '0429-5310186'},
                {name: '教学建设与实践科', tel: '0429-5310190'}
            ],
            //校区校园管理处
            [
                {name: '处长室', tel: '0429-5310366'},
                {name: '副处长室', tel: '0429-5312176'},
                {name: '综合科', tel: '0429-5310369'},
                {name: '水电科', tel: '0429-5310367'},
                {name: '房地产科', tel: '0429-5310370'},
                {name: '办公室', tel: '0429-5310368'},
                {name: '宿舍管理值班室', tel: '0429-5314116'}
            ],
            //公安保卫处
            [
                {name: '处长室', tel: '0429-5310348'},
                {name: '治安消防科', tel: '0429-5310358'},
                {name: '治安消防科', tel: '0429-5310345'},
                {name: '治安消防科', tel: '0429-5310346'},
                {name: '报警电话', tel: '13591998110'},
                {name: '消防控制室', tel: '0429-5310119'},
                {name: '警务室值班电话', tel: '0429-5310110'}
            ],
            //校医院
            [
                {name: '处长室', tel: '0429-5310348'},
                {name: '白天值班电话', tel: '0429-5312104'},
                {name: '夜间值班电话', tel: '0429-5312101'}
            ],
            //研究生学院
            [
                {name: '综合办公室', tel: '0429-5310481'}
            ],
            //工商管理学院
            [
                {name: '书记室', tel: '0429-5310606'},
                {name: '副书记室', tel: '0429-5310589'},
                {name: '院长室', tel: '0429-5310604'},
                {name: '副书记室', tel: '0429-5310589'},
                {name: '副院长室', tel: '0429-5310593'},
                {name: '副院长室', tel: '0429-5310588'},
                {name: '副院长室', tel: '0429-5310592'},
                {name: '办公室', tel: '0429-5310605'},
                {name: '教务科', tel: '0429-5310590'},
                {name: '研究生管理科', tel: '0429-5310591'},
                {name: '学生工作部', tel: '0429-5310608'},
                {name: '团委', tel: '0429-5310599'},
                {name: '经济管理系', tel: '0429-5310581'},
                {name: '经济贸易系', tel: '0429-5310603'},
                {name: '投资系', tel: '0429-5310602'},
                {name: '会计系', tel: '0429-5310584'},
                {name: '信管系', tel: '0429-5310597'},
                {name: '会计实验室', tel: '0429-5310585'}
            ],
            //软件学院
            [
                {name: '书记室', tel: '0429-5310868'},
                {name: '副书记室', tel: '0429-5310866'},
                {name: '院长室', tel: '0429-5310858'},
                {name: '副院长室', tel: '0429-5310878'},
                {name: '办公室', tel: '0429-5310880'},
                {name: '团委', tel: '0429-5310833'},
                {name: '学生工作部', tel: '0429-5310850'},
                {name: '教务科', tel: '0429-5310860'},
                {name: '嵌人式软件系', tel: '0429-5310831'},
                {name: '觉支部', tel: '0429-5310877'}
            ],
            //电子与信息工程学院
            [
                {name: '书记室', tel: '0429-5310968'},
                {name: '副书记室', tel: '0429-5310931'},
                {name: '院长室', tel: '0429-5310966'},
                {name: '副院长室', tel: '0429-5310932'},
                {name: '办公室', tel: '0429-5310933'},
                {name: '团委', tel: '0429-5310936'},
                {name: '学生工作部', tel: '0429-5310531'},
                {name: '学生党支部', tel: '0429-5310791'},
                {name: '教务科', tel: '0429-5310934'},
                {name: '学生会', tel: '0429-5310937'},
                {name: '通信教研室', tel: '0429-2490632'},
                {name: '应用电子教研室', tel: '0429-2492610'}
            ],
            //电气与控制工程学院
            [
                {name: '书记室', tel: '0429-5310889'},
                {name: '副书记室', tel: '0429-5310890'},
                {name: '院长室', tel: '0429-5310888'},
                {name: '副院长室', tel: '0429-5310892'},
                {name: '调研员室', tel: '0429-5310893'},
                {name: '办公室', tel: '0429-5310894'},
                {name: '团委', tel: '0429-5310896'},
                {name: '学生工作部', tel: '0429-5310898'},
                {name: '科研研究生科', tel: '0429-5310899'},
                {name: '教务科', tel: '0429-5310895'},
                {name: '控制理论与控制工程研究所', tel: '0429-5310900'},
                {name: '测控技术与自动化装置研究所', tel: '0429-5310901'},
                {name: '电力系统与自动化研究所', tel: '0429-5310902'},
                {name: '电工理论与新技术研究', tel: '0429-5310903'},
                {name: '电气工程与自动化实验中心', tel: '0429-5310906'},
                {name: '电力电子与电机电器研究所', tel: '0429-5310905'},
                {name: '电工学研究所', tel: '0429-5310904'},
                {name: '电工电子实验中心', tel: '0429-5310907'}
            ],
            //营销管理学院
            [
                {name: '书记室', tel: '0429-5310570'},
                {name: '副书记室', tel: '0429-5310069'},
                {name: '院长室', tel: '0429-5311211'},
                {name: '办公室', tel: '0429-5310121'},
                {name: '学生工作部', tel: '0429-5311005'}
            ],
            //矿业技术学院
            [
                {name: '书记室', tel: '0429-5310560'},
                {name: '副书记室', tel: '0429-5310069'},
                {name: '院长室', tel: '0429-5310558'},
                {name: '办公室', tel: '0429-5310568'},
                {name: '学生工作部', tel: '0429-5310569'}
            ],
            //安全科学与工程学院
            [
                {name: '学生工作部', tel: '0429-5310566'}
            ],
            //图书馆
            [
                {name: '科技査新检索室', tel: '0429-5310012'},
                {name: '社科书库室', tel: '0429-5310381'},
                {name: '科技书库1', tel: '0429-5310382'},
                {name: '科技书库2', tel: '0429-5310389'},
                {name: '现刊阅览室', tel: '0429-5310385'}
            ],
            //葫芦岛校区后勤集团
            [
                {name: '总经理室', tel: '0429-5312309'},
                {name: '副总经理室', tel: '0429-5310288'},
                {name: '副总经理室', tel: '0429-5310286'},
                {name: '副总经理室', tel: '0429-5312176'},
                {name: '办公室', tel: '0429-5310000'},
                {name: '财务部', tel: '0429-5310299'},
                {name: '维修服务热线', tel: '0429-8355585'},
                {name: '车票销售、电费收缴', tel: '0429-5310300'}
            ],
            //其他
            [
                {name: '四家派出所', tel: '0429-5410625'},
                {name: '钓鱼台派出所', tel: '0429-5419666'},
                {name: '儒园餐厅', tel: '0429-5311450'},
                {name: '怡园餐厅', tel: '0429-5310294'},
                {name: '移动营业厅', tel: '13898294146'},
                {name: '网通营业厅', tel: '0429-5312222'},
                {name: '铁通营业厅', tel: '0429-2490000'},
                {name: '邮政营业厅', tel: '0429-5310699'},
                {name: '尔雅楼西门卫', tel: '0429-5311441'},
                {name: '尔雅楼东门卫', tel: '0429-5311442'},
                {name: '耘慧楼西门卫', tel: '0429-5311448'},
                {name: '清荷公寓A1座门卫', tel: '0429-5313342'},
                {name: '清荷公寓A2座门卫', tel: '0429-5312038'},
                {name: '清荷公寓A3座门卫', tel: '0429-5312059'},
                {name: '清荷公寓B1座门卫', tel: '0429-5312664'},
                {name: '清荷公寓B2座门卫', tel: '0429-5312693'},
                {name: '清荷公寓B3座门卫', tel: '0429-5312746'},
                {name: '清莲公寓C1座门卫', tel: '0429-5313624'},
                {name: '清莲公寓C2座门卫', tel: '0429-5313625'},
                {name: '清莲公寓D1座门卫', tel: '0429-5313629'},
                {name: '清莲公寓D2座门卫', tel: '0429-5313630'},
                {name: '清莲公寓E1座门卫', tel: '0429-2492926'},
                {name: '清莲公寓E2座门卫', tel: '0429-2493110'},
                {name: '清莲公寓E3座门卫', tel: '0429-2493359'},
                {name: '建行卡咨询', tel: '0429-5152176'}
            ]
        ],
        currentTels: null,
        searchResultVisible: false,
        inputShowed: false,
        inputVal: ""
    },
    onLoad: function (options) {
        var that = this;
        app.mta.Page.init();
        // that.inputOrgs();
    },
    viewTelDetail: function (e) {
        var that = this;
        app.currentOrg = that.data.organizations[e.currentTarget.dataset.org];
        app.currentTels = that.data.telephones[e.currentTarget.dataset.org];
        app.navigateToPage("/pages/module/others/serviceTel/serviceTelDetail/serviceTelDetail");
    },
    // 查询框处理事件
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false,
            currentTels: null,
            searchResultVisible: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    //查询电话
    inputOrgs: function (e) {
        var that = this;
        // 输入内容
        var searchValue = e.detail.value;
        // var searchValue = '自动化';
        var tels = that.data.telephones;
        var orgs = that.data.organizations;
        if (searchValue.length > 0) {
            //查询结果
            var searchResult = [];
            for (var i = 0; i < tels.length; i++) {
                for (var j = 0; j < tels[i].length; j++) {
                    //拼接组织和部门电话
                    var telephoneDetail = {};
                    telephoneDetail.name = orgs[i] + " " + tels[i][j].name;
                    telephoneDetail.tel = tels[i][j].tel;
                    if (telephoneDetail.name.indexOf(searchValue) > -1) {
                        searchResult.push(telephoneDetail);
                    }
                }
            }

            if (searchResult.length > 0) {
                that.setData({
                    currentTels: searchResult,
                    searchResultVisible: true,
                })
            } else {
                that.setData({
                    currentTels: null,
                    searchResultVisible: true,
                })
            }
        } else {
            that.setData({
                currentTels: null,
                searchResultVisible: false
            })
        }
    },
    // 拨打电话
    callTel: function (e) {
        var that = this;
        wx.showModal({
            content: '是否拨打' + e.currentTarget.dataset.name
            + "电话:\n" + e.currentTarget.dataset.tel,
            success: function (res) {
                if (res.confirm) {
                    //拨打电话
                    wx.makePhoneCall({
                        phoneNumber: e.currentTarget.dataset.tel
                    })
                }
            }
        })
    },
})