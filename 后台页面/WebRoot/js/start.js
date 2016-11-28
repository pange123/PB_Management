// JavaScript Document
$(document).ready(function() {
    ////数据格式{planstime:"2016-12-1",planetime:"2016-12-30",rentstime:"2016-12-30",rentetime:"2017-12-30"}//////////
    laydate.skin('yalan'); //切换皮肤，请查看skins下面皮肤库
    laydate({
        elem: '#demo'
    }); //绑定元素
    laydate({
        elem: '#demo2'
    });
    laydate({
        elem: '#demo3'
    });
    laydate({
        elem: '#demo4'
    });
    $.ajax({ //页面加载时自动执行
        type: 'POST',
        dataType: 'json',
        url: 'getBase_deptInfo.do', ///修改此处
        async: false,
        cache: false,
        error: function(request) {
            bootbox.alert({
                message: "加载区域失败",
                size: 'small'
            });
            return false;
        },
        success: function(data) {
            var i = 0;
            var planstime = data.planstime;
            var planetime = data.planetime;
            var rentstime = data.rentstime;
            var rentetime = data.rentetime;
            if (planstime == '') {
                $("#start").show();
                $("#set").hide();
            } else {
                $("#start").hide();
                $("#set").show();
                $('#demo').val(planstime);
                $('#demo2').val(planetime);
                $('#demo').val(rentstime);
                $('#demo2').val(rentetime);
            }

        }
    });

    $("#start-btn").click(function() {
        $('#demo').val('');
        $('#demo2').val('');
        $('#demo').val('');
        $('#demo2').val('');
        $("#start").hide();
        $("#set").show();
    });

    function toDate(str) {
        var sd = str.split("-");
        return new Date(sd[0], sd[1], sd[2]);
    }


    $(document).on("click", "#save", function() {

        var planstime = $("#demo").val();
        var planetime = $("#demo2").val();
        var rentstime = $("#demo3").val();
        var rentetime = $("#demo4").val();
        if (planstime == "") {
            bootbox.alert({
                message: "请选择申请开始时间!",
                size: 'small'
            });
        } else if (planetime == "") {
            bootbox.alert({
                message: "请选择申请结束时间!",
                size: 'small'
            });
        } else if (rentstime == "") {
            bootbox.alert({
                message: "请选择租赁开始时间!",
                size: 'small'
            });
        } else if (rentetime == "") {
            bootbox.alert({
                message: "请选择租赁结束时间!",
                size: 'small'
            });
        } else {
            var planstime_data = toDate(planstime);
            var planetime_data = toDate(planetime);
            var rentstime_data = toDate(rentstime);
            var rentetime_data = toDate(rentetime);
            if ((planstime_data > planetime_data) || (rentstime_data > rentetime_data)) {
                bootbox.alert({
                    message: "日期时间段选择错误",
                    size: 'small'
                });
                return false;
            }
            var str = '';
            str = '{planstime:"' + planstime + '",planetime:"' + planetime + '",rentstime:"' + rentstime + '",rentetime:"' + rentetime + '"}';
            ////数据格式{planstime:"2016-12-1",planetime:"2016-12-30",rentstime:"2016-12-30",rentetime:"2017-12-30"}//////////

            $.ajax({ //以文本方式提交申请
                type: 'POST',
                dataType: 'text',
                data: {
                    "str": str
                },
                url: 'submitLandApply.do', //修改此处
                async: false,
                cache: false,
                error: function(request) {
                    obj.dialog = bootbox.alert({
                        message: "网络故障，请稍后重试",
                        size: 'small'
                    });
                    return false;
                }, ///error
                success: function(data) {
                        obj.dialog = bootbox.alert({
                            message: "设置成功！",
                            size: 'small'
                        });
                    } //success
            }); //ajax


        }
    });

    $("#end-btn").click(function() {

        bootbox.confirm({
            size: "small",
            message: "确定结束本次租赁工作吗?",
            callback: function(result) {
                if (result == false) {
                    return false;
                } else {
                    $.ajax({ //以文本方式提交申请,command=1表示结束土地租赁工作，清空土地租赁申请表，清空消息表
                        type: 'POST',
                        dataType: 'text',
                        data: {
                            "command": "1"
                        },
                        url: 'submitLandApply.do', //修改此处
                        async: false,
                        cache: false,
                        error: function(request) {
                            alert('网络故障，请稍后重试');
                        }, ///error
                        success: function(data) {
                                alert('土地租赁工作结束');
                                $("#start").show();
                                $("#set").hide();
                            } //success
                    });
                }
            }
        });

    });
});
