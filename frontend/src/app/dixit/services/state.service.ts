import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActiveGame, GameDescription} from './models';
import {CommonStateService} from '../../services/common.state.service';
import {DescribeCard} from './plays/describe.card';
import {BasePlay} from '../../catan/services/plays/base.play';
import {EndTurnPlay} from '../../catan/services/plays/end.turn';
import {PlayCard} from './plays/play.card';
import {ChooseCard} from './plays/choose.card';
import {nCards} from './constants';

@Injectable()
export class StateService extends CommonStateService {
  constructor(http: HttpClient) {
    super(http, 'dixit');
  }

  async createGame(token: string, npc: number, pc: number, totalPoints: number) {
    return await this.http
      .get<GameDescription>(this.backendURL + '/create-game',
        {params: new HttpParams().set('token', token)
            .set('npc', npc.toString()).set('pc', pc.toString())
            .set('total_points', totalPoints.toString())
            .set('n_cards', nCards.toString())})
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

  async describeCard(token: string, play: DescribeCard, gameId: string) {
    await this.http.post(this.backendURL + '/make-play',
      '',
      {
        params: this.initPlayParams(token, play, gameId)
          .set('description', play.description)
          .set('card_id', play.cardId.toString())
      })
      .toPromise();
  }

  async playCard(token: string, play: PlayCard, gameId: string) {
    await this.http.post(this.backendURL + '/make-play',
      '',
      {
        params: this.initPlayParams(token, play, gameId)
          .set('card_id', play.cardId.toString())
      })
      .toPromise();
  }

  async chooseCard(token: string, play: ChooseCard, gameId: string) {
    await this.http.post(this.backendURL + '/make-play',
      '',
      {
        params: this.initPlayParams(token, play, gameId)
          .set('card_id', play.cardId.toString())
      })
      .toPromise();
  }

  async endTurn(token: string, play: EndTurnPlay, gameId: string) {
    await this.http.post(this.backendURL + '/make-play',
      '',
      {
        params: this.initPlayParams(token, play, gameId)
      })
      .toPromise();
  }

  async getActiveGames(token: string) {
    return await this.http
      .get<ActiveGame[]>(this.backendURL + '/get-active-games',
        {params: new HttpParams().set('token', token)})
      .toPromise();
  }

  initPlayParams(token: string, play: BasePlay, gameId: string) {
    let params = new HttpParams();
    params = params.set('token', token);
    params = params.set('game_id', gameId);
    return params.set('play_name', play.playName);
  }

}
