import {BasePlay} from './base.play';
import {Player} from '../models';

export class Steal extends BasePlay {
  constructor(public player: Player) {
    super('steal');
  }
}
