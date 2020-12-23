import {BasePlay} from './base.play';

export class ChooseStartingPlayer extends BasePlay {
  constructor(public name: string) {
    super('choose_starting_player');
  }
}
