import {BasePlay} from './base.play';

export class PlayCard extends BasePlay {
  constructor(public cardNumber: number, public pileId: number) {
    super('play_card');
  }
}
