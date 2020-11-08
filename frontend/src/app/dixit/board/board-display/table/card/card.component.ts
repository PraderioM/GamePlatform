import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {getCardPath, getCardBackPath} from '../../../../services/utils';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css', '../../board-display.component.css', '../../../../../services/common.styles.css']
})
export class CardComponent implements OnInit {
  @Output() selectCard = new EventEmitter<void>();
  @Output() zoomCard = new EventEmitter<void>();

  @Input() selected: boolean;
  @Input() cardId: number;
  @Input() showCard: boolean;
  @Input() showResults: boolean;
  @Input() isCorrectCard: boolean;
  @Input() nPlayers: number;
  @Input() playerName: string;
  @Input() chosenNames: string[];
  @Input() imageSet: string;

  constructor() { }

  ngOnInit(): void {
  }

  getCardPath(): string {
    return getCardPath(this.cardId, this.imageSet);
  }

  getCardBackPath() {
    return getCardBackPath(this.imageSet);
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
      if (nChosen === 0 || nChosen === this.nPlayers - 1) {
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
