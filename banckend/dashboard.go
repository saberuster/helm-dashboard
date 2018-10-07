package main

import (
  "fmt"
  "helm-dashboard/banckend/client"
  "helm-dashboard/banckend/handler"
  "net/http"
  "os"
)

func main() {
  cManager := client.NewClientManager(":44134")
  hd, err := handler.NewApiHandler(cManager)
  if err != nil {
    fmt.Println(err)
    os.Exit(1)
  }

  http.Handle("/api/", hd)

  fmt.Println(http.ListenAndServe(":9999", nil))
}
