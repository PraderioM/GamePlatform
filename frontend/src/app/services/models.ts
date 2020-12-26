export class Play {
  constructor() { }
}

export class Player {
  constructor(public isBot: boolean, public points: number, public name?: string) { }
}

export class GameDescription {
  constructor(public players: Player[],
              public currentPlayer: number, public description: string,
              public id?: string,
              public nActions: number = -1,
              public plays: Play[] = []) { }
}

export class ActiveGame {
  constructor(public gameId: string, public nPlayers: number, public nBots: number,
              public currentPlayers: number) { }
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
