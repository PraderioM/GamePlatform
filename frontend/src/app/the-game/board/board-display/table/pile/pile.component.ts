import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pile',
  templateUrl: './pile.component.html',
  styleUrls: ['./pile.component.css']
})
export class PileComponent implements OnInit {
  @Output() playCard = new EventEmitter<number>();
  @Output() blockPile = new EventEmitter<void>();
  @Output() slowDownPile = new EventEmitter<void>();

  @Input() ascending: boolean;
  @Input() topCard: number;
  @Input() onFire: boolean;
  @Input() gameStarted: boolean;
  @Input() canPlayCard: boolean;
  @Input() canBlockPile: boolean;
  @Input() canSlowDownPile: boolean;
  @Input() blockingPlayerNameList: string[];
  @Input() slowingDownPlayerNameList: string[];
  @Input() selectedCard?: number;

  constructor() { }

  ngOnInit(): void {
  }

  getDirection() {
    if (this.ascending) {
      return 'ascending';
    } else {
      return 'descending';
    }
  }

  getBlockingNameString() {
    return this.getNameString(this.blockingPlayerNameList);
  }

  getSlowingDownNameString() {
    return this.getNameString(this.slowingDownPlayerNameList);
  }

  getNameString(nameList: string[]) {
    if (nameList.length === 0) {
      return '';
    }

    let joinedString = nameList[0];

    for (let i = 1; i < nameList.length; i++) {
      joinedString = joinedString + ', ' + nameList[i];
    }

    return joinedString;
  }

  isSelectedCardPlayable() {
    if (!this.canPlayCard) {
      return false;
    }

    if (this.selectedCard == null) {
      return false;
    } else {
      if (this.ascending) {
        return this.topCard < this.selectedCard || this.selectedCard === this.topCard - 10;
      } else {
        return this.topCard > this.selectedCard || this.selectedCard === this.topCard + 10;
      }
    }
  }
}
