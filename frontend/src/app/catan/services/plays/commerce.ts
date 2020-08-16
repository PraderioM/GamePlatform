import {BasePlay} from './base.play';
import {Offer} from '../models';

export class MakeOffer extends BasePlay {
  constructor(public offer: Offer) {
    super('make_offer');
  }
}

export class CommerceWithBank extends BasePlay {
  constructor(public offer: Offer) {
    super('commerce_with_bank');
  }
}

export class WithdrawOffer extends BasePlay {
  constructor() {
    super('withdraw_offer');
  }
}

export class AcceptOffer extends BasePlay {
  constructor() {
    super('accept_offer');
  }
}

export class RejectOffer extends BasePlay {
  constructor() {
    super('reject_offer');
  }
}
