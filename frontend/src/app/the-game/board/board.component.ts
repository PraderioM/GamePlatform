import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription, PileReserve} from '../services/models';
import {GameResolution} from '../../services/models';
import {StateService} from '../services/state.service';
import {PlayCard} from '../services/plays/play.card';
import {EndTurn} from '../services/plays/end.turn';
import {BlockPile} from '../services/plays/block.pile';
import {SlowDownPile} from '../services/plays/slow.down.pile';
import {ChooseStartingPlayer} from '../services/plays/choose.starting.player';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css', '../../services/common.styles.css']
})
export class BoardComponent implements OnInit {
  @Output() backToMenu = new EventEmitter<void>();
  @Input() token: string;
  @Input() name: string;
  @Input() description: GameDescription;

  interval;
  gameResolution: GameResolution;
  isPlaying = true;
  link = 'https://nsv.de/wp-content/uploads/2018/05/the-game-english.pdf';
  updateInterval = 500;

  constructor(private stateService: StateService) { }

  ngOnInit() {
    this.updateGame();
  }

  async updateGame() {
    const description = await this.stateService.getGameUpdate(this.token, this.description.id);

    if (!(description === undefined || description == null) && description.id != null) {
      this.description = description;

      if (description.hasEnded) {
        await this.endGame();
        return;
      }
    }
    setTimeout(this.updateGame.bind(this), this.updateInterval);
  }

  async playCard(play: PlayCard) {
    await this.stateService.playCard(this.token, play, this.description.id);
  }

  async blockPile(play: BlockPile) {
    await this.stateService.blockPile(this.token, play, this.description.id);
  }

  async slowDownPile(play: SlowDownPile) {
    await this.stateService.slowDownPile(this.token, play, this.description.id);
  }

  async chooseStartingPlayer(play: ChooseStartingPlayer) {
    await this.stateService.chooseStartingPlayer(this.token, play, this.description.id);
  }

  async endGame() {
    clearInterval(this.interval);
    this.gameResolution = await this.stateService.endGame(this.token, this.description.id);
    this.isPlaying = false;
  }

  onBackToMenu() {
    clearInterval(this.interval);
    this.backToMenu.emit();
  }

  gameStarted() {
    return this.description != null && this.description.currentPlayer != null;
  }

  async onTurnEnd() {
    await this.stateService.endTurn(this.token, new EndTurn(), this.description.id);
  }

  getDeck(): number[] {
    for (const player of this.description.playerList) {
      if (player.name === this.name) {
        return player.deck;
      }
    }
    return [];
  }

  getBlockedPiles() {
    const blockedPiles: PileReserve[] = [];
    for (const player of this.description.playerList) {
      for (const pileId of player.blockedPileList) {
        blockedPiles.push(new PileReserve(player.name, pileId));
      }
    }
    return blockedPiles;
  }

  getSlowedDownPiles() {
    const slowedDownPiles: PileReserve[] = [];
    for (const player of this.description.playerList) {
      for (const pileId of player.slowedDownPileList) {
        slowedDownPiles.push(new PileReserve(player.name, pileId));
      }
    }
    return slowedDownPiles;
  }

  getPiles() {
    return this.description.pileList;
  }

  getCurrentPlayerName() {
    if (this.description.currentPlayer == null) {
      return null;
    } else {
      return this.description.getCurrentPlayer().name;
    }
  }

  getNRemainingCards() {
    return this.description.remainingCards.length;
  }

  getCurrentPlayerInitialCards() {
    if (this.description.currentPlayer == null) {
      return this.description.deckSize;
    } else {
      return this.description.getCurrentPlayer().originalDeckLength;
    }
  }

  getBackgroundColor() {
    if (this.name === 'Rosaria') {
      return 'white';
    }
  }
}
