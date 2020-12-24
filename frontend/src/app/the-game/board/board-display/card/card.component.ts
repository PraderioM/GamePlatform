import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {fireImgPath, onFireCardList} from '../../../services/constants';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Output() selectCard = new EventEmitter<void>();

  @Input() cardNumber: number;
  @Input() selected: boolean;
  @Input() onFire: boolean;

  fireImgPath = fireImgPath;

  constructor() { }

  ngOnInit(): void {
  }

  isOnFireCard() {
    // If we are not playing in on fire mode then no card is on fire.
    if (!this.onFire) {
      return false;
    }

    // Otherwise we check if card is among on fire cards.
    for (const onFireCard of onFireCardList) {
      if (onFireCard === this.cardNumber) {
        return true;
      }
    }
    return false;
  }

  getNgClass() {
    return {
      'on-fire': this.isOnFireCard(),
      selected: this.selected,
      card: true
    };
  }
}
