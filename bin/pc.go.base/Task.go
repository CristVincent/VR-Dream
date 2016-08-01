package base

import (
	"github.com/ant0ine/go-json-rest/rest"
	"log"
	"net/http"
	"strconv"
	"time"
)

type Task struct {
	BaseServer
}

//任务管理列表
func (t *Task) TaskManageData(w rest.ResponseWriter, r *rest.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	post := PagePost{}
	err := r.DecodeJsonPayload(&post)
	if err != nil {
		w.WriteJson(err)
		return
	}
	where := "1 = 1"

	if len(post.SearchKey) > 0 {
		where = where + " And name like '%" + post.SearchKey + "%'"
	}

	if post.TaskStatus != AllStatus {
		where = where + " And task_status = " + strconv.Itoa(post.TaskStatus)
	}

	if post.UserId > 0 {
		where = where + " And accepted_user_id = " + strconv.Itoa(post.UserId)
	}

	var count int
	t.ImplInstance.DB.Model(TaskInfo{}).Where(where).Count(&count)

	page := PageInfo{}
	page.Page = post.PageIndex
	page.PageSize = post.PageSize
	page.TotalCount = count
	page.PageCount = (page.TotalCount / page.PageSize) + 1
	itemlist := []TaskInfo{}
	offset := (page.Page - 1) * page.PageSize

	t.ImplInstance.DB.Where(where).Limit(page.PageSize).Offset(offset).Find(&itemlist)
	page.Items = t.FillData(&itemlist, offset+1)
	w.WriteJson(page)
}

func (t *Task) FillData(list *[]TaskInfo, index int) *[]TaskInfo {
	status := Status{}
	mapFeeStatus := make(map[int]string)
	for _, item := range status.FeeStatus() {
		mapFeeStatus[item.Value] = item.Description
	}

	mapTaskStatus := make(map[int]string)
	for _, item := range status.TaskStatus() {
		mapTaskStatus[item.Value] = item.Description
	}

	for i := 0; i < len(*list); i++ {
		(*list)[i].Index = index + i
		(*list)[i].FeeStatusStr = mapFeeStatus[(*list)[i].FeeStatus]
		(*list)[i].TaskStatusStr = mapTaskStatus[(*list)[i].TaskStatus]
		(*list)[i].AcceptedTimeStr = (*list)[i].AcceptedTime.Format("2006-01-02")
		(*list)[i].FinishTimeStr = (*list)[i].FinishTime.Format("2006-01-02")
		(*list)[i].FeeTimeStr = (*list)[i].FeeTime.Format("2006-01-02")
		(*list)[i].PublicTimeStr = (*list)[i].PublicTime.Format("2006-01-02")

		if (*list)[i].AcceptedTimeStr == "0001-01-01" {
			(*list)[i].AcceptedTimeStr = ""
		}
		if (*list)[i].FinishTimeStr == "0001-01-01" {
			(*list)[i].FinishTimeStr = ""
		}
		if (*list)[i].FeeTimeStr == "0001-01-01" {
			(*list)[i].FeeTimeStr = ""
		}
		if (*list)[i].PublicTimeStr == "0001-01-01" {
			(*list)[i].PublicTimeStr = ""
		}
	}

	return list
}

//发布任务保存地址
func (t *Task) TaskSaveAction(w rest.ResponseWriter, r *rest.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	log.Println("TaskSaveAction")
	taskInfo := TaskInfo{}
	taskInfo.PublicTime = time.Now()
	taskInfo.FeeStatus = 0
	taskInfo.TaskStatus = 0
	err := r.DecodeJsonPayload(&taskInfo)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
	}
	t.ImplInstance.DB.Create(&taskInfo)

	handleInfo := TaskHandleInfo{}
	handleInfo.TaskId = taskInfo.Id
	handleInfo.UserId = taskInfo.PublicUserId
	handleInfo.UserName = taskInfo.PublicUserName
	handleInfo.Status = taskInfo.TaskStatus
	handleInfo.Action = "发布任务"
	handleInfo.Remark = ""
	handleInfo.HandleTime = time.Now()
	t.ImplInstance.DB.Create(&handleInfo)

	w.WriteJson(taskInfo)
}

//领取按钮
func (t *Task) GetTaskAction(w rest.ResponseWriter, r *rest.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	log.Println("GetTaskAction")
	taskAction := TaskAction{}
	msg := TaskActionMessage{}

	err := r.DecodeJsonPayload(&taskAction)

	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
	}

	where := "Id = " + strconv.Itoa(taskAction.TaskId) + " And task_status = 0"
	taskInfo := TaskInfo{}
	if err := t.ImplInstance.DB.Where(where).First(&taskInfo).Error; err == nil {
		taskInfo.TaskStatus = 1
		taskInfo.AcceptedTime = time.Now()
		taskInfo.AcceptedUser = taskAction.UserName
		taskInfo.AcceptedUserId = taskAction.UserId
		t.ImplInstance.DB.Save(&taskInfo)

		handleInfo := TaskHandleInfo{}
		handleInfo.TaskId = taskInfo.Id
		handleInfo.UserId = taskAction.UserId
		handleInfo.UserName = taskAction.UserName
		handleInfo.Status = taskInfo.TaskStatus
		handleInfo.Action = "领取任务"
		handleInfo.Remark = ""
		handleInfo.HandleTime = time.Now()
		t.ImplInstance.DB.Create(&handleInfo)

		msg.Status = 1
		msg.Message = "领取成功"

	} else {
		msg.Status = 0
		msg.Message = "当前任务不存在"
	}
	w.WriteJson(msg)
}

//动作按钮
func (t *Task) TaskAction(w rest.ResponseWriter, r *rest.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	log.Println("TurnBackAction")
	taskHandleInfo := TaskHandleInfo{}
	err := r.DecodeJsonPayload(&taskHandleInfo)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
	}

	taskInfo := TaskInfo{}
	if err := t.ImplInstance.DB.Where("Id = ?", taskHandleInfo.TaskId).First(&taskInfo).Error; err == nil {
		taskInfo.TaskStatus = taskHandleInfo.Status
		if taskInfo.TaskStatus == 3 {
			taskInfo.FinishTime = time.Now()
		}
		t.ImplInstance.DB.Save(&taskInfo)
		taskHandleInfo.HandleTime = time.Now()
		t.ImplInstance.DB.Create(&taskHandleInfo)

	} else {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.WriteJson(taskInfo)
}

//支付
func (t *Task) TaskFeeAction(w rest.ResponseWriter, r *rest.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	log.Println("TurnBackAction")
	taskHandleInfo := TaskHandleInfo{}
	err := r.DecodeJsonPayload(&taskHandleInfo)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
	}

	taskInfo := TaskInfo{}
	if err := t.ImplInstance.DB.Where("Id = ?", taskHandleInfo.TaskId).First(&taskInfo).Error; err == nil {
		taskInfo.FeeStatus = taskHandleInfo.Status
		taskInfo.FeeTime = time.Now()
		t.ImplInstance.DB.Save(&taskInfo)

		taskHandleInfo.Status = taskInfo.TaskStatus
		taskHandleInfo.HandleTime = time.Now()
		t.ImplInstance.DB.Create(&taskHandleInfo)

	} else {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.WriteJson(taskInfo)
}

//详情页面
func (t *Task) GetTaskInfoDetail(w rest.ResponseWriter, r *rest.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	log.Println("GetTaskInfoDetail")
	baseTaskAction := BaseTaskAction{}
	err := r.DecodeJsonPayload(&baseTaskAction)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
	}

	taskInfoDetail := TaskInfoDetail{}
	taskInfo := TaskInfo{}
	if err := t.ImplInstance.DB.Where("id = ?", baseTaskAction.TaskId).First(&taskInfo).Error; err == nil {

		itemlist := []TaskHandleInfo{}
		t.ImplInstance.DB.Where("task_id = " + strconv.Itoa(baseTaskAction.TaskId)).Find(&itemlist)

		for i := 0; i < len(itemlist); i++ {
			(itemlist)[i].Index = i + 1
			(itemlist)[i].HandleTimeStr = (itemlist)[i].HandleTime.Format("2006-01-02")
			if (itemlist)[i].HandleTimeStr == "0001-01-01" {
				(itemlist)[i].HandleTimeStr = ""
			}
		}

		filelist := []TaskFiles{}
		t.ImplInstance.DB.Where("task_id = " + strconv.Itoa(baseTaskAction.TaskId)).Find(&filelist)

		for i := 0; i < len(filelist); i++ {
			(filelist)[i].Index = i + 1
			(filelist)[i].HandleTimeStr = (filelist)[i].HandleTime.Format("2006-01-02")
			if (filelist)[i].HandleTimeStr == "0001-01-01" {
				(filelist)[i].HandleTimeStr = ""
			}
		}

		taskInfoDetail.Task = taskInfo
		taskInfoDetail.HandleList = itemlist
		taskInfoDetail.FileList = filelist

		w.WriteJson(taskInfoDetail)
	} else {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

//文件
func (t *Task) TaskFileAction(w rest.ResponseWriter, r *rest.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	log.Println("TaskFileAction")
	taskHandleInfo := TaskHandleInfo{}
	err := r.DecodeJsonPayload(&taskHandleInfo)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
	}

	taskFiles := TaskFiles{}
	taskFiles.TaskId = taskHandleInfo.TaskId
	taskFiles.UserId = taskHandleInfo.UserId
	taskFiles.UserName = taskHandleInfo.UserName
	taskFiles.Url = "/upfile/" + taskHandleInfo.Action
	taskFiles.FileName = taskHandleInfo.Action
	taskFiles.HandleTime = time.Now()
	t.ImplInstance.DB.Create(&taskFiles)

	w.WriteJson(taskFiles)
}
