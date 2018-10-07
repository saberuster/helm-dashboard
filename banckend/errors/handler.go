package errors

import (
  "github.com/emicklei/go-restful"
  "log"
  "net/http"
)

func ResponseError(response *restful.Response, err error) {
  log.Println(err)
  response.WriteError(http.StatusInternalServerError, err)
}
