import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription} from '../../services/models';
import {StateService} from '../../services/state.service';
import {defaultDeckSize, defaultMinToPlayCards} from '../../services/constants';

@Component({
  selector: 'app-new-game-description',
  templateUrl: './new-game-description.component.html',
  styleUrls: ['./new-game-description.component.css']
})
export class NewGameDescriptionComponent implements OnInit {
  @Output() enterGame = new EventEmitter<GameDescription>();
  @Output() back = new EventEmitter<void>();
  @Input() token: string;

  isNPCCorrect = true;
  isPCCorrect = true;
  isDeckSizeCorrect = true;
  isMinToPlayCorrect = true;

  constructor(private stateService: StateService) { }

  ngOnInit() {
  }

  resetCorrectValues() {
    this.isNPCCorrect = true;
    this.isPCCorrect = true;
    this.isDeckSizeCorrect = true;
    this.isMinToPlayCorrect = true;
  }

  async tryCreateGame(npc: number, pc: number, onFire: boolean, deckSize: number, minToPlay: number) {
    this.resetCorrectValues();

    // Check that inputs are correct.
    if (isNaN(npc)) {
      alert('Number of non player characters must be a valid integer.');
      this.isNPCCorrect = false;
      return;
    } else if (npc < 0) {
      alert('Number of non player characters must be non negative.');
      this.isNPCCorrect = false;
      return;
    } else if (!Number.isInteger(npc)) {
      alert('Number of non player characters must be an integer.');
      this.isNPCCorrect = false;
      return;
    } else if (isNaN(pc)) {
      alert('Number of players must be a valid integer.');
      this.isPCCorrect = false;
      return;
    } else if (pc < 0) {
      alert('Number of players must be non negative.');
      this.isPCCorrect = false;
      return;
    } else if (!Number.isInteger(pc)) {
      alert('Number of players must be an integer.');
      this.isPCCorrect = false;
      return;
    } else if (pc + npc < 1) {
      alert('The total number of players must be at least 1.');
      this.isPCCorrect = false;
      this.isNPCCorrect = false;
      return;
    } else if (pc + npc > 5) {
      alert('The total number of players must be at most 5.');
      this.isPCCorrect = false;
      this.isNPCCorrect = false;
      return;
    } else if (isNaN(deckSize)) {
      deckSize = defaultDeckSize[pc + npc];
    } else if (!Number.isInteger(deckSize)) {
      alert('Deck size must be an integer.');
      this.isDeckSizeCorrect = false;
      return;
    } else if (deckSize < 1) {
      alert('Deck size must be at least 1.');
      this.isDeckSizeCorrect = false;
    } else if (isNaN(minToPlay)) {
      minToPlay = defaultMinToPlayCards;
    } else if (!Number.isInteger(minToPlay)) {
      alert('Number of minimum cards to play must be an integer.');
      this.isMinToPlayCorrect = false;
      return;
    } else if (minToPlay > deckSize) {
      alert('Players cannot play more than all cards in deck at any moment');
      this.isMinToPlayCorrect = false;
      this.isDeckSizeCorrect = false;
    }

    const gameDescription = await this.stateService.createGame(this.token, npc, pc, onFire, deckSize, minToPlay);
    if (gameDescription.id != null) {
      this.enterGame.emit(gameDescription);
    } else {
      alert(gameDescription.description);
    }
  }

  getNPCClass() {
    return {
      'number-input': true,
      'error-input': !this.isNPCCorrect
    };
  }

  getPCClass() {
    return {
      'number-input': true,
      'error-input': !this.isPCCorrect
    };
  }

  getDeckSizeClass() {
    return {
      'number-input': true,
      'error-input': !this.isDeckSizeCorrect
    };
  }

  getMinToPLayClass() {
    return {
      'number-input': true,
      'error-input': !this.isMinToPlayCorrect
    };
  }
}
