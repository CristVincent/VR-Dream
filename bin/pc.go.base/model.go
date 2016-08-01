package base

import (
	"time"
)

///////////////基础结构
type PageInfo struct {
	Page, PageSize, PageCount, TotalCount int
	Items                                 interface{}
}

type UserLoginInfo struct {
	UserName, UserPassword string
}

type StatusInfo struct {
	Value       int
	Description string
}

type BaseTaskAction struct {
	TaskId int
}

type TaskAction struct {
	BaseTaskAction
	UserId   uint
	UserName string
}

type TaskActionMessage struct {
	Status  int
	Message string
}

type PagePost struct {
	PageIndex  int
	PageSize   int
	TaskStatus int
	SearchKey  string
	UserId     int
}

type Model struct {
	Id        uint      `gorm:"primary_key"`
	CreatedAt time.Time `json:"-"`
}
type RowInfo struct {
	Model
	Index int `sql:"-"` // Ignore this field
}

type TaskInfoDetail struct {
	Task       TaskInfo
	HandleList []TaskHandleInfo
	FileList   []TaskFiles
}

///////////////表结构
type TaskInfo struct {
	RowInfo
	Name            string `sql:"size:255"`
	Description     string `sql:"size:1000"`
	Detail          string `sql:"size:1000"`
	Fee             float32
	PublicUserName  string
	PublicUserId    uint
	PublicTime      time.Time `json:"-"`
	PublicTimeStr   string    `sql:"-"` // Ignore this field
	TaskStatus      int
	TaskStatusStr   string    `sql:"-"` // Ignore this field
	AcceptedTime    time.Time `json:"-"`
	AcceptedTimeStr string    `sql:"-"` // Ignore this field
	AcceptedUser    string
	AcceptedUserId  uint
	FinishTime      time.Time `json:"-"`
	FinishTimeStr   string    `sql:"-"` // Ignore this field
	FeeStatus       int
	FeeStatusStr    string    `sql:"-"` // Ignore this field
	FeeTime         time.Time `json:"-"`
	FeeTimeStr      string    `sql:"-"` // Ignore this field
	Remark          string    `sql:"size:500"`
}

type TaskHandleInfo struct {
	RowInfo
	TaskId        uint
	UserId        uint
	UserName      string `sql:"size:50"`
	Status        int
	Action        string `sql:"size:100"`
	Remark        string `sql:"size:500"`
	HandleTime    time.Time
	HandleTimeStr string `sql:"-"` // Ignore this field
}

type TaskFiles struct {
	RowInfo
	TaskId        uint
	UserId        uint
	UserName      string `sql:"size:50"`
	FileName      string `sql:"size:100"`
	Url           string `sql:"size:500"`
	HandleTime    time.Time
	HandleTimeStr string `sql:"-"` // Ignore this field
}

type UserInfo struct {
	RowInfo
	UserName  string `sql:"size:50"`
	Password  string `sql:"size:50"`
	Telephone string `sql:"size:20"`
	Email     string `sql:"size:50"`
	Type      string `sql:"size:50"`
}
