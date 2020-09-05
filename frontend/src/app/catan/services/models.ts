import {Player as BasePlayer} from '../../services/models';
import {GameDescription as BaseGameDescription, ActiveGame as BaseActiveGame} from '../../services/models';
import {BuildCity, BuildPlay, BuildRoad, BuildSettlement} from './plays/build';


export class Player extends BasePlayer {
  constructor(public isBot: boolean, public color: string, public points: number,
              public name?: string, public materialsDeck?: MaterialsDeck,
              public developmentDeck?: DevelopmentDeck,
              public diceThrown: boolean = false,
              public cardsDiscarded: boolean = true,
              public nPlayedKnights: number = 0) {
    super(isBot, points, name);
  }

  public static fromJSON(jsonData: any) {
    let materialsDeck: MaterialsDeck;
    if (jsonData.materialsDeck == null) {
      materialsDeck = null;
    } else {
      materialsDeck = MaterialsDeck.fromJSON(jsonData.materialsDeck);
    }

    let developmentDeck: DevelopmentDeck;
    if (jsonData.developmentDeck == null) {
      materialsDeck = null;
    } else {
      developmentDeck = DevelopmentDeck.fromJSON(jsonData.developmentDeck);
    }

    let nPlayedKnights: number;
    if (jsonData.nPlayedKnights == null) {
      nPlayedKnights = 0;
    } else {
      nPlayedKnights = jsonData.nPlayedKnights;
    }

    return new Player(jsonData.isBot, jsonData.color, jsonData.points, jsonData.name,
                      materialsDeck, developmentDeck, jsonData.diceThrown,
                      jsonData.cardsDiscarded, nPlayedKnights);
  }
}

export class NumberedLand {
  constructor(public landType: string, public value: number) {
  }

  public static fromJSON(jsonData: any) {
    return new NumberedLand(jsonData.landType, jsonData.value);
  }
}

export class GameDescription extends BaseGameDescription {
  constructor(public players: Player[],
              public plays: BuildPlay[],
              public currentPlayer: number,
              public turn: number,
              public developmentDeck: DevelopmentDeck,
              public materialsDeck: MaterialsDeck,
              public landList: NumberedLand[],
              public extended: boolean,
              public description: string,
              public thiefPosition: number,
              public toStealPlayers?: Player[],
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

  public static fromJSON(jsonData: any) {
    const players: Player[] = [];
    for (const playerData of jsonData.players) {
      players.push(Player.fromJSON(playerData));
    }

    const plays: BuildPlay[] = [];
    for (const playData of jsonData.plays) {
      if (playData.playName === 'build_road') {
        plays.push(BuildRoad.fromJSON(playData));
      } else if (playData.playName === 'build_settlement') {
        plays.push(BuildSettlement.fromJSON(playData));
      } else if (playData.playName === 'build_city') {
        plays.push(BuildCity.fromJSON(playData));
      }
    }

    const landList: NumberedLand[] = [];
    for (const landData of jsonData.landList) {
      landList.push(NumberedLand.fromJSON(landData));
    }

    let toStealPlayers: Player[];
    if (jsonData.toStealPlayers === null || jsonData.toStealPlayers.length === 0) {
      toStealPlayers = [];
    } else {
      toStealPlayers = [];
      for (const player of jsonData.toStealPlayers) {
        toStealPlayers.push(new Player(false, 'black', 0, player.name));
      }
    }

    let knightPlayer: Player;
    if (jsonData.knightPlayer === null) {
      knightPlayer = null;
    } else {
      knightPlayer = Player.fromJSON(jsonData.knightPlayer);
    }

    let longRoadPlayer: Player;
    if (jsonData.longRoadPlayer === null) {
      longRoadPlayer = null;
    } else {
      longRoadPlayer = Player.fromJSON(jsonData.longRoadPlayer);
    }

    const developmentDeck = DevelopmentDeck.fromJSON(jsonData.developmentDeck);
    const materialsDeck = MaterialsDeck.fromJSON(jsonData.materialsDeck);

    let offer: Offer;
    if (jsonData.offer == null) {
      offer = null;
    } else {
      offer = Offer.fromJSON(jsonData.offer);
    }

    return new GameDescription(players, plays, jsonData.currentPlayer, jsonData.turn,
                               developmentDeck, materialsDeck, landList, jsonData.extended, jsonData.description,
                               jsonData.thiefPosition, toStealPlayers, knightPlayer, longRoadPlayer,
                               jsonData.discardCards, jsonData.thiefMoved,
                               jsonData.toBuildRoads, jsonData.lastDiceResult, jsonData.hasEnded, offer, jsonData.id);
  }

  public getCurrentPlayer() {
    return this.players[this.currentPlayer];
  }

  public getPlayerMaterialsByName(name: string) {
    for (const player of this.players) {
      if (player.name === name) {
        return player.materialsDeck;
      }
    }

    return new MaterialsDeck();
  }

  public getPlayerDevelopmentDeckByName(name: string) {
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

  public static fromJSON(jsonData: any) {
    return new ActiveGame(jsonData.gameId, jsonData.nPlayers, jsonData.nBots, jsonData.currentPlayers, jsonData.extended);
  }
}

export class MaterialsDeck {
  nMaterials: number;
  constructor(public nWood: number = 0, public nBrick: number = 0, public nSheep: number = 0,
              public nWheat: number = 0, public nStone: number = 0) {
    this.nMaterials = nWood + nBrick + nSheep + nWheat + nStone;
  }

  public static fromJSON(jsonData: any) {
    return new MaterialsDeck(jsonData[0], jsonData[3], jsonData[1], jsonData[2], jsonData[4]);
  }

  getNMaterials() {
    return this.nWood + this.nBrick + this.nSheep + this.nWheat + this.nStone;
  }
}

export class DevelopmentDeck {
  constructor(public nKnight: number = 0, public nMonopoly: number = 0, public nResources: number = 0,
              public nRoads: number = 0, public nPoint: number = 0) { }

  public static fromJSON(jsonData: any) {
    return new DevelopmentDeck(jsonData[0], jsonData[1], jsonData[2], jsonData[3], jsonData[4]);
  }

  getNDevelopments() {
    return this.nKnight + this.nMonopoly + this.nResources + this.nRoads + this.nPoint;
  }
}

export class Offer {
  constructor(public offerMaker: Player, public targetPlayerList: Player[],
              public offeredDeck: MaterialsDeck, public requestedDeck: MaterialsDeck) {
  }

  public static fromJSON(jsonData: any) {
    const targetPlayerList: Player[] = [];
    for (const playerData of jsonData.targetPlayerList) {
      targetPlayerList.push(Player.fromJSON(playerData));
    }

    return new Offer(Player.fromJSON(jsonData.offerMaker), targetPlayerList,
                     MaterialsDeck.fromJSON(jsonData.offeredDeck),
                     MaterialsDeck.fromJSON(jsonData.requestedDeck));
  }
}
