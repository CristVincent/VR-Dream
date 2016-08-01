package base

import (
	"github.com/ant0ine/go-json-rest/rest"
	"log"
)

type Status struct {
	BaseServer
}

const (
	AllStatus = 100
)

func (s *Status) FeeStatus() [2]StatusInfo {
	statusList := [...]StatusInfo{
		StatusInfo{Value: 0, Description: "未付款"},
		StatusInfo{Value: 1, Description: "已付款"},
	}
	return statusList
}

func (s *Status) TaskStatus() [7]StatusInfo {
	statusList := [...]StatusInfo{
		StatusInfo{Value: AllStatus, Description: "全部"},
		StatusInfo{Value: 0, Description: "已发布"},
		StatusInfo{Value: 1, Description: "已接单"},
		StatusInfo{Value: 2, Description: "回退"},
		StatusInfo{Value: 3, Description: "审核中"},
		StatusInfo{Value: 4, Description: "审核未通过"},
		StatusInfo{Value: 5, Description: "审核完成"},
	}
	return statusList
}

func (s *Status) StepStatus() [6]StatusInfo {
	statusList := [...]StatusInfo{
		StatusInfo{Value: AllStatus, Description: "全部"},
		StatusInfo{Value: 1, Description: "已接单"},
		StatusInfo{Value: 2, Description: "回退"},
		StatusInfo{Value: 3, Description: "审核中"},
		StatusInfo{Value: 4, Description: "审核未通过"},
		StatusInfo{Value: 5, Description: "审核完成"},
	}
	return statusList
}

//curl -i http://127.0.0.1:8080/api/Status/GetFeeStatus
func (s *Status) GetFeeStatus(w rest.ResponseWriter, r *rest.Request) {
	log.Printf("web 服务结束")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	statusList := s.FeeStatus()
	w.WriteJson(statusList)
	log.Printf("web 服务结束")
}

//curl -i http://127.0.0.1:8080/api/Status/GetTaskStatus
func (s *Status) GetTaskStatus(w rest.ResponseWriter, r *rest.Request) {
	println("Request ", r.URL.Path, " from ", r.RemoteAddr)
	w.Header().Set("Access-Control-Allow-Origin", "*")//允许访问所有域
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")//header的类型
	w.Header().Set("content-type","application/json")//返回数据格式是json
	statusList := s.TaskStatus()
	w.WriteJson(statusList)
}

//curl -i http://127.0.0.1:8080/api/Status/GetTaskStatus
func (s *Status) GetStepStatus(w rest.ResponseWriter, r *rest.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	statusList := s.StepStatus()
	w.WriteJson(statusList)
}
