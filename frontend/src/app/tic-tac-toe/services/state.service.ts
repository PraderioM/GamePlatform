import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActiveGame, GameDescription, Play, LeaderBoardPosition, GameResolution} from './models';
import {stringify} from 'querystring';

@Injectable()
export class StateService {
  urlPath = 'http://0.0.0.0:2121/tic-tac-toe';

    constructor(private http: HttpClient) {
    }

    async createGame(token: string, rows: number, cols: number, npc: number, pc: number, gravity: boolean) {
      return await this.http
        .get<GameDescription>(this.urlPath + '/create-game',
          {params: new HttpParams().set('token', token)
              .set('rows', stringify(rows)).set('cols', stringify(cols))
              .set('npc', stringify(npc)).set('pc', stringify(pc))
              .set('gravity', stringify(gravity))})
        .toPromise();
    }

    async findGame(token: string, gameId: string) {
      return await this.http
        .get<GameDescription>(this.urlPath + '/find-game',
          {params: new HttpParams().set('token', token).set('game_id', gameId)})
        .toPromise();
    }

    async makePlay(token: string, play: Play, gameId: string) {
      return await this.http
        .get<GameDescription>(this.urlPath + '/make-play',
          {params: new HttpParams().set('token', token).set('game_id', gameId)
                                          .set('row', stringify(play.row)).set('col', stringify(play.col))})
        .toPromise();
    }

    async getActiveGames(token: string) {
      return await this.http
        .get<ActiveGame[]>(this.urlPath + '/get-active-games',
          {params: new HttpParams().set('token', token)})
        .toPromise();
    }

    async getLeaderBoard(token: string) {
      return await this.http
        .get<LeaderBoardPosition[]>(this.urlPath + '/get-leader-board',
          {params: new HttpParams().set('token', token)})
        .toPromise();
    }

  async endGame(token: string, gameId: string) {
    return await this.http
      .get<GameResolution>(this.urlPath + '/end-game',
        {params: new HttpParams().set('token', token).set('game_id', gameId)})
      .toPromise();
  }

}
