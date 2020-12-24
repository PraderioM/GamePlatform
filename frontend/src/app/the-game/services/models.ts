import {ActiveGame as BaseActiveGame} from '../../services/models';
import {defaultDeckSize, defaultMinToPlayCards, maxCard} from './constants';

export class Player {
  constructor(public deck: number[],
              public isBot: boolean,
              public blockedPileLists: number[],
              public slowedDownPileLists: number[],
              public originalDeckLength: number,
              public name?: string) {
  }

  public static fromJSON(jsonData: Player) {
    return new Player(jsonData.deck, jsonData.isBot, jsonData.blockedPileLists, jsonData.slowedDownPileLists,
      jsonData.originalDeckLength, jsonData.name);
  }

  getNCards() {
    return this.deck.length;
  }

  getName() {
    if (this.name == null) {
      return 'sleeping beauty';
    } else {
      return this.name;
    }
  }
}

export class PileReserve {
  constructor(public name: string, public pileId: number) {
  }
}

export class Pile {
  constructor(public ascending: boolean, public id: number, private lastCard?: number, private lastAddedTurn?: number) {
  }

  public static fromJSON(jsonData: Pile) {
    return new Pile(jsonData.ascending, jsonData.id, jsonData.lastCard, jsonData.lastAddedTurn);
  }

  getLastCard() {
    if (this.lastCard == null) {
      if (this.ascending) {
        return 1;
      } else {
        return maxCard;
      }
    } else {
      return this.lastCard;
    }
  }

  getLastAddedTurn() {
    if (this.lastAddedTurn == null) {
      return -1;
    } else {
      return this.lastAddedTurn;
    }
  }
}

export class GameDescription {
  constructor(public playerList: Player[],
              public pileList: Pile[],
              public remainingCards: number[],
              public currentPlayer?: number,
              public onFire: boolean = false,
              public turn: number = 0,
              public deckSize?: number,
              public minToPlayCards?: number,
              public hasEnded: boolean = false,
              public description?: string,
              public id?: string) {
  }

  public static fromJSON(jsonData?: GameDescription) {
    // If there is no data return nothing.
    if (jsonData === null) {
      return null;
    }

    // Get player list from JSON.
    const playerList: Player[] = [];
    for (const playerData of jsonData.playerList) {
      playerList.push(Player.fromJSON(playerData));
    }

    // Get pile list from JSON.
    const pileList: Pile[] = [];
    for (const pileData of jsonData.pileList) {
      pileList.push(Pile.fromJSON(pileData));
    }

    return new GameDescription(playerList,
      pileList,
      jsonData.remainingCards,
      jsonData.currentPlayer,
      jsonData.onFire,
      jsonData.turn,
      jsonData.deckSize,
      jsonData.minToPlayCards,
      jsonData.hasEnded,
      jsonData.description,
      jsonData.id);
  }

  getCurrentPlayer() {
    if (this.currentPlayer == null) {
      return null;
    } else {
      return this.playerList[this.currentPlayer];
    }
  }

  getMissingPlayers() {
    let missingPLayers = 0;
    for (const player of this.playerList) {
      if (player.name != null) {
        missingPLayers += 1;
      }
    }

    return missingPLayers;
  }

  getNPlayers() {
    return this.playerList.length;
  }

  getMinToPlayCards() {
    if (this.minToPlayCards == null) {
      return defaultMinToPlayCards;
    } else {
      return this.minToPlayCards;
    }
  }

  getDeckSize() {
    if (this.deckSize == null) {
      return defaultDeckSize[this.getNPlayers()];
    } else {
      return this.deckSize;
    }
  }
}

export class ActiveGame extends BaseActiveGame {
  constructor(public gameId: string, public nPlayers: number, public nBots: number,
              public currentPlayers: number, public onFire: boolean,
              public minToPlayCards: number, public deckSize: number) {
    super(gameId, nPlayers, nBots, currentPlayers);
  }
}
