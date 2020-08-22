import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActiveGame, GameDescription} from './models';
import {BasePlay} from './plays/base.play';
import {CommonStateService} from '../../services/common.state.service';
import {BuildPlay} from './plays/build';
import {AcceptOffer, CommercePlay, RejectOffer, WithdrawOffer} from './plays/commerce';
import {BuyDevelopment, PlayKnight, PlayMonopoly, PlayResources, PlayRoads} from './plays/development';
import {DiscardPlay} from './plays/discard';
import {EndTurnPlay} from './plays/end.turn';
import {MoveThiefPlay} from './plays/move.thief';
import {ThrowDicePlay} from './plays/throw.dice';

@Injectable()
export class StateService extends CommonStateService {
  constructor(http: HttpClient) {
    super(http, 'catan');
  }

    async createGame(token: string, npc: number, pc: number, expansion: boolean) {
      let expansionStr: string;
      if (expansion) {
        expansionStr = 'true';
      } else {
        expansionStr = 'false';
      }
      const response = await this.http
        .get<GameDescription>(this.backendURL + '/create-game',
          {params: new HttpParams().set('token', token)
              .set('npc', npc.toString()).set('pc', pc.toString())
              .set('expansion', expansionStr)})
        .toPromise();
      return GameDescription.fromJSON(response);
    }

    async findGame(token: string, gameId: string) {
      const response = await this.http
        .get<GameDescription>(this.backendURL + '/find-game',
          {params: new HttpParams().set('token', token).set('game_id', gameId)})
        .toPromise();
      return GameDescription.fromJSON(response);
    }

    async makeBuildPlay(token: string, play: BuildPlay, gameId: string) {
      const response = await this.http
        .get<GameDescription>(this.backendURL + '/make-play',
          {
            params: this.initPlayParams(token, play, gameId).set('position', JSON.stringify(play.position))
          }
        )
        .toPromise();
      return GameDescription.fromJSON(response);
    }

    async makeOffer(token: string, play: CommercePlay, gameId: string) {
      const response = await this.http
        .get<GameDescription>(this.backendURL + '/make-play',
          {
            params: this.initPlayParams(token, play, gameId).set('offer', JSON.stringify(play.offer))
          }
        )
        .toPromise();
      return GameDescription.fromJSON(response);
    }

    async acceptOffer(token: string, play: AcceptOffer, gameId: string) {
      const response = await this.http
        .get<GameDescription>(this.backendURL + '/make-play',
          {
            params: this.initPlayParams(token, play, gameId)
          }
        )
        .toPromise();
      return GameDescription.fromJSON(response);
    }

    async rejectOffer(token: string, play: RejectOffer, gameId: string) {
      const response = await this.http
        .get<GameDescription>(this.backendURL + '/make-play',
          {
            params: this.initPlayParams(token, play, gameId)
          }
        )
        .toPromise();
      return GameDescription.fromJSON(response);
    }

    async withdrawOffer(token: string, play: WithdrawOffer, gameId: string) {
      const response = await this.http
        .get<GameDescription>(this.backendURL + '/make-play',
          {
            params: this.initPlayParams(token, play, gameId)
          }
        )
        .toPromise();
      return GameDescription.fromJSON(response);
    }

  async buyDevelopment(token: string, play: BuyDevelopment, gameId: string) {
    const response = await this.http
      .get<GameDescription>(this.backendURL + '/make-play',
        {
          params: this.initPlayParams(token, play, gameId)
        }
      )
      .toPromise();
    return GameDescription.fromJSON(response);
  }

  async playKnight(token: string, play: PlayKnight, gameId: string) {
    const response = await this.http
      .get<GameDescription>(this.backendURL + '/make-play',
        {
          params: this.initPlayParams(token, play, gameId)
        }
      )
      .toPromise();
    return GameDescription.fromJSON(response);
  }

  async playRoads(token: string, play: PlayRoads, gameId: string) {
    const response = await this.http
      .get<GameDescription>(this.backendURL + '/make-play',
        {
          params: this.initPlayParams(token, play, gameId)
        }
      )
      .toPromise();
    return GameDescription.fromJSON(response);
  }

  async playResources(token: string, play: PlayResources, gameId: string) {
    const response = await this.http
      .get<GameDescription>(this.backendURL + '/make-play',
        {
          params: this.initPlayParams(token, play, gameId).set('resource1', play.resource1).set('resource2', play.resource2)
        }
      )
      .toPromise();
    return GameDescription.fromJSON(response);
  }

  async playMonopoly(token: string, play: PlayMonopoly, gameId: string) {
    const response = await this.http
      .get<GameDescription>(this.backendURL + '/make-play',
        {
          params: this.initPlayParams(token, play, gameId).set('material', play.material)
        }
      )
      .toPromise();
    return GameDescription.fromJSON(response);
  }

  async discardPlay(token: string, play: DiscardPlay, gameId: string) {
    const response = await this.http
      .get<GameDescription>(this.backendURL + '/make-play',
        {
          params: this.initPlayParams(token, play, gameId).set('materials_deck', JSON.stringify(play.discardedDeck))
        }
      )
      .toPromise();
    return GameDescription.fromJSON(response);
  }

  async endTurn(token: string, play: EndTurnPlay, gameId: string) {
    const response = await this.http
      .get<GameDescription>(this.backendURL + '/make-play',
        {
          params: this.initPlayParams(token, play, gameId)
        }
      )
      .toPromise();
    return GameDescription.fromJSON(response);
  }

  async moveThief(token: string, play: MoveThiefPlay, gameId: string) {
    const response = await this.http
      .get<GameDescription>(this.backendURL + '/make-play',
        {
          params: this.initPlayParams(token, play, gameId).set('dst_index', play.position.toString())
        }
      )
      .toPromise();
    return GameDescription.fromJSON(response);
  }

  async throwDice(token: string, play: ThrowDicePlay, gameId: string) {
    const response = await this.http
      .get<GameDescription>(this.backendURL + '/make-play',
        {
          params: this.initPlayParams(token, play, gameId)
        }
      )
      .toPromise();
    return GameDescription.fromJSON(response);
  }

    async getActiveGames(token: string) {
      const response = await this.http
        .get<ActiveGame[]>(this.backendURL + '/get-active-games',
          {params: new HttpParams().set('token', token)})
        .toPromise();
      const activeGameList: ActiveGame[] = [];
      for (const activeGameData of response) {
        activeGameList.push(ActiveGame.fromJSON(activeGameData));
      }
      return activeGameList;
    }

  initPlayParams(token: string, play: BasePlay, gameId: string) {
      let params = new HttpParams();
      params = params.set('token', token);
      params = params.set('game_id', gameId);
      return params.set('play_name', play.playName);
    }
}
