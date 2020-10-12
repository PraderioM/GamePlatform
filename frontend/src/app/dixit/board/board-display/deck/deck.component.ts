import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DescribeCard} from '../../../services/plays/describe.card';
import {PlayCard} from '../../../services/plays/play.card';
import {getCardPath} from '../../../services/utils';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css', '../board-display.component.css', '../../../../services/common.styles.css']
})
export class DeckComponent implements OnInit {
  @Output() describeCard = new EventEmitter<DescribeCard>();
  @Output() playCard = new EventEmitter<PlayCard>();

  @Input() descriptionExists: boolean;
  @Input() cardPlayed: boolean;
  @Input() deck: number[];
  @Input() isStoryTeller: boolean;

  showAllCards = false;
  selectedCardId?: number = null;

  constructor() { }

  ngOnInit(): void {
  }

  toggleShowAllCards() {
    this.showAllCards = !this.showAllCards;
  }

  getCardPath(cardID: number): string {
    return getCardPath(cardID);
  }

  getClass(cardID: number) {
    return {
      'image-size': true,
      selected: this.selectedCardId === cardID
    };
  }

  onCardSelect(cardID: number) {
    if ((this.isStoryTeller && this.descriptionExists) || (!this.isStoryTeller && this.cardPlayed)) {
      return;
    }
    if (this.selectedCardId === cardID) {
      this.selectedCardId = null;
    } else {
      this.selectedCardId = cardID;
    }
  }

  onCardPlay() {
    this.playCard.emit(new PlayCard(this.selectedCardId));
  }

  onCardDescribe(cardDescription: string) {
    this.describeCard.emit(new DescribeCard(this.selectedCardId, cardDescription));
  }
}
