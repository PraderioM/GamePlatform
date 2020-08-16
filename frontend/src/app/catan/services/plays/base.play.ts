import {Play} from '../../../services/models';

export class BasePlay extends Play {
  constructor(public playName: string) {
    super();
  }
}
