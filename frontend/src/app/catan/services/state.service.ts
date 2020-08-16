import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {ActiveGame, GameDescription} from './models';
import {BuildPlay} from './plays/build';
import {StateService as BaseStateService} from '../../services/common.state.service';

@Injectable()
export class StateService extends BaseStateService {
    scope = 'catan';

    async createGame(token: string, npc: number, pc: number, expansion: boolean) {
      let expansionStr: string;
      if (expansion) {
        expansionStr = 'true';
      } else {
        expansionStr = 'false';
      }
      return await this.http
        .get<GameDescription>(this.backendURL + '/create-game',
          {params: new HttpParams().set('token', token)
              .set('npc', npc.toString()).set('pc', pc.toString())
              .set('expansion', expansionStr)})
        .toPromise();
    }

    async findGame(token: string, gameId: string) {
      return await this.http
        .get<GameDescription>(this.backendURL + '/find-game',
          {params: new HttpParams().set('token', token).set('game_id', gameId)})
        .toPromise();
    }

    async makePlay(token: string, play: BuildPlay, gameId: string) {
      // return await this.http
      //   .get<GameDescription>(this.urlPath + '/make-play',
      //     {params: new HttpParams().set('token', token).set('game_id', gameId)
      //                                     .set('row', play.row.toString()).set('col', play.col.toString())})
      //   .toPromise();
    }

    async getActiveGames(token: string) {
      return await this.http
        .get<ActiveGame[]>(this.backendURL + '/get-active-games',
          {params: new HttpParams().set('token', token)})
        .toPromise();
    }

}
