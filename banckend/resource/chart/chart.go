package chart

type ReleaseBasicInfo struct {
  Name       string
  Revision   int32
  Updated    string
  Status     string
  Chart      string
  AppVersion string
  Namespace  string
}

type ReleaseResponse struct {
  Total    int64
  Next     string
  Count    int64
  Releases []ReleaseBasicInfo
}
