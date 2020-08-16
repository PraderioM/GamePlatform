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
              public plays: BuildPlay[],
              public currentPlayer: number,
              public turn: number,
              public developmentDeck: DevelopmentDeck,
              public materialsDeck: MaterialsDeck,
              public landList: string[],
              public extended: boolean,
              public description: string,
              public knightPlayer?: Player,
              public longRoadPlayer?: Player,
              public discardCards: boolean = false,
              public thiefMoved: boolean = true,
              public toBuildRoads: number = 0,
              public lastDiceResult: number = 7,
              public hasEnded: boolean = false,
              public offer?: Offer,
              public id?: string) {
    super(players, currentPlayer, description, id, plays);
  }
}

export class ActiveGame extends BaseActiveGame {
  constructor(public gameId: string, public nPlayers: number, public nBots: number,
              public currentPlayers: number, public extended: boolean) {
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
