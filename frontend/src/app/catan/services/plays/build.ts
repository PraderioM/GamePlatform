import {BasePlay} from './base.play';

export class BuildPlay extends BasePlay {
  constructor(public playName: string, public color: string, public position: number[]) {
    super(playName);
  }
}

export class BuildRoad extends BuildPlay {
  constructor(public color: string, public position: number[]) {
    super('build_road', color, position);
  }

  static fromJSON(jsonData: any) {
    return new BuildRoad(jsonData.player.color, jsonData.player.position);
  }
}

export class BuildSettlement extends BuildPlay {
  constructor(public color: string, public position: number[]) {
    super('build_settlement', color, position);
  }

  static fromJSON(jsonData: any) {
    return new BuildSettlement(jsonData.player.color, jsonData.player.position);
  }
}

export class BuildCity extends BuildPlay {
  constructor(public color: string, public position: number[]) {
    super('build_city', color, position);
  }

  static fromJSON(jsonData: any) {
    return new BuildCity(jsonData.player.color, jsonData.player.position);
  }
}
