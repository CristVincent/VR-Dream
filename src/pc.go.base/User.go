package base

import (
	"github.com/ant0ine/go-json-rest/rest"
	"log"
	"strings"
)

type User struct {
	BaseServer
}

func (u *User) UserLogin(w rest.ResponseWriter, r *rest.Request) {
	println("Request ", r.URL.Path, " fromasdasdsa ", r.RemoteAddr)
	w.Header().Set("Access-Control-Allow-Origin", "*")//允许访问所有域
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")//header的类型
	w.Header().Add("Access-Control-Allow-Methods", "GET,POST,OPTION")//header的类型
	w.Header().Set("content-type","application/json")//返回数据格式是json

	userInfo := UserInfo{}
	loginInfo := UserLoginInfo{}
	err := r.DecodeJsonPayload(&loginInfo)
	if err != nil {
		userInfo.Id = 0
		userInfo.UserName = "数据异常"
	}
	log.Println("UserLogin:", loginInfo)
	if err := u.ImplInstance.DB.Where(UserInfo{UserName: loginInfo.UserName}).First(&userInfo).Error; err != nil {
		userInfo = UserInfo{}
		userInfo.Id = 0
		userInfo.UserName = "用户不存在"
	}
	if !strings.EqualFold(userInfo.Password, loginInfo.UserPassword) {
		userInfo = UserInfo{}
		userInfo.Id = 0
		userInfo.UserName = "用户名或者密码错误"
	}
	userInfo.Password = ""
	w.WriteJson(userInfo)
}

func (u *User) RegUser(w rest.ResponseWriter, r *rest.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	log.Println("RegUser")
	userInfo := UserInfo{}
	err := r.DecodeJsonPayload(&userInfo)
	if err != nil {
		userInfo.Id = 0
		userInfo.UserName = "数据异常"
	}

	if err := u.ImplInstance.DB.Where("UserName = ?", userInfo.UserName).First(&userInfo).Error; err == nil {
		//已经存在用户
		userInfo.Id = 0
		userInfo.UserName = "用户名已存在"
	} else {
		u.ImplInstance.DB.Create(&userInfo)
	}

	w.WriteJson(userInfo)
}

/*
import (
	"fmt"
	"github.com/ant0ine/go-json-rest/rest"
	"log"
	"net/http"
	"sync"
)

type User struct {
	Id   string
	Name string
}

type Users struct {
	BaseServer
	sync.RWMutex
	Store map[string]*User
}

func (u *Users) GetAllUsers(w rest.ResponseWriter, r *rest.Request) {
	log.Printf("GetAllUsers")
	u.RLock()
	users := make([]User, len(u.Store))
	i := 0
	for _, user := range u.Store {
		users[i] = *user
		i++
	}
	u.RUnlock()
	w.WriteJson(&users)
}

func (u *Users) GetUser(w rest.ResponseWriter, r *rest.Request) {
	id := r.PathParam("id")
	u.RLock()
	var user *User
	if u.Store[id] != nil {
		user = &User{}
		*user = *u.Store[id]
	}
	u.RUnlock()
	if user == nil {
		rest.NotFound(w, r)
		return
	}
	w.WriteJson(user)
}

func (u *Users) PostUser(w rest.ResponseWriter, r *rest.Request) {
	user := User{}
	err := r.DecodeJsonPayload(&user)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	u.Lock()
	id := fmt.Sprintf("%d", len(u.Store)) // stupid
	user.Id = id
	u.Store[id] = &user
	u.Unlock()
	w.WriteJson(&user)
}

func (u *Users) PutUser(w rest.ResponseWriter, r *rest.Request) {
	id := r.PathParam("id")
	u.Lock()
	if u.Store[id] == nil {
		rest.NotFound(w, r)
		u.Unlock()
		return
	}
	user := User{}
	err := r.DecodeJsonPayload(&user)
	if err != nil {
		rest.Error(w, err.Error(), http.StatusInternalServerError)
		u.Unlock()
		return
	}
	user.Id = id
	u.Store[id] = &user
	u.Unlock()
	w.WriteJson(&user)
}

func (u *Users) DeleteUser(w rest.ResponseWriter, r *rest.Request) {
	id := r.PathParam("id")
	u.Lock()
	delete(u.Store, id)
	u.Unlock()
	w.WriteHeader(http.StatusOK)
}
*/
