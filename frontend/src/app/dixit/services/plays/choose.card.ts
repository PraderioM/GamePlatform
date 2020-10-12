import {BasePlay} from './base.play';

export class ChooseCard extends BasePlay {
  constructor(public cardId: number) {
    super('choose_card');
  }
}
