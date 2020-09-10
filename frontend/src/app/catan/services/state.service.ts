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

let locked = false;

@Injectable()
export class StateService extends CommonStateService {
  constructor(http: HttpClient) {
    super(http, 'catan');
  }

    async createGame(token: string, npc: number, pc: number, expansion: boolean) {
      if (!locked) {
        locked = true;
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
        locked = false;
        return GameDescription.fromJSON(response);
      }
    }

    async enterGame(token: string, gameId: string) {
      console.log('entering game.');
      const response = await this.http
        .get<GameDescription>(this.backendURL + '/enter-game',
          {params: new HttpParams().set('token', token).set('game_id', gameId)})
        .toPromise();
      if (response === undefined || response == null) {
        return null;
      } else {
        return GameDescription.fromJSON(response);
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
      if (!locked) {
        locked = true;
        console.log('building ', play.playName);
        await this.http.post(this.backendURL + '/make-play',
          '',
          {
              params: this.initPlayParams(token, play, gameId).set('position', JSON.stringify(play.position))
            }
          )
          .toPromise();
        console.log('done');
        locked = false;
      }
    }

    async stealPlayer(token: string, play: Steal, gameId: string) {
      if (!locked) {
        locked = true;
        console.log('stealing from ', play.player.name);
        await this.http.post(this.backendURL + '/make-play',
          '',
            {
              params: this.initPlayParams(token, play, gameId).set('to_steal_player', play.player.name)
            }
          )
          .toPromise();
        console.log('done');
        locked = false;
      }
    }

    async makeOffer(token: string, play: CommercePlay, gameId: string) {
      if (!locked) {
        locked = true;
        console.log('making offer.');
        await this.http.post(this.backendURL + '/make-play',
          '',
            {
              params: this.initPlayParams(token, play, gameId).set('offer', JSON.stringify(play.offer))
            }
          )
          .toPromise();
        console.log('done');
        locked = false;
      }
    }

    async acceptOffer(token: string, play: AcceptOffer, gameId: string) {
      if (!locked) {
        locked = true;
        console.log('accepting offer.');
        await this.http.post(this.backendURL + '/make-play',
          '',
            {
              params: this.initPlayParams(token, play, gameId)
            }
          )
          .toPromise();
        console.log('done');
        locked = false;
      }
    }

    async rejectOffer(token: string, play: RejectOffer, gameId: string) {
      if (!locked) {
        locked = true;
        console.log('rejecting offer.');
        await this.http.post(this.backendURL + '/make-play',
          '',
            {
              params: this.initPlayParams(token, play, gameId)
            }
          )
          .toPromise();
        console.log('done');
        locked = false;
      }
    }

    async withdrawOffer(token: string, play: WithdrawOffer, gameId: string) {
      if (!locked) {
        locked = true;
        console.log('withdrawing offer.');
        await this.http.post(this.backendURL + '/make-play',
          '',
            {
              params: this.initPlayParams(token, play, gameId)
            }
          )
          .toPromise();
        console.log('done');
        locked = false;
      }
    }

  async buyDevelopment(token: string, play: BuyDevelopment, gameId: string) {
    if (!locked) {
      locked = true;
      console.log('buying development.');
      await this.http.post(this.backendURL + '/make-play',
        '',
          {
            params: this.initPlayParams(token, play, gameId)
          }
        )
        .toPromise();
      console.log('done');
      locked = false;
    }
  }

  async playKnight(token: string, play: PlayKnight, gameId: string) {
    if (!locked) {
      locked = true;

      console.log('Playing knight.');
      await this.http.post(this.backendURL + '/make-play',
        '',
          {
            params: this.initPlayParams(token, play, gameId)
          }
        )
        .toPromise();
      console.log('done');
      locked = false;
    }
  }

  async playRoads(token: string, play: PlayRoads, gameId: string) {
    if (!locked) {
      locked = true;

      console.log('Playing ', play.playName);
      await this.http.post(this.backendURL + '/make-play',
        '',
          {
            params: this.initPlayParams(token, play, gameId)
          }
        )
        .toPromise();
      console.log('done');
      locked = false;
    }
  }

  async playResources(token: string, play: PlayResources, gameId: string) {
    if (!locked) {
      locked = true;
      console.log('getting  ', play.resource1, ' and ', play.resource2);
      await this.http.post(this.backendURL + '/make-play',
        '',
          {
            params: this.initPlayParams(token, play, gameId).set('resource1', play.resource1).set('resource2', play.resource2)
          }
        )
        .toPromise();
      console.log('done');
      locked = false;
    }
  }

  async playMonopoly(token: string, play: PlayMonopoly, gameId: string) {
    if (!locked) {
      locked = true;
      console.log('Monopolizing  ', play.material);
      await this.http.post(this.backendURL + '/make-play',
        '',
          {
            params: this.initPlayParams(token, play, gameId).set('material', play.material)
          }
        )
        .toPromise();
      console.log('done');
      locked = false;
    }
  }

  async discardPlay(token: string, play: DiscardPlay, gameId: string) {
    if (!locked) {
      locked = true;
      console.log('Discarding cards.');
      await this.http.post(this.backendURL + '/make-play',
        '',
          {
            params: this.initPlayParams(token, play, gameId).set('materials_deck', JSON.stringify(play.discardedDeck))
          }
        )
        .toPromise();
      console.log('done');
      locked = false;
    }
  }

  async endTurn(token: string, play: EndTurnPlay, gameId: string) {
    if (!locked) {
      locked = true;
      console.log('Ending turn.');
      await this.http.post(this.backendURL + '/make-play',
        '',
          {
            params: this.initPlayParams(token, play, gameId)
          }
        )
        .toPromise();
      console.log('done');
      locked = false;
    }
  }

  async moveThief(token: string, play: MoveThiefPlay, gameId: string) {
    if (!locked) {
      locked = true;
      console.log('Moving thief to position ', play.position);
      await this.http.post(this.backendURL + '/make-play',
        '',
          {
            params: this.initPlayParams(token, play, gameId).set('dst_index', play.position.toString())
          }
        )
        .toPromise();
      console.log('done');
      locked = false;
    }
  }

  async throwDice(token: string, play: ThrowDicePlay, gameId: string) {
    if (!locked) {
      locked = true;
      console.log('Throwing dice.');
      await this.http.post(this.backendURL + '/make-play',
        '',
          {
            params: this.initPlayParams(token, play, gameId)
          }
        )
        .toPromise();
      console.log('done');
      locked = false;
    }
  }

    async getActiveGames(token: string) {
      if (!locked) {
        locked = true;
        const response = await this.http
          .get<ActiveGame[]>(this.backendURL + '/get-active-games',
            {params: new HttpParams().set('token', token)})
          .toPromise();
        const activeGameList: ActiveGame[] = [];
        for (const activeGameData of response) {
          activeGameList.push(ActiveGame.fromJSON(activeGameData));
        }
        locked = false;
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
