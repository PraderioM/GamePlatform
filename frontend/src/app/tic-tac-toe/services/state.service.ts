import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActiveGame, GameDescription, GameResolution, LeaderBoardPosition, Play} from './models';

@Injectable()
export class StateService {
  // urlPath = 'http://localhost:2121/tic-tac-toe';
  // urlPath = 'http://0.0.0.0:2121/tic-tac-toe';
  // urlPath = 'http://192.168.1.19:2121/tic-tac-toe';
  // urlPath = 'http://85.53.252.2:27182/tic-tac-toe';
  urlPath = 'http://gameplatform.tetesake.site:27182/tic-tac-toe';

    constructor(private http: HttpClient) {
    }

    async createGame(token: string, rows: number, cols: number, npc: number, pc: number, gravity: boolean) {
      let gravityStr: string;
      if (gravity) {
        gravityStr = 'true';
      } else {
        gravityStr = 'false';
      }
      return await this.http
        .get<GameDescription>(this.urlPath + '/create-game',
          {params: new HttpParams().set('token', token)
              .set('rows', rows.toString()).set('cols', cols.toString())
              .set('npc', npc.toString()).set('pc', pc.toString())
              .set('gravity', gravityStr)})
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
                                          .set('row', play.row.toString()).set('col', play.col.toString())})
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
