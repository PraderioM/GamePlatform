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
  instructions = 'Follow this <a href="https://www.smbc-comics.com/comic/2011-01-21">link</a> for instructions on how to play.';

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
      let nActivePlayers = 0;
      for (const player of description.playerList) {
        if (player.isActive) {
          nActivePlayers += 1;
        }
      }
      if (description.hasEnded) {
        await this.endGame();
      }
    }
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
