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
      console.log('creating game.');
      const response = await this.http
        .get<GameDescription>(this.backendURL + '/create-game',
          {params: new HttpParams().set('token', token)
              .set('rows', rows.toString()).set('cols', cols.toString())
              .set('npc', npc.toString()).set('pc', pc.toString())
              .set('gravity', gravityStr)})
        .toPromise();
      console.log('done.');
      const game = GameDescription.fromJSON(response);
      this.nActions = game.nActions;
      return game;
    }

    async enterGame(token: string, gameId: string) {
      console.log('entering game.');
      const response = await this.http
        .get<GameDescription>(this.backendURL + '/enter-game',
          {params: new HttpParams().set('token', token).set('game_id', gameId)})
        .toPromise();
      console.log('done.');
      const game = GameDescription.fromJSON(response);
      this.nActions = game.nActions;
      return game;
    }

    async getGameUpdate(token: string, gameId: string) {
      const response = await this.http
        .get<GameDescription>(this.backendURL + '/get-game-update',
          {
            params: new HttpParams()
              .set('token', token)
              .set('game_id', gameId)
              .set('n_actions', this.nActions.toString())
          })
        .toPromise();

      if (response === undefined || response === null) {
        return null;
      } else {
        const game = GameDescription.fromJSON(response);
        this.nActions = game.nActions;
        console.log('updating');
        return game;
      }
    }

    async makePlay(token: string, play: Play, gameId: string) {
      console.log('making play.');
      await this.http.post(this.backendURL + '/make-play',
          '',
          {params: new HttpParams().set('token', token).set('game_id', gameId)
                                          .set('row', play.row.toString()).set('col', play.col.toString())})
        .toPromise();
      console.log('done.');
    }

    async getActiveGames(token: string) {
      console.log('Getting active games.');
      const response = await this.http
        .get<ActiveGame[]>(this.backendURL + '/get-active-games',
          {params: new HttpParams().set('token', token)})
        .toPromise();
      console.log('done.');
      return response;
    }

}
