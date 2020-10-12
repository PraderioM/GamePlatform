import {BasePlay} from './base.play';

export class PlayCard extends BasePlay {
  constructor(public cardId: number) {
    super('play_card');
  }
}
