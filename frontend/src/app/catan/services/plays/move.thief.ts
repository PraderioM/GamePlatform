import {BasePlay} from './base.play';

export class MoveThiefPlay extends BasePlay {
  constructor(public position: number) {
    super('move_thief');
  }
}
