import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayCard} from '../../services/plays/play.card';
import {BlockPile} from '../../services/plays/block.pile';
import {SlowDownPile} from '../../services/plays/slow.down.pile';
import {ChooseStartingPlayer} from '../../services/plays/choose.starting.player';
import {Pile, PileReserve} from '../../services/models';
import {onFireCardList} from '../../services/constants';

@Component({
  selector: 'app-board-display',
  templateUrl: './board-display.component.html',
  styleUrls: ['./board-display.component.css']
})
export class BoardDisplayComponent implements OnInit {
  @Output() playCard = new EventEmitter<PlayCard>();
  @Output() blockPile = new EventEmitter<BlockPile>();
  @Output() slowDownPile = new EventEmitter<SlowDownPile>();
  @Output() chooseStartingPlayer = new EventEmitter<ChooseStartingPlayer>();
  @Output() endTurn = new EventEmitter<void>();

  @Input() gameStarted: boolean;
  @Input() isCurrentPlayer: boolean;
  @Input() piles: Pile[];
  @Input() blockedPiles: PileReserve[];
  @Input() slowedDownPiles: PileReserve[];
  @Input() minToPlayCards: number;
  @Input() onFire: boolean;
  @Input() name: string;
  @Input() nRemainingCards: number;
  @Input() nInitialCards: number;
  @Input() turn: number;
  @Input() deck: number[];

  selectedCard?: number = null;

  constructor() { }

  ngOnInit(): void {
  }

  onCardSelect(selectedCard: number) {
    // If it is not the player's turn we do nothing.
    if (!this.isCurrentPlayer) {
      return;
    }

    // Unselect card if previously selected and select it otherwise.
    if (this.selectedCard === selectedCard) {
      this.selectedCard = null;
    } else {
      this.selectedCard = selectedCard;
    }
  }

  onStartGame() {
    this.chooseStartingPlayer.emit(new ChooseStartingPlayer(name));
  }

  onCardPlay(pileId: number) {

    // If there is no selected card we can do nothing.
    if (this.selectedCard == null) {
      alert('You must selected the card you want to play first');
      return;
    }

    // Otherwise we check that the selected pile can in fact be played in the specified place.
    const selectedPile: Pile = this.getPileById(pileId);
    const pileLastCard: number = selectedPile.getLastCard();
    if ((selectedPile.ascending && (this.selectedCard > pileLastCard || this.selectedCard === pileLastCard - 10)) ||
      (!selectedPile.ascending && (this.selectedCard < pileLastCard || this.selectedCard === pileLastCard + 10))) {
      this.playCard.emit(new PlayCard(this.selectedCard, pileId));
      this.selectedCard = null;
    } else {
      alert('Selected card cannot be played in specified pile.');
    }
  }

  onBlockPile(pileId: number) {
    // Current player cannot block pile.
    if (this.isCurrentPlayer) {
      return;
    }

    this.blockPile.emit(new BlockPile(pileId));
  }

  onSlowDownPile(pileId: number) {
    // Current player cannot slow down pile.
    if (this.isCurrentPlayer) {
      return;
    }

    this.blockPile.emit(new BlockPile(pileId));
  }

  getPileById(pileId: number) {
    for (const pile of this.piles) {
      if (pile.id === pileId) {
        return pile;
      }
    }
    return null;
  }

  onEndTurn() {
    this.endTurn.emit();
    this.selectedCard = null;
  }

  canReservePile() {
    // Cannot reserve pile if game hasn't started.
    if (!this.gameStarted) {
      return false;
    }

    // Current player cannot reserve pile.
    return !this.isCurrentPlayer;
  }

  canPlayCard() {
    // Cannot play card if game hasn't started.
    if (!this.gameStarted) {
      return false;
    }

    // Only current player can play card.
    if (!this.isCurrentPlayer) {
      return false;
    }

    // cannot play card if no card is selected.
    return this.selectedCard != null;
  }

  canEndTurn() {
    // Cannot end turn if game hasn't started.
    if (!this.gameStarted) {
      return false;
    }

    // Only current player can end turn.
    if (!this.isCurrentPlayer) {
      return false;
    } else {
      const playedCards = this.nInitialCards - this.deck.length;

      // Turn can only be ended if enough cards where played.
      if (playedCards < this.minToPlayCards && !(this.nRemainingCards === 0 && playedCards > 0)) {
        return false;
      }

      // Turn cannot be ended if on playing game on fire and fire cards are on piles for more than 1 turn.
      for (const pile of this.piles) {
        const lastPileCard = pile.getLastCard();
        const lastPlayedTurn = pile.getLastAddedTurn();
        for (const onFireCard of onFireCardList) {
          if (onFireCard === lastPileCard && this.turn - lastPlayedTurn >= 1) {
            return false;
          }
        }
      }

      // If no on fire cards are on table then we can end turn.
      return true;
    }
  }
}
