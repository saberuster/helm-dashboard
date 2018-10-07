import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private httpClient: HttpClient) {
  }

  releaseList(): Observable<ReleaseList> {
    return this.httpClient.get<ReleaseList>('http://localhost:9999/api/v1/chart/list');
  }

  searchChart(keyword: string): Observable<any> {
    return this.httpClient.get<SearchResultItem[]>('http://localhost:9999/api/v1/chart/search', {params: {keyword: keyword}});
  }
}

export class ReleaseList {
  Total: number;
  Next: string;
  Count: number;
  Releases: ReleaseInfo[];
}


export class ReleaseInfo {
  Name: string;
  Revision: string;
  Updated: string;
  Status: string;
  Chart: string;
  AppVersion: string;
  Namespace: string;
}

export class SearchResultItem {
  Name: string;
  Score: number;
  Chart: SearchResultChartItem;
}

export class SearchResultChartItem {
  name: string;
  home: string;
  sources: string[];
  version: string;
  description: string;
  icon: string;
  appVersion: string;
  urls: string[];
}


