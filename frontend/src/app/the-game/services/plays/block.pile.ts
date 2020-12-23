import {BasePlay} from './base.play';

export class BlockPile extends BasePlay {
  constructor(public pileId: number) {
    super('block_pile');
  }
}
