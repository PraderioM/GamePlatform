import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FillResponse} from './models';

@Injectable()
export class StateService {
  // urlPath = 'http://localhost:2121/sudoku';
  // urlPath = 'http://0.0.0.0:2121/sudoku';
  // urlPath = 'http://192.168.1.19:2121/sudoku';
  // urlPath = 'http://85.53.2252.2:27182/sudoku';
  urlPath = 'http://gameplatform.tetesake.site:27182/sudoku';


  constructor(private http: HttpClient) { }

  async solveSuDoKu(table: number[][], blockRows: number, blockCols: number) {
    return await this.http
      .get<FillResponse>(this.urlPath + '/solve-sudoku',
        {params: new HttpParams().set('table', table.toString())
            .set('block_rows', blockRows.toString())
            .set('block_cols', blockCols.toString())})
      .toPromise();
  }

  async createSuDoKu(blockRows: number, blockCols: number) {
    return await this.http
      .get<FillResponse>(this.urlPath + '/create-sudoku',
        {params: new HttpParams()
            .set('block_rows', blockRows.toString())
            .set('block_cols', blockCols.toString())})
      .toPromise();
  }
}
