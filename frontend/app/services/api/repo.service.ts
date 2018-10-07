import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepoService {

  constructor(private httpClient: HttpClient) {
  }

  list(): Observable<RepoInfo[]> {
    return this.httpClient.get<RepoInfo[]>('http://localhost:9999/api/v1/repo/list');
  }

}


export class RepoInfo {
  name: string;
  url: string;
}
