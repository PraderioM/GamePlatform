import {BasePlay} from './base.play';

export class BuyDevelopment extends BasePlay {
  constructor() {
    super('buy_development');
  }
}

export class PlayKnight extends BasePlay {
  constructor() {
    super('play_knight');
  }
}

export class PlayRoads extends BasePlay {
  constructor() {
    super('play_roads');
  }
}

export class PlayResources extends BasePlay {
  constructor(public resource1: string, public resource2: string) {
    super('play_resources');
  }
}

export class PlayMonopoly extends BasePlay {
  constructor(public material: string) {
    super('play_monopoly');
  }
}
