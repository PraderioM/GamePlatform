import {ActiveGame as BaseActiveGame} from '../../services/models';

export class Play {
  constructor(public play: number, public modifier?: string) {
  }
}

export class Player {
  constructor(public isBot: boolean,
              public isActive: boolean,
              public points: number = 0,
              public imaginaryPoints: number = 0,
              public name?: string,
              public lastPlay?: number,
              public currentPlay?: number,
              public lastPlayedRound: number = -1) {
  }
}

export class GameDescription {
  constructor(public playerList: Player[],
              public nPlays: number,
              public victoryCriterion: string,
              public playMode: string,
              public hasEnded: boolean,
              public totalPoints?: number,
              public currentRound: number = 0,
              public description?: string,
              public id?: string,
              public nActions: number = -1) {
  }
}

export class ActiveGame extends BaseActiveGame {
  constructor(public gameId: string, public nPlayers: number, public nBots: number,
              public currentPlayers: number, public nPlays: number,
              public victoryCriterion: string, public playMode: string) {
    super(gameId, nPlayers, nBots, currentPlayers);
  }
}
