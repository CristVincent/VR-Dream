package base

import (
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	"log"
)

type Impl struct {
	DB gorm.DB
}

func (i *Impl) InitDB(conn string) {
	var err error
	i.DB, err = gorm.Open("mysql", conn)
	if err != nil {
		log.Fatalf("Got error when connect database, the error is '%v'", err)
	}
	i.DB.LogMode(true)
}

type BaseServer struct {
	ImplInstance *Impl
}
