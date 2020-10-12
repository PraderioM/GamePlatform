import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {cardBackPath} from '../../../../services/constants';
import {getCardPath} from '../../../../services/utils';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css', '../board-display.component.css', '../../../../services/common.styles.css']
})
export class CardComponent implements OnInit {
  @Output() selectCard = new EventEmitter<void>();

  @Input() selected: boolean;
  @Input() cardId: number;
  @Input() showCard: boolean;
  @Input() showResults: boolean;
  @Input() isCorrectCard: boolean;
  @Input() nPlayers: number;
  @Input() playerName: string;
  @Input() chosenNames: string[];

  constructor() { }

  ngOnInit(): void {
  }

  getCardPath(): string {
    if (this.showCard) {
      return getCardPath(this.cardId);
    } else {
      return cardBackPath;
    }
  }

  getClass() {
    return {
      'image-size': true,
      selected: this.selected
    };
  }

  getNameClass() {
    return {
      'story-teller-name': this.isCorrectCard
    };
  }

  getCardPlayingMessage(): string {
    const nChosen = this.chosenNames.length;
    let points;
    if (this.isCorrectCard) {
      if (nChosen === 0 || nChosen === this.nPlayers) {
        points = 0;
      } else {
        points = 3;
      }
    } else {
      points = nChosen;
    }
    return this.playerName + ' +' + points.toString();
  }

  getCardChoosingMessage(name: string): string {
    const points = this.isCorrectCard ? 3 : 0;
    return name + ' +' + points.toString();
  }
}
