import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css', '../../../../services/common.styles.css']
})
export class DeckComponent implements OnInit {
  @Output() selectCard = new EventEmitter<number>();

  @Input() deck: number[];
  @Input() onFire: boolean;
  @Input() selectedCard?: number;
  @Input() isCurrentPlayer: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  onCardSelected(cardNumber: number) {
    this.selectCard.emit(cardNumber);
  }

  getCardWidth(cardNumber: number): number {
    return Math.ceil(Math.log10(cardNumber)) * 20;
  }

  getHeaderMessage() {
    if (this.selectedCard == null) {
      return 'It\'s your turn to select a card.';
    } else {
      return 'Play the card in one of the available piles or select another card.';
    }
  }
}
