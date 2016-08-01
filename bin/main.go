package main

import (
	"github.com/ant0ine/go-json-rest/rest"
	"log"
	"net/http"
	"pc.go.base"
	"fmt"
)

func main() {
	conn := "innsmap:innsmap@tcp(10.95.3.101:3306)/gorilla?charset=utf8&parseTime=True"
	port := ":8081"

	api := rest.NewApi()
	api.Use(rest.DefaultDevStack...)
	impl := base.Impl{}
	impl.InitDB(conn)

	/*创建表
	//impl.DB.CreateTable(&server.TaskInfo{})
	//impl.DB.CreateTable(&server.TaskHandleInfo{})965+556
	//impl.DB.CreateTable(&server.UserInfo{})
	//impl.DB.CreateTable(&server.TaskFiles{})

	//创建管理员账号
	//admin := server.UserInfo{UserName: "admin", Password: "admin", Telephone: "13888888888", Email: "admin@admin.com", Type: "admin"}
	//impl.DB.Where(server.UserInfo{UserName: "admin"}).FirstOrCreate(&admin)

	//log.Printf("admin:", admin)
	*/

	status := base.Status{}
	status.ImplInstance = &impl
	//task := base.Task{}
	//task.ImplInstance = &impl
	//user := base.User{}
	//user.ImplInstance = &impl
	router, err := rest.MakeRouter(
		//状态
		rest.Get("/Status/GetTaskStatus", status.GetTaskStatus), //任务管理-右上角-任务状态过滤
	)
	if err != nil {
		log.Fatal(err)
	}

	api.SetApp(router)

	/*
		upload := base.Upload{}
		upload.ImplInstance = &impl

		http.Handle("/bower_components/", http.StripPrefix("/bower_components/", http.FileServer(http.Dir("./template/bower_components/"))))
		http.Handle("/json/", http.StripPrefix("/json/", http.FileServer(http.Dir("./template/json/"))))
		http.Handle("/scripts/", http.StripPrefix("/scripts/", http.FileServer(http.Dir("./template/scripts/"))))
		http.Handle("/style/", http.StripPrefix("/style/", http.FileServer(http.Dir("./template/style/"))))
		http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("./template/"))))
		http.Handle("/api/", http.StripPrefix("/api", api.MakeHandler()))
		http.HandleFunc("/api/User/UserLogin", login)
		http.HandleFunc("/upload", upload.UploadFile)
		http.HandleFunc("/admin/", adminHandler)
		http.HandleFunc("/login/",loginHandler)
	*/
	http.HandleFunc("/api/User/UserLogin", login)
	http.Handle("/api/", http.StripPrefix("/api", api.MakeHandler()))

	e := base.Encrypt{}
	e.ImplInstance = &impl

	log.Printf(e.Encode("asdasdasdsadasdsadsad"))
	fmt.Printf(e.Encode("asdasdasdsadasdsadsad"))

	e.CallJava("asdasdasdsadasdsadsad")

	log.Printf("web 服务启动")
	log.Fatal(http.ListenAndServe(port, nil))
	log.Printf("web 服务结束")
}


func login(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")//允许访问所有域
	w.Header().Set("Access-Control-Allow-Origin", "*")//允许访问所有域
	w.Header().Add("Access-Control-Allow-Headers", "Content-Type")//header的类型
	w.Header().Add("Access-Control-Allow-Methods", "GET,POST,OPTION")//header的类型
	w.Header().Set("content-type","application/json")//返回数据格式是json

	r.Header.Set("Access-Control-Allow-Origin", "*")//允许访问所有域
	r.Header.Add("Access-Control-Allow-Headers", "Content-Type")//header的类型
	r.Header.Add("Access-Control-Allow-Methods", "GET,POST,OPTION")//header的类型
	r.Header.Set("content-type","application/json")//返回数据格式是json

	log.Println("logintest")
}
/*
var indexTemplate = template.Must(template.ParseFiles("./template/index.html"))
func adminHandler(w http.ResponseWriter, r *http.Request) {
	println("adminHandler")
	log.Println("adminHandler")
}
var loginTemplate = template.Must(template.ParseFiles("./template/views/login.html"))
func loginHandler(w http.ResponseWriter, r *http.Request) {
	println("Request ", r.URL.Path, " from ", r.RemoteAddr)
	r.ParseForm()

	if err := loginTemplate.Execute(w, nil); err != nil {
		return
	}
}
*/
