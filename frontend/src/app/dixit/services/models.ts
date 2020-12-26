import {ActiveGame as BaseActiveGame} from '../../services/models';

export class Player {
  constructor(public deck: number[],
              public isBot: boolean,
              public points: number,
              public name?: string,
              public chosenCardId?: number,
              public playedCardId?: number) {
  }

  public static fromJSON(jsonData: Player) {
    return new Player(jsonData.deck, jsonData.isBot, jsonData.points,
      jsonData.name, jsonData.chosenCardId, jsonData.playedCardId);
  }
}

export class PlayedCard {
  constructor(public playerName: string, public cardId: number) {
  }
}

export class ChosenCard {
  constructor(public playerName: string, public cardId: number) {
  }
}

export class GameDescription {
  constructor(public playerList: Player[],
              public currentPlayer: number,
              public cardDescription?: string,
              public totalPoints: number = 30,
              public description?: string,
              public imageSet: string = 'classic',
              public id?: string,
              public nActions: number = -1) {
  }

  public static fromJSON(jsonData?: GameDescription) {
    // If there is no data return nothing.
    if (jsonData === null) {
      return null;
    }

    const playerList: Player[] = [];
    for (const playerData of jsonData.playerList) {
      playerList.push(Player.fromJSON(playerData));
    }

    return new GameDescription(playerList, jsonData.currentPlayer, jsonData.cardDescription,
                               jsonData.totalPoints, jsonData.description, jsonData.imageSet,
                               jsonData.id, jsonData.nActions);
  }

  getCurrentPlayer() {
    return this.playerList[this.currentPlayer];
  }
}

export class ActiveGame extends BaseActiveGame {
  constructor(public gameId: string, public nPlayers: number, public nBots: number,
              public currentPlayers: number, public totalPoints: number, public imageSet: string) {
    super(gameId, nPlayers, nBots, currentPlayers);
  }
}
