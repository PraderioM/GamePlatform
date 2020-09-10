import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription} from '../services/models';
import {StateService} from '../services/state.service';
import {Play} from '../services/models';
import {GameResolution} from '../../services/models';
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
  instructions = 'Follow this <a href="https://www.smbc-comics.com/comic/2011-01-21">link</a> for instructions on how to play.';

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
