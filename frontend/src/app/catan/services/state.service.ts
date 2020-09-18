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
import {Steal} from './plays/steal';

const availableList: boolean[] = [true];

@Injectable()
export class StateService extends CommonStateService {
  constructor(http: HttpClient) {
    super(http, 'catan');
  }

    async createGame(token: string, npc: number, pc: number, expansion: boolean) {
      const available = availableList.pop();
      if (available) {
        let expansionStr: string;
        if (expansion) {
          expansionStr = 'true';
        } else {
          expansionStr = 'false';
        }
        console.log('creating game.');
        const response = await this.http
          .get<GameDescription>(this.backendURL + '/create-game',
            {
              params: new HttpParams().set('token', token)
                .set('npc', npc.toString()).set('pc', pc.toString())
                .set('expansion', expansionStr)
            })
          .toPromise();
        availableList.push(true);
        return GameDescription.fromJSON(response);
      }
    }

    async enterGame(token: string, gameId: string) {
      const available = availableList.pop();
      if (available) {
        console.log('entering game.');
        const response = await this.http
          .get<GameDescription>(this.backendURL + '/enter-game',
            {params: new HttpParams().set('token', token).set('game_id', gameId)})
          .toPromise();
        if (response === undefined || response == null) {
          availableList.push(true);
          return null;
        } else {
          availableList.push(true);
          return GameDescription.fromJSON(response);
        }
      }
    }

    async getGameUpdate(token: string, gameId: string) {
      const response = await this.http
        .get<GameDescription>(this.backendURL + '/get-game-update',
          {params: new HttpParams().set('token', token).set('game_id', gameId)})
        .toPromise();
      if (response === undefined || response == null) {
        return null;
      } else {
        return GameDescription.fromJSON(response);
      }
    }

    async makeBuildPlay(token: string, play: BuildPlay, gameId: string) {
      const available = availableList.pop();
      if (available) {
        console.log('building ', play.playName);
        await this.http.post(this.backendURL + '/make-play',
          '',
          {
              params: this.initPlayParams(token, play, gameId).set('position', JSON.stringify(play.position))
            }
          )
          .toPromise();
        console.log('done');
        availableList.push(true);
      }
    }

    async stealPlayer(token: string, play: Steal, gameId: string) {
      const available = availableList.pop();
      if (available) {
        console.log('stealing from ', play.player.name);
        await this.http.post(this.backendURL + '/make-play',
          '',
            {
              params: this.initPlayParams(token, play, gameId).set('to_steal_player', play.player.name)
            }
          )
          .toPromise();
        console.log('done');
        availableList.push(true);
      }
    }

    async makeOffer(token: string, play: CommercePlay, gameId: string) {
      const available = availableList.pop();
      if (available) {
        console.log('making offer.');
        await this.http.post(this.backendURL + '/make-play',
          '',
            {
              params: this.initPlayParams(token, play, gameId).set('offer', JSON.stringify(play.offer))
            }
          )
          .toPromise();
        console.log('done');
        availableList.push(true);
      }
    }

    async acceptOffer(token: string, play: AcceptOffer, gameId: string) {
      const available = availableList.pop();
      if (available) {
        console.log('accepting offer.');
        await this.http.post(this.backendURL + '/make-play',
          '',
            {
              params: this.initPlayParams(token, play, gameId)
            }
          )
          .toPromise();
        console.log('done');
        availableList.push(true);
      }
    }

    async rejectOffer(token: string, play: RejectOffer, gameId: string) {
      const available = availableList.pop();
      if (available) {
        console.log('rejecting offer.');
        await this.http.post(this.backendURL + '/make-play',
          '',
            {
              params: this.initPlayParams(token, play, gameId)
            }
          )
          .toPromise();
        console.log('done');
        availableList.push(true);
      }
    }

    async withdrawOffer(token: string, play: WithdrawOffer, gameId: string) {
      const available = availableList.pop();
      if (available) {
        console.log('withdrawing offer.');
        await this.http.post(this.backendURL + '/make-play',
          '',
            {
              params: this.initPlayParams(token, play, gameId)
            }
          )
          .toPromise();
        console.log('done');
        availableList.push(true);
      }
    }

  async buyDevelopment(token: string, play: BuyDevelopment, gameId: string) {
    const available = availableList.pop();
    if (available) {
      console.log('buying development.');
      await this.http.post(this.backendURL + '/make-play',
        '',
          {
            params: this.initPlayParams(token, play, gameId)
          }
        )
        .toPromise();
      console.log('done');
      availableList.push(true);
    }
  }

  async playKnight(token: string, play: PlayKnight, gameId: string) {
    const available = availableList.pop();
    if (available) {
      console.log('Playing knight.');
      await this.http.post(this.backendURL + '/make-play',
        '',
          {
            params: this.initPlayParams(token, play, gameId)
          }
        )
        .toPromise();
      console.log('done');
      availableList.push(true);
    }
  }

  async playRoads(token: string, play: PlayRoads, gameId: string) {
    const available = availableList.pop();
    if (available) {
      console.log('Playing ', play.playName);
      await this.http.post(this.backendURL + '/make-play',
        '',
          {
            params: this.initPlayParams(token, play, gameId)
          }
        )
        .toPromise();
      console.log('done');
      availableList.push(true);
    }
  }

  async playResources(token: string, play: PlayResources, gameId: string) {
    const available = availableList.pop();
    if (available) {
      console.log('getting  ', play.resource1, ' and ', play.resource2);
      await this.http.post(this.backendURL + '/make-play',
        '',
          {
            params: this.initPlayParams(token, play, gameId).set('resource1', play.resource1).set('resource2', play.resource2)
          }
        )
        .toPromise();
      console.log('done');
      availableList.push(true);
    }
  }

  async playMonopoly(token: string, play: PlayMonopoly, gameId: string) {
    const available = availableList.pop();
    if (available) {
      console.log('Monopolizing  ', play.material);
      await this.http.post(this.backendURL + '/make-play',
        '',
          {
            params: this.initPlayParams(token, play, gameId).set('material', play.material)
          }
        )
        .toPromise();
      console.log('done');
      availableList.push(true);
    }
  }

  async discardPlay(token: string, play: DiscardPlay, gameId: string) {
    const available = availableList.pop();
    if (available) {
      console.log('Discarding cards.');
      await this.http.post(this.backendURL + '/make-play',
        '',
          {
            params: this.initPlayParams(token, play, gameId).set('materials_deck', JSON.stringify(play.discardedDeck))
          }
        )
        .toPromise();
      console.log('done');
      availableList.push(true);
    }
  }

  async endTurn(token: string, play: EndTurnPlay, gameId: string) {
    const available = availableList.pop();
    if (available) {
      console.log('Ending turn.');
      await this.http.post(this.backendURL + '/make-play',
        '',
          {
            params: this.initPlayParams(token, play, gameId)
          }
        )
        .toPromise();
      console.log('done');
      availableList.push(true);
    }
  }

  async moveThief(token: string, play: MoveThiefPlay, gameId: string) {
    const available = availableList.pop();
    if (available) {
      console.log('Moving thief to position ', play.position);
      await this.http.post(this.backendURL + '/make-play',
        '',
          {
            params: this.initPlayParams(token, play, gameId).set('dst_index', play.position.toString())
          }
        )
        .toPromise();
      console.log('done');
      availableList.push(true);
    }
  }

  async throwDice(token: string, play: ThrowDicePlay, gameId: string) {
    const available = availableList.pop();
    if (available) {
      console.log('Throwing dice.');
      await this.http.post(this.backendURL + '/make-play',
        '',
          {
            params: this.initPlayParams(token, play, gameId)
          }
        )
        .toPromise();
      console.log('done');
      availableList.push(true);
    }
  }

    async getActiveGames(token: string) {
      const available = availableList.pop();
      if (available) {
        const response = await this.http
          .get<ActiveGame[]>(this.backendURL + '/get-active-games',
            {params: new HttpParams().set('token', token)})
          .toPromise();
        const activeGameList: ActiveGame[] = [];
        for (const activeGameData of response) {
          activeGameList.push(ActiveGame.fromJSON(activeGameData));
        }
        availableList.push(true);
        return activeGameList;
      }
    }

  initPlayParams(token: string, play: BasePlay, gameId: string) {
      let params = new HttpParams();
      params = params.set('token', token);
      params = params.set('game_id', gameId);
      return params.set('play_name', play.playName);
    }
}
