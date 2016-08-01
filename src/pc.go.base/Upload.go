package base

import (
	"errors"
	"fmt"
	"github.com/ant0ine/go-json-rest/rest"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

type Upload struct {
	BaseServer
}

func (u *Upload) UploadFile(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	if r.Method == "POST" {
		log.Println("upload start ...")
		file, handle, err := r.FormFile("file")
		tn := fmt.Sprintf("%d", time.Now().Unix()) + "_" + handle.Filename
		fileName := "./html/upfile/" + tn
		log.Println("upload handle.Filename:", handle.Filename)
		log.Println("upload filename:", fileName)
		checkErr(err)
		f, err := os.OpenFile(fileName, os.O_WRONLY|os.O_CREATE, 0666)
		io.Copy(f, file)
		checkErr(err)
		defer f.Close()
		defer file.Close()
		log.Println("upload success")
		w.Write([]byte(tn))
	} else {
		err := errors.New("Method 应该是 POST")
		checkErr(err)
	}
}

func checkErr(err error) {
	if err != nil {
		err.Error()
	}
}

func (u *Upload) UploadAction(w rest.ResponseWriter, r *rest.Request) {

	log.Println("upload success")
	if "POST" == r.Method {
		file, handle, err := r.FormFile("file")
		if err != nil {
			rest.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		f, err := os.OpenFile("./test/"+handle.Filename, os.O_WRONLY|os.O_CREATE, 0666)
		if err != nil {
			rest.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		_, err = io.Copy(f, file)
		if err != nil {
			rest.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer f.Close()
		defer file.Close()
		log.Println("upload success")
	}
}
