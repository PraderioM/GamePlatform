import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {onFireCardList} from '../../../services/constants';

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

  constructor() { }

  ngOnInit(): void {
  }

  onCardSelected(cardNumber: number) {
    this.selectCard.emit(cardNumber);
  }
}
