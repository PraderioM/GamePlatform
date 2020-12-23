import {BasePlay} from './base.play';

export class SlowDownPile extends BasePlay {
  constructor(public pileId: number) {
    super('slow_down_pile');
  }
}
