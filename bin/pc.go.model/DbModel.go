package model

import (
	"time"
)

///////////////基础结构
type PageInfo struct {
	Page, PageSize, PageCount, TotalCount int
	Items                                 interface{}
}
