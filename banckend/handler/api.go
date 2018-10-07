package handler

import (
  "fmt"
  "github.com/emicklei/go-restful"
  "helm-dashboard/banckend/client"
  "helm-dashboard/banckend/errors"
  "helm-dashboard/banckend/resource/chart"
  "k8s.io/helm/cmd/helm/search"
  "k8s.io/helm/pkg/helm/helmpath"
  "k8s.io/helm/pkg/plugin"
  "k8s.io/helm/pkg/repo"
  "k8s.io/helm/pkg/timeconv"
  "net/http"
  "path/filepath"
)

type ApiHandler struct {
  cManager client.Manager
}

func NewApiHandler(cManager client.Manager) (http.Handler, error) {
  apiHandler := ApiHandler{
    cManager: cManager,
  }
  container := restful.NewContainer()
  container.EnableContentEncoding(true)

  // Add container filter to enable CORS
  cors := restful.CrossOriginResourceSharing{
    ExposeHeaders:  []string{"*"},
    AllowedHeaders: []string{"Content-Type", "Accept"},
    AllowedMethods: []string{"*"},
    CookiesAllowed: false,
    Container:      container}
  container.Filter(cors.Filter)

  // Add container filter to respond to OPTIONS
  container.Filter(container.OPTIONSFilter)

  apiV1Ws := new(restful.WebService)
  apiV1Ws.Path("/api/v1").
    Consumes(restful.MIME_JSON).
    Produces(restful.MIME_JSON)
  container.Add(apiV1Ws)

  apiV1Ws.Route(
    apiV1Ws.GET("/chart/list").
      To(apiHandler.ListReleases).
      Writes(chart.ReleaseResponse{}))

  apiV1Ws.Route(
    apiV1Ws.POST("/chart/install").
      To(apiHandler.InstallRelease))

  apiV1Ws.Route(
    apiV1Ws.DELETE("/chart/delete").
      To(apiHandler.DeleteRelease))

  apiV1Ws.Route(
    apiV1Ws.GET("/chart/search").
      To(apiHandler.SearchChart))

  apiV1Ws.Route(
    apiV1Ws.GET("/repo/list").
      To(apiHandler.ListRepository))

  apiV1Ws.Route(
    apiV1Ws.GET("/repo/add").
      To(apiHandler.AddRepository))

  apiV1Ws.Route(
    apiV1Ws.GET("/repo/update").
      To(apiHandler.UpdateRepository))

  apiV1Ws.Route(
    apiV1Ws.GET("/repo/remove").
      To(apiHandler.RemoveRepository))

  apiV1Ws.Route(
    apiV1Ws.GET("/plugin/list").
      To(apiHandler.ListPlugins))

  apiV1Ws.Route(
    apiV1Ws.GET("/plugin/install").
      To(apiHandler.InstallPlugin))

  apiV1Ws.Route(
    apiV1Ws.GET("/plugin/update").
      To(apiHandler.UpdatePlugin))

  apiV1Ws.Route(
    apiV1Ws.GET("/plugin/remove").
      To(apiHandler.RemovePlugin))

  return container, nil
}

func (apiHandler *ApiHandler) ListReleases(request *restful.Request, response *restful.Response) {
  hc, err := apiHandler.cManager.Client(request)
  if err != nil {
    errors.ResponseError(response, err)
    return
  }
  result, err := hc.ListReleases()
  if err != nil {
    errors.ResponseError(response, err)
    return
  }

  resultReleases := make([]chart.ReleaseBasicInfo, 0, len(result.Releases))

  for _, r := range result.Releases {
    md := r.GetChart().GetMetadata()
    t := "-"
    if tspb := r.GetInfo().GetLastDeployed(); tspb != nil {
      t = timeconv.String(tspb)
    }
    resultReleases = append(resultReleases, chart.ReleaseBasicInfo{
      Name:       r.GetName(),
      Revision:   r.GetVersion(),
      Updated:    t,
      Status:     r.GetInfo().GetStatus().GetCode().String(),
      Chart:      fmt.Sprintf("%s-%s", md.GetName(), md.GetVersion()),
      AppVersion: md.GetAppVersion(),
      Namespace:  r.GetNamespace(),
    })
  }

  err = response.WriteHeaderAndEntity(http.StatusOK, chart.ReleaseResponse{
    Total:    result.Total,
    Count:    result.Count,
    Next:     result.Next,
    Releases: resultReleases,
  })
  if err != nil {
    fmt.Println(err)
  }
}

func (apiHandler *ApiHandler) InstallRelease(request *restful.Request, response *restful.Response) {
  hc, err := apiHandler.cManager.Client(request)
  if err != nil {
    errors.ResponseError(response, err)
    return
  }

  chStr := request.QueryParameter("chStr")
  namespace := request.QueryParameter("namespace")
  resp, err := hc.InstallRelease(chStr, namespace)
  if err != nil {
    errors.ResponseError(response, err)
    return
  }

  err = response.WriteHeaderAndEntity(http.StatusOK, resp)
  if err != nil {
    fmt.Println(err)
  }
}

func (apiHandler *ApiHandler) DeleteRelease(request *restful.Request, response *restful.Response) {
  hc, err := apiHandler.cManager.Client(request)
  if err != nil {
    errors.ResponseError(response, err)
    return
  }

  rlsName := request.QueryParameter("rlsName")

  resp, err := hc.DeleteRelease(rlsName)
  if err != nil {
    errors.ResponseError(response, err)
    return
  }

  err = response.WriteHeaderAndEntity(http.StatusOK, resp)
  if err != nil {
    fmt.Println(err)
  }
}

func (apiHandler *ApiHandler) SearchChart(request *restful.Request, response *restful.Response) {
  keyword := request.QueryParameter("keyword")
  helmHome := helmpath.Home("/Users/liqi/.helm")
  rf, err := repo.LoadRepositoriesFile(helmHome.RepositoryFile())
  if err != nil {
    fmt.Println(err)
    return
  }

  i := search.NewIndex()
  for _, re := range rf.Repositories {
    n := re.Name
    f := helmHome.CacheIndex(n)
    ind, err := repo.LoadIndexFile(f)
    if err != nil {
      fmt.Printf("WARNING: Repo %q is corrupt or missing. Try 'helm repo update'.", n)
      continue
    }

    i.AddRepo(n, ind, true)
  }

  result := i.SearchLiteral(keyword, 25)

  search.SortScore(result)
  data := result[:0]
  foundNames := map[string]bool{}
  for _, r := range result {
    if _, found := foundNames[r.Name]; found {
      continue
    }
    data = append(data, r)
    foundNames[r.Name] = true
  }

  err = response.WriteHeaderAndEntity(http.StatusOK, data)
  if err != nil {
    fmt.Println(err)
  }
}
func (apiHandler *ApiHandler) ListRepository(request *restful.Request, response *restful.Response) {
  helmHome := helmpath.Home("/Users/liqi/.helm")
  rf, err := repo.LoadRepositoriesFile(helmHome.RepositoryFile())
  if err != nil {
    fmt.Println(err)
    return
  }
  data := make([]*repo.Entry, 0, len(rf.Repositories))
  for _, repository := range rf.Repositories {
    data = append(data, repository)
  }

  err = response.WriteHeaderAndEntity(http.StatusOK, data)
  if err != nil {
    fmt.Println(err)
  }
}
func (apiHandler *ApiHandler) AddRepository(request *restful.Request, response *restful.Response) {

}

func (apiHandler *ApiHandler) RemoveRepository(request *restful.Request, response *restful.Response) {

}
func (apiHandler *ApiHandler) UpdateRepository(request *restful.Request, response *restful.Response) {

}

func (apiHandler *ApiHandler) ListPlugins(request *restful.Request, response *restful.Response) {
  helmHome := helmpath.Home("/Users/liqi/.helm")
  var plugins []*plugin.Plugin
  // Let's get all UNIXy and allow path separators
  for _, p := range filepath.SplitList(helmHome.Plugins()) {
    matches, err := plugin.LoadAll(p)
    if err != nil {
      fmt.Println(err)
      continue
    }
    plugins = append(plugins, matches...)
  }

  err := response.WriteHeaderAndEntity(http.StatusOK, plugins)
  if err != nil {
    fmt.Println(err)
  }
}
func (apiHandler *ApiHandler) InstallPlugin(request *restful.Request, response *restful.Response) {

}

func (apiHandler *ApiHandler) UpdatePlugin(request *restful.Request, response *restful.Response) {

}

func (apiHandler *ApiHandler) RemovePlugin(request *restful.Request, response *restful.Response) {

}
