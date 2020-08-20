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

  possiblePLayers: Player[];
  targetPlayers: Player[] = [];

  giveWood = 0;
  giveBrick = 0;
  giveSheep = 0;
  giveWheat = 0;
  giveStone = 0;

  getWood = 0;
  getBrick = 0;
  getSheep = 0;
  getWheat = 0;
  getStone = 0;


  constructor() { }

  ngOnInit(): void {
    this.possiblePLayers = [];
    for (const player of this.allPlayers) {
      if (player.name !== name) {
        this.possiblePLayers.push(new Player(false, 'black', 0, player.name));
      }
    }
  }

  isOfferTarget() {
    if (this.offer == null) {
      return false;
    }

    for (const player of this.offer.targetPlayerList) {
      if (player.name === name) {
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

  onMakeOffer() {
    const offer = this.getOffer(this.targetPlayers);
    this.makeOffer.emit(offer);
  }

  onCommerceWithBank() {
    const offer = this.getOffer([]);
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

  getOffer(targetPlayers: Player[]) {
    const offeredDeck = new MaterialsDeck(this.giveWood, this.giveBrick, this.giveSheep, this.giveWheat, this.giveStone);
    const requestedDeck = new MaterialsDeck(this.getWood, this.getBrick, this.getSheep, this.getWheat, this.getStone);
    return new Offer(new Player(false, 'black', 0, name), targetPlayers, offeredDeck, requestedDeck);
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

  updateGiveWood(val: string) {
    this.giveWood = this.valueFromString(val, this.giveWood, this.materialsDeck.nWood);
  }

  updateGiveBrick(val: string) {
    this.giveBrick = this.valueFromString(val, this.giveBrick, this.materialsDeck.nBrick);
  }

  updateGiveSheep(val: string) {
    this.giveSheep = this.valueFromString(val, this.giveSheep, this.materialsDeck.nSheep);
  }

  updateGiveWheat(val: string) {
    this.giveWheat = this.valueFromString(val, this.giveWheat, this.materialsDeck.nWheat);
  }

  updateGiveStone(val: string) {
    this.giveStone = this.valueFromString(val, this.giveStone, this.materialsDeck.nStone);
  }

  updateGetWood(val: string) {
    this.getWood = this.valueFromString(val, this.getWood);
  }

  updateGetBrick(val: string) {
    this.getBrick = this.valueFromString(val, this.getBrick);
  }

  updateGetSheep(val: string) {
    this.getSheep = this.valueFromString(val, this.getSheep);
  }

  updateGetWheat(val: string) {
    this.getWheat = this.valueFromString(val, this.getWheat);
  }

  updateGetStone(val: string) {
    this.getStone = this.valueFromString(val, this.getStone);
  }

  valueFromString(val: string, defaultValue: number, maxValue?: number, minValue: number = 0) {
    if (val === '') {
      return -1;
    } else {
      const newVal = parseInt(val, 10);

      // Only return value if it is an integer between the minimum and the maximum.
      if (isNaN(newVal)) {
        return defaultValue;
      } else if (newVal < minValue) {
        return minValue;
      } else if (maxValue != null && newVal > maxValue) {
        return maxValue;
      } else {
        return newVal;
      }
    }
  }

}
