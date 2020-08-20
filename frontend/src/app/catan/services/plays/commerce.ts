import {BasePlay} from './base.play';
import {Offer} from '../models';



export class CommercePlay extends BasePlay {
  constructor(public playName: string, public offer: Offer) {
    super(playName);
  }
}

export class MakeOffer extends CommercePlay {
  constructor(public offer: Offer) {
    super('make_offer', offer);
  }
}

export class CommerceWithBank extends CommercePlay {
  constructor(public offer: Offer) {
    super('commerce_with_bank', offer);
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
