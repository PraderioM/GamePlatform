import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FillResponse} from './models';

@Injectable()
export class StateService {
  // urlPath = 'localhost:2121/sudoku';
  // urlPath = 'http://192.168.1.19:2121/sudoku';
  urlPath = 'http://85.53.252.3:27182/sudoku';

    constructor(private http: HttpClient) {
    }

    async solveSuDoKu(table: number[][]) {
      return await this.http
        .get<FillResponse>(this.urlPath + '/solve-sudoku',
          {params: new HttpParams().set('table', table.toString())})
        .toPromise();
    }
}
