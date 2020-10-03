import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MaterialsDeck, Offer, Player} from '../../services/models';

@Component({
  selector: 'app-commerce',
  templateUrl: './commerce.component.html',
  styleUrls: ['./commerce.component.css']
})
export class CommerceComponent implements OnInit {
  @Input() allPlayers: Player[];
  @Input() materialsDeck: MaterialsDeck;
  @Input() isCurrentPlayer: boolean;
  @Input() offer?: Offer;
  @Input() name: string;

  @Output() makeOffer = new EventEmitter<Offer>();
  @Output() commerceWithBank = new EventEmitter<Offer>();
  @Output() acceptOffer = new EventEmitter<void>();
  @Output() rejectOffer = new EventEmitter<void>();
  @Output() withdrawOffer = new EventEmitter<void>();

  targetPlayers: Player[] = [];


  constructor() { }

  ngOnInit(): void { }

  getPossiblePlayers(): Player[] {
    const possiblePLayers: Player[] = [];
    for (const player of this.allPlayers) {
      if (player.name !== this.name) {
        possiblePLayers.push(new Player(false, 'black', 0, player.name));
      }
    }
    return possiblePLayers;
  }

  isOfferTarget() {
    if (this.offer == null) {
      return false;
    }

    for (const player of this.offer.targetPlayerList) {
      if (player.name === this.name) {
        return true;
      }
    }
    return false;
  }

  canAcceptOffer() {
    if (this.offer == null) {
      return false;
    }

    if (!this.isOfferTarget()) {
      return false;
    }

    const requestedDeck = this.offer.requestedDeck;
    let canAfford = this.materialsDeck.nWood >= requestedDeck.nWood;
    canAfford = canAfford && this.materialsDeck.nBrick >= requestedDeck.nBrick;
    canAfford = canAfford && this.materialsDeck.nSheep >= requestedDeck.nSheep;
    canAfford = canAfford && this.materialsDeck.nWheat >= requestedDeck.nWheat;
    canAfford = canAfford && this.materialsDeck.nStone >= requestedDeck.nStone;
    return canAfford;
  }

  onMakeOffer(giveWood: number, giveBrick: number, giveSheep: number, giveWheat: number, giveStone: number,
              getWood: number, getBrick: number, getSheep: number, getWheat: number, getStone: number) {
    const offer = this.getOffer(this.targetPlayers,
      giveWood, giveBrick, giveSheep, giveWheat, giveStone,
      getWood, getBrick, getSheep, getWheat, getStone);
    this.makeOffer.emit(offer);
  }

  onCommerceWithBank(giveWood: number, giveBrick: number, giveSheep: number, giveWheat: number, giveStone: number,
                     getWood: number, getBrick: number, getSheep: number, getWheat: number, getStone: number) {
    const offer = this.getOffer([],
      giveWood, giveBrick, giveSheep, giveWheat, giveStone,
      getWood, getBrick, getSheep, getWheat, getStone);
    this.commerceWithBank.emit(offer);
  }

  toggleTargetPlayer(playerName: string) {
    // Remove target player.
    if (this.isTargetPlayer(playerName)) {
      const newTargetPlayers: Player[] = [];
      for (const player of this.targetPlayers) {
        if (player.name !== playerName) {
          newTargetPlayers.push(player);
        }
      }
      this.targetPlayers = newTargetPlayers;
    } else {  // Add target player.
      this.targetPlayers.push(new Player(false, 'black', 0, playerName));
    }
  }

  isTargetPlayer(playerName: string) {
    for (const player of this.targetPlayers) {
      if (player.name === playerName) {
        return true;
      }
    }
    return false;
  }

  getOffer(targetPlayers: Player[],
           giveWood: number, giveBrick: number, giveSheep: number, giveWheat: number, giveStone: number,
           getWood: number, getBrick: number, getSheep: number, getWheat: number, getStone: number) {
    const offeredDeck = new MaterialsDeck(this.preProcessNumber(giveWood),
      this.preProcessNumber(giveBrick),
      this.preProcessNumber(giveSheep),
      this.preProcessNumber(giveWheat),
      this.preProcessNumber(giveStone));
    const requestedDeck = new MaterialsDeck(this.preProcessNumber(getWood),
      this.preProcessNumber(getBrick),
      this.preProcessNumber(getSheep),
      this.preProcessNumber(getWheat),
      this.preProcessNumber(getStone));
    return new Offer(new Player(false, 'black', 0, name), targetPlayers, offeredDeck, requestedDeck);
  }

  preProcessNumber(val: number): number {
    if (isNaN(val) || val < 0) {
      return 0;
    } else {
      return val;
    }
  }

  onWithdrawOffer() {
    this.withdrawOffer.emit();
  }

  onAccept() {
    if (this.canAcceptOffer()) {
      this.acceptOffer.emit();
    }
  }

  onReject() {
    this.rejectOffer.emit();
  }

  getOfferTargetNames(): string {
    if (this.offer == null) {
      return '';
    }
    const outNames: string[] = [];
    for (const player of this.targetPlayers) {
      outNames.push(player.name);
    }
    return outNames.join(', ');
  }
}
