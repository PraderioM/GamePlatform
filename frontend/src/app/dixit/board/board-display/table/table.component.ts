import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ChooseCard} from '../../../services/plays/choose.card';
import {PlayedCard, ChosenCard} from '../../../services/models';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges {
  @Output() chooseCard = new EventEmitter<ChooseCard>();

  @Input() storyTellerName: string;
  @Input() imageSet: string;
  @Input() inputPlayedCards: PlayedCard[];
  @Input() chosenCards: ChosenCard[];
  @Input() nPlayers: number;
  @Input() allChosen: boolean;
  @Input() cardDescription?: string;
  @Input() cardChosen;

  selectedCard?: number;
  shuffledPlayedCards: PlayedCard[];
  allPlayed: boolean;

  constructor() { }

  ngOnInit(): void {
    this.allPlayed = this.inputPlayedCards.length === this.nPlayers;
  }

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
    if (this.cardChosen) {
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
  }

  getPlayedCards(): PlayedCard[] {
    if (!this.allPlayed) {
      return this.inputPlayedCards;
    } else {
      return this.shuffledPlayedCards;
    }
  }
}
