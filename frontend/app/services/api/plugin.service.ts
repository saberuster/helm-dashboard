import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PluginService {

  constructor(private httpClient: HttpClient) {
  }

  list(): Observable<any[]> {
    return this.httpClient.get<any[]>('http://localhost:9999/api/v1/plugin/list');
  }
}

