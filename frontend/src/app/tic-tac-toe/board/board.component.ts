import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription, Play} from '../services/models';
import {GameResolution} from '../../services/models';
import {StateService} from '../services/state.service';
import { GameResolutionDisplayComponent } from '../../services/common-components/game-resolution-display/game-resolution-display.component';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Output() backToMenu = new EventEmitter<void>();
  @Input() token: string;
  @Input() name: string;
  @Input() description: GameDescription;

  interval;
  gameResolution: GameResolution;
  isPlaying = true;
  // Todo write correct instructions.
  instructions: string = 'Call Sergi Sanchez (0034 650 38 79 93) he\'ll explain everything or die trying.\nHe\'ll be damned ' +
                         'for the rest of eternity muajajajajajajaja';

  constructor(private stateService: StateService) { }

  ngOnInit() {
    this.updateGame();
  }

  async updateGame() {
    const description = await this.stateService.getGameUpdate(this.token, this.description.id);
    if (! (description === undefined || description == null) && description.id != null) {
      this.description = description;
      const hasEnded = description.rows * description.cols <= description.plays.length;
      if (hasEnded) {
        await this.endGame();
        return;
      }
    }
    await delay(500);
    await this.updateGame();
  }

  async makePlay(play: Play) {
    await this.stateService.makePlay(this.token, play, this.description.id);
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
}
