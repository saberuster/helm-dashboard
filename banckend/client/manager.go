package client

import (
  "github.com/emicklei/go-restful"
  "k8s.io/helm/pkg/helm"
)

func NewClientManager(tillerHost string) Manager {
  cm := &clientManager{tillerHost: tillerHost}

  return cm
}

type Manager interface {
  Client(req *restful.Request) (helm.Interface, error)
}

type clientManager struct {
  tillerHost string
}

func (cm *clientManager) Client(req *restful.Request) (helm.Interface, error) {
  options := []helm.Option{helm.Host(cm.tillerHost)}
  c := helm.NewClient(options...)
  return c, nil
}
