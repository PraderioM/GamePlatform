import {ActiveGame as BaseActiveGame} from '../../services/models';

export class Player {
  constructor(public deck: number[],
              public isBot: boolean,
              public points: number,
              public name?: string,
              public chosenCardId?: number,
              public playedCardId?: number) {
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
              public id?: string) {
  }

  getCurrentPlayer() {
    return this.playerList[this.currentPlayer];
  }
}

export class ActiveGame extends BaseActiveGame {
  constructor(public gameId: string, public nPlayers: number, public nBots: number,
              public currentPlayers: number, public totalPoints: number) {
    super(gameId, nPlayers, nBots, currentPlayers);
  }
}
