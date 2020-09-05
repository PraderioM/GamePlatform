import {Play as BasePlay, Player as BasePlayer} from '../../services/models';
import {GameDescription as BaseGameDescription, ActiveGame as BaseActiveGame} from '../../services/models';

export class Play extends BasePlay {
  constructor(public row: number, public col: number, public symbol: string) {
    super();
  }
}

export class Player extends BasePlayer {
  constructor(public isBot: boolean, public symbol: string, public points: number,
              public name?: string) {
    super(isBot, points, name);
  }
}

export class GameDescription extends BaseGameDescription {
  constructor(public rows: number, public cols: number, public players: Player[],
              public currentPlayer: number, public description: string,
              public id?: string, public plays: Play[] = []) {
    super(players, currentPlayer, description, id, plays);
  }
}

export class ActiveGame extends BaseActiveGame {
  constructor(public gameId: string, public nPlayers: number, public nBots: number,
              public gravity: boolean,
              public currentPlayers: number, public rows: number, public cols: number) {
    super(gameId, nPlayers, nBots, currentPlayers);
  }
}
