import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {GameResolution, LeaderBoardPosition} from './models';
import {backendURL} from './constants';


@Injectable()
export class StateService {
  scope: string;
  backendURL: string;

  constructor(protected http: HttpClient) {
    this.backendURL = backendURL + '/' + this.scope;
  }

  async getLeaderBoard(token: string) {
    return await this.http
      .get<LeaderBoardPosition[]>(this.backendURL + '/get-leader-board',
        {params: new HttpParams().set('token', token)})
      .toPromise();
  }

  async endGame(token: string, gameId: string) {
    return await this.http
      .get<GameResolution>(this.backendURL + '/end-game',
        {params: new HttpParams().set('token', token).set('game_id', gameId)})
      .toPromise();
  }

}
