import {Player as BasePlayer} from '../../services/models';
import {GameDescription as BaseGameDescription, ActiveGame as BaseActiveGame} from '../../services/models';
import {BuildPlay} from './plays/build';

export class Player extends BasePlayer {
  constructor(public isBot: boolean, public color: string, public points: number,
              public name?: string, public materialsDeck?: MaterialsDeck,
              public developmentDeck?: DevelopmentDeck) {
    super(isBot, points, name);
  }
}

export class GameDescription extends BaseGameDescription {
  constructor(public players: Player[],
              public currentPlayer: number, public description: string,
              public id?: string, public plays: BuildPlay[] = []) {
    super(players, currentPlayer, description, id, plays);
  }
}

export class ActiveGame extends BaseActiveGame {
  constructor(public gameId: string, public nPlayers: number, public nBots: number,
              public currentPlayers: number) {
    super(gameId, nPlayers, nBots, currentPlayers);
  }
}

export class MaterialsDeck {
  // Todo implement.
}

export class DevelopmentDeck {
  // Todo implement.
}

export class Offer {
  // Todo implement.
}
