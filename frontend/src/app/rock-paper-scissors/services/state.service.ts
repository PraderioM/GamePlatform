import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActiveGame, GameDescription, Play} from './models';
import {CommonStateService} from '../../services/common.state.service';

@Injectable()
export class StateService extends CommonStateService {
    constructor(http: HttpClient) {
      super(http, 'rock-paper-scissors');
    }

    async createGame(token: string, npc: number, pc: number, nPlays: number, totalPoints: number,
                     victoryCriterion: string, playMode: string) {
      const totalPointsStr = isNaN(totalPoints) ? '0' : totalPoints.toString();

      return await this.http
        .get<GameDescription>(this.backendURL + '/create-game',
          {params: new HttpParams().set('token', token)
              .set('npc', npc.toString()).set('pc', pc.toString())
              .set('n_plays', nPlays.toString())
              .set('victory_criterion', victoryCriterion)
              .set('play_mode', playMode)
              .set('total_points', totalPointsStr)})
        .toPromise();
    }

    async findGame(token: string, gameId: string) {
      return await this.http
        .get<GameDescription>(this.backendURL + '/find-game',
          {params: new HttpParams().set('token', token).set('game_id', gameId)})
        .toPromise();
    }

    async makePlay(token: string, play: Play, gameId: string) {
      const modifier = play.modifier == null ? 'clone' : play.modifier;
      return await this.http
        .get<GameDescription>(this.backendURL + '/make-play',
          {params: new HttpParams().set('token', token)
                                          .set('game_id', gameId)
                                          .set('play', play.play.toString())
                                          .set('modifier', modifier)})
        .toPromise();
    }

    async getActiveGames(token: string) {
      return await this.http
        .get<ActiveGame[]>(this.backendURL + '/get-active-games',
          {params: new HttpParams().set('token', token)})
        .toPromise();
    }

}
