import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription} from '../services/models';
import {StateService} from '../services/state.service';
import {Play} from '../services/models';
import {GameResolution} from '../../services/models';

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
  link = 'https://www.smbc-comics.com/comic/2011-01-21';

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
    setTimeout(this.updateGame.bind(this), 500);
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
