import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription, Play} from '../services/models';
import {StateService} from '../services/state.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Output() backToMenu = new EventEmitter<void>();
  @Input() token: string;
  @Input() description?: GameDescription;

  interval;

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
    }
  }

  async makePlay(play: Play) {
    await this.stateService.makePlay(this.token, play, this.description.id);
  }

}
