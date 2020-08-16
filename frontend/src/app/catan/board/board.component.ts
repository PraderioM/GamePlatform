import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription} from '../services/models';
import {GameResolution} from '../../services/models';
import {StateService} from '../services/state.service';
import {BasePlay} from '../services/plays/base.play';

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

  constructor(private stateService: StateService) { }

  ngOnInit() {

    this.interval = setInterval(() => {
      this.updateGame();
    }, 200);
  }

  async updateGame() {
    const description = await this.stateService.findGame(this.token, this.description.id);
    if (description.id != null) {
      this.description = description;
      if (description.hasEnded) {
        await this.endGame();
      }
    }
  }

  async makePlay(play: BasePlay) {
    // Todo implement for different plays.
    // await this.stateService.makePlay(this.token, play, this.description.id);
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
