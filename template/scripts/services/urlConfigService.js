/******************************************************************

* Copyright (C): 北京泰合佳通信息技术有限公司广东分公司

* 创建人: 林俊杰

* 创建时间: 2015年5月7日

******************************************************************/

define(['./module'],
function (services) {
    services.service('urlConfigService',
    function () {

        return {
            taskStatusAction: "api/Status/GetTaskStatus",//任务管理-右上角-任务状态过滤
            feeStatusAction:"api/Status/GetFeeStatus",//任务管理-发布任务-付款状态
            stepStatusAction: "api/Status/GetStepStatus",//我的任务-右上角-当前环节过滤

            taskManageAction: "api/Task/TaskManageData",//任务管理-任务列表数据
            getTaskDataAction: "api/Task/GetTaskData",//领取任务-任务列表数据
            myTaskAction: "api/Task/MyTaskData",//我的任务-任务列表数据            
            taskSaveAction: "api/Task/TaskSaveAction",//任务管理-发布任务保存地址     

            loginAction: "api/User/UserLogin",//登录
            registerAction: "api/User/UserReg",//注册
       
            getTaskAction: "api/Task/GetTaskAction",//领取任务-任务列表数据-领取按钮
            taskInfoDetail:"api/Task/GetTaskInfoDetail",//任务详情
            
            taskAction: "api/Task/TaskAction",//动作
            taskFeeAction: "api/Task/TaskFeeAction",//支付

            uploadAction: "upload",//任务管理-新增任务-上传,任务管理-详情-上传
            taskFileAction:"api/Task/TaskFileAction",//动作
        };
    });
});