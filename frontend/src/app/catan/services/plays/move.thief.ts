import {BasePlay} from './base.play';
import {Player} from '../models';

export class MoveThiefPlay extends BasePlay {
  constructor(public position: number) {
    super('move_thief');
  }
}

export class Steal extends BasePlay {
  constructor(public player: Player) {
    super('steal');
  }
}
