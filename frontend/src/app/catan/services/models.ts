import {Player as BasePlayer} from '../../services/models';
import {GameDescription as BaseGameDescription, ActiveGame as BaseActiveGame} from '../../services/models';
import {BuildPlay} from './plays/build';

export class Player extends BasePlayer {
  constructor(public isBot: boolean, public color: string, public points: number,
              public name?: string, public materialsDeck?: MaterialsDeck,
              public developmentDeck?: DevelopmentDeck,
              public diceThrown: boolean = false,
              public cardsDiscarded: boolean = true) {
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
              public thiefPosition: number,
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

  getCurrentPlayer() {
    return this.players[this.currentPlayer];
  }

  getPlayerMaterialsByName(name: string) {
    for (const player of this.players) {
      if (player.name === name) {
        return player.materialsDeck;
      }
    }

    return new MaterialsDeck();
  }

  getPlayerDevelopmentDeckByName(name: string) {
    for (const player of this.players) {
      if (player.name === name) {
        return player.developmentDeck;
      }
    }

    return new DevelopmentDeck();
  }
}

export class ActiveGame extends BaseActiveGame {
  constructor(public gameId: string, public nPlayers: number, public nBots: number,
              public currentPlayers: number, public extended: boolean) {
    super(gameId, nPlayers, nBots, currentPlayers);
  }
}

export class MaterialsDeck {
  nMaterials: number;
  constructor(public nWood: number = 0, public nBrick: number = 0, public nSheep: number = 0,
              public nWheat: number = 0, public nStone: number = 0) {
    this.nMaterials = nWood + nBrick + nSheep + nWheat + nStone;
  }
  getNMaterials() {
    return this.nWood + this.nBrick + this.nSheep + this.nWheat + this.nStone;
  }
}

export class DevelopmentDeck {
  constructor(public nKnight: number = 0, public nMonopoly: number = 0, public nResources: number = 0,
              public nRoads: number = 0, public nPoint: number = 0) { }
}

export class Offer {
  constructor(public offerMaker: Player, public targetPlayerList: Player[],
              public offeredDek: MaterialsDeck, public requestedDeck: MaterialsDeck) {
  }
}
