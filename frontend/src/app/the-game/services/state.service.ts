import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActiveGame, GameDescription} from './models';
import {CommonStateService} from '../../services/common.state.service';
import {BasePlay} from './plays/base.play';
import {EndTurn} from './plays/end.turn';
import {PlayCard} from './plays/play.card';
import {ChooseStartingPlayer} from './plays/choose.starting.player';
import {SlowDownPile} from './plays/slow.down.pile';
import {BlockPile} from './plays/block.pile';

@Injectable()
export class StateService extends CommonStateService {
  constructor(http: HttpClient) {
    super(http, 'the-game');
  }

  async createGame(token: string, npc: number, pc: number, onFire: boolean, deckSize?: number, minToPlayCards?: number) {
    let deckSizeStr: string;
    if (deckSize == null) {
      deckSizeStr = 'None';
    } else {
      deckSizeStr = deckSize.toString();
    }

    let minToPlayCardsStr: string;
    if (minToPlayCards == null) {
      minToPlayCardsStr = 'None';
    } else {
      minToPlayCardsStr = minToPlayCards.toString();
    }

    const result = await this.http
      .get<GameDescription>(this.backendURL + '/create-game',
        {params: new HttpParams().set('token', token)
            .set('npc', npc.toString()).set('pc', pc.toString())
            .set('on_fire', onFire.toString())
            .set('deck_size', deckSizeStr)
            .set('min_to_play_cards', minToPlayCardsStr)})
      .toPromise();
    const game = GameDescription.fromJSON(result);
    this.nActions = game.nActions;
    return game;
  }

  async enterGame(token: string, gameId: string) {
    const result = await this.http
      .get<GameDescription>(this.backendURL + '/enter-game',
        {params: new HttpParams().set('token', token).set('game_id', gameId)})
      .toPromise();
    const game = GameDescription.fromJSON(result);
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
      return game;
    }
  }

  async chooseStartingPlayer(token: string, play: ChooseStartingPlayer, gameId: string) {
    await this.http.post(this.backendURL + '/make-play',
      '',
      {
        params: this.initPlayParams(token, play, gameId)
          .set('name', play.name)
      })
      .toPromise();
  }

  async playCard(token: string, play: PlayCard, gameId: string) {
    await this.http.post(this.backendURL + '/make-play',
      '',
      {
        params: this.initPlayParams(token, play, gameId)
          .set('card_number', play.cardNumber.toString())
          .set('pile_id', play.pileId.toString())
      })
      .toPromise();
  }

  async blockPile(token: string, play: BlockPile, gameId: string) {
    await this.http.post(this.backendURL + '/make-play',
      '',
      {
        params: this.initPlayParams(token, play, gameId)
          .set('pile_id', play.pileId.toString())
      })
      .toPromise();
  }

  async slowDownPile(token: string, play: SlowDownPile, gameId: string) {
    await this.http.post(this.backendURL + '/make-play',
      '',
      {
        params: this.initPlayParams(token, play, gameId)
          .set('pile_id', play.pileId.toString())
      })
      .toPromise();
  }

  async endTurn(token: string, play: EndTurn, gameId: string) {
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
