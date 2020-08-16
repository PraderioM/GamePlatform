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
}

export class BuildSettlement extends BuildPlay {
  constructor(public color: string, public position: number[]) {
    super('build_settlement', color, position);
  }
}

export class BuildCity extends BuildPlay {
  constructor(public color: string, public position: number[]) {
    super('build_city', color, position);
  }
}
