import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActiveGame, GameDescription, Play} from './models';
import {CommonStateService} from '../../services/common.state.service';

@Injectable()
export class StateService extends CommonStateService {
    constructor(http: HttpClient) {
      super(http, 'tic-tac-toe');
    }

    async createGame(token: string, rows: number, cols: number, npc: number, pc: number, gravity: boolean) {
      let gravityStr: string;
      if (gravity) {
        gravityStr = 'true';
      } else {
        gravityStr = 'false';
      }
      return await this.http
        .get<GameDescription>(this.backendURL + '/create-game',
          {params: new HttpParams().set('token', token)
              .set('rows', rows.toString()).set('cols', cols.toString())
              .set('npc', npc.toString()).set('pc', pc.toString())
              .set('gravity', gravityStr)})
        .toPromise();
    }

    async enterGame(token: string, gameId: string) {
      return await this.http
        .get<GameDescription>(this.backendURL + '/enter-game',
          {params: new HttpParams().set('token', token).set('game_id', gameId)})
        .toPromise();
    }

    async getGameUpdate(token: string, gameId: string) {
      return await this.http
        .get<GameDescription>(this.backendURL + '/get-game-update',
          {params: new HttpParams().set('token', token).set('game_id', gameId)})
        .toPromise();
    }

    async makePlay(token: string, play: Play, gameId: string) {
      await this.http.post(this.backendURL + '/make-play',
          '',
          {params: new HttpParams().set('token', token).set('game_id', gameId)
                                          .set('row', play.row.toString()).set('col', play.col.toString())})
        .toPromise();
    }

    async getActiveGames(token: string) {
      return await this.http
        .get<ActiveGame[]>(this.backendURL + '/get-active-games',
          {params: new HttpParams().set('token', token)})
        .toPromise();
    }

}
