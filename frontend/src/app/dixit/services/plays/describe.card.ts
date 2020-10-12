import {BasePlay} from './base.play';

export class DescribeCard extends BasePlay {
  constructor(public cardId: number, public description: string) {
    super('describe_card');
  }
}
