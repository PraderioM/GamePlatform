import {BasePlay} from './base.play';
import {MaterialsDeck} from '../models';

export class DiscardPlay extends BasePlay {
  constructor(public discardedDeck: MaterialsDeck) {
    super('discard_cards');
  }
}
