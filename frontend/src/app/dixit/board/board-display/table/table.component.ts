import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ChooseCard} from '../../../services/plays/choose.card';
import {PlayedCard, ChosenCard} from '../../../services/models';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css', '../../../../services/common.styles.css']
})
export class TableComponent implements OnInit, OnChanges {
  @Output() chooseCard = new EventEmitter<ChooseCard>();
  @Output() endTurn = new EventEmitter<void>();

  @Input() storyTellerName: string;
  @Input() name: string;
  @Input() isStoryTeller: boolean;
  @Input() imageSet: string;
  @Input() inputPlayedCards: PlayedCard[];
  @Input() chosenCards: ChosenCard[];
  @Input() nPlayers: number;
  @Input() allChosen: boolean;
  @Input() allPlayed: boolean;
  @Input() cardDescription?: string;
  @Input() cardChosen: boolean;

  selectedCard?: number;
  showedCard?: number = null;
  shuffledPlayedCards: PlayedCard[];

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.inputPlayedCards.currentValue.firstChange) {
      return;
    }

    let nPlayedPrevious: number;
    const prevVal = changes.inputPlayedCards.previousValue;
    if (prevVal === undefined || prevVal === null) {
      nPlayedPrevious = 0;
    } else {
      nPlayedPrevious = prevVal.length;
    }
    const nPlayedCurrent = changes.inputPlayedCards.currentValue.length;

    // shuffle played cards once when all players have played.
    if (nPlayedCurrent === this.nPlayers && nPlayedPrevious !== this.nPlayers) {
      // Copy original array.
      this.shuffledPlayedCards = changes.inputPlayedCards.currentValue.slice(0, changes.inputPlayedCards.currentValue.length);

      // Actual shuffling.
      this.shuffledPlayedCards.sort(() => Math.random() - 0.5);
    }
  }

  getChosenPLayers(cardId: number): string[] {
    const playerList: string[] = [];
    for (const chosenCard of this.chosenCards) {
      if (chosenCard.cardId === cardId) {
        playerList.push(chosenCard.playerName);
      }
    }
    return playerList;
  }

  onCardSelected(cardId: number) {
    if (this.isStoryTeller) {
      return;
    }

    if (this.cardChosen) {
      return;
    }

    if (cardId === this.getPlayedCardID()) {
      return;
    }

    if (this.selectedCard === cardId) {
      this.selectedCard = null;
    } else {
      this.selectedCard = cardId;
    }
  }

  onChooseCard(selectedCard: number) {
    this.chooseCard.emit(new ChooseCard(selectedCard));
    this.selectedCard = null;
  }

  getPlayedCardID(): number {
    for (const playedCard of this.inputPlayedCards) {
      if (playedCard.playerName === this.name) {
        return playedCard.cardId;
      }
    }
  }

  getPlayedCards(): PlayedCard[] {
    if (!this.allPlayed) {
      return this.inputPlayedCards;
    } else {
      return this.shuffledPlayedCards;
    }
  }

  showCard(cardID: number) {
    if (this.allPlayed) {
      this.showedCard = cardID;
    }
  }

  hideCard() {
    this.showedCard = null;
  }
}
