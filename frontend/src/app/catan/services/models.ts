export class Play {
  constructor(public row: number, public col: number, public symbol: string) { }
}

export class Player {
  constructor(public isBot: boolean, public symbol: string, public points: number,
              public name?: string) { }
}

export class GameDescription {
  constructor(public rows: number, public cols: number, public players: Player[],
              public currentPlayer: number, public description: string,
              public id?: string, public plays: Play[] = []) { }
}

export class ActiveGame {
  constructor(public gameId: string, public nPlayers: number, public nBots: number,
              public gravity: boolean,
              public currentPlayers: number, public rows: number, public cols: number) { }
}

export class LeaderBoardPosition {
  constructor(public playerName: string, public totalPlayed: number,
              public wins: number, public points: number) {
  }
}

export class GameResolution {
  constructor(public isObserver: boolean = false, public isVictorious: boolean = false,
              public isLoser: boolean = false, public isTie: boolean = false) { }
}
