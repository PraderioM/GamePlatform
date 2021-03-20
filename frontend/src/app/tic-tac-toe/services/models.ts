import {Play as BasePlay, Player as BasePlayer} from '../../services/models';
import {GameDescription as BaseGameDescription, ActiveGame as BaseActiveGame} from '../../services/models';

export class Play extends BasePlay {
  constructor(public row: number, public col: number, public symbol: string) {
    super();
  }

  public static fromJSON(jsonData: any) {
    return new Play(jsonData.row, jsonData.col, jsonData.symbol);
  }
}

export class Player extends BasePlayer {
  constructor(public isBot: boolean, public symbol: string, public points: number,
              public name?: string) {
    super(isBot, points, name);
  }

  public static fromJSON(jsonData: any) {
    return new Player(jsonData.isBot, jsonData.symbol, jsonData.points, jsonData.name);
  }
}

export class GameDescription extends BaseGameDescription {
  constructor(public rows: number, public cols: number, public players: Player[],
              public currentPlayer: number, public description: string,
              public id?: string, public nActions: number = -1, public plays: Play[] = []) {
    super(players, currentPlayer, description, id, nActions, plays);
  }

  public static fromJSON(jsonData: any) {
    const players: Player[] = [];
    for (const playerData of jsonData.players) {
      players.push(Player.fromJSON(playerData));
    }

    const plays: Play[] = [];
    for (const playData of jsonData.plays) {
      plays.push(Play.fromJSON(playData));
    }

    return new GameDescription(jsonData.rows, jsonData.cols, players, jsonData.currentPlayer,
      jsonData.description, jsonData.id, jsonData.nActions, plays);
  }
}

export class ActiveGame extends BaseActiveGame {
  constructor(public gameId: string, public nPlayers: number, public nBots: number,
              public gravity: boolean,
              public currentPlayers: number, public rows: number, public cols: number) {
    super(gameId, nPlayers, nBots, currentPlayers);
  }
}
