import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FillResponse} from './models';
import {backendURL} from '../../services/constants';

@Injectable()
export class StateService {
  scope = 'sudoku';
  backendURL = backendURL + '/' + this.scope;

  constructor(private http: HttpClient) { }

  async solveSuDoKu(table: number[][], blockRows: number, blockCols: number) {
    console.log('solving SuDoKu.');
    const response = await this.http
      .get<FillResponse>(this.backendURL + '/solve-sudoku',
        {params: new HttpParams().set('table', table.toString())
            .set('block_rows', blockRows.toString())
            .set('block_cols', blockCols.toString())})
      .toPromise();
    console.log('done.');
    return response;
  }

  async createSuDoKu(blockRows: number, blockCols: number) {
    console.log('creating SuDoKu.');
    const response = await this.http
      .get<FillResponse>(this.backendURL + '/create-sudoku',
        {params: new HttpParams()
            .set('block_rows', blockRows.toString())
            .set('block_cols', blockCols.toString())})
      .toPromise();
    console.log('done.');
    return response;
  }
}
