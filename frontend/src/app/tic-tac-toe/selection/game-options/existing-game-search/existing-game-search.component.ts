import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription} from '../../../services/models';
import {StateService} from '../../../services/state.service';

@Component({
  selector: 'app-existing-game-search',
  templateUrl: './existing-game-search.component.html',
  styleUrls: ['./existing-game-search.component.css']
})
export class ExistingGameSearchComponent implements OnInit {
  @Output() enterGame = new EventEmitter<GameDescription>();
  @Output() closeComponent = new EventEmitter<void>();
  @Input() token: string;

  constructor(private stateService: StateService) { }

  ngOnInit() {
  }
  async tryEnterGame(gameId: string) {
    const gameDescription = await this.stateService.findGame(this.token, gameId);
    if (gameDescription.id != null) {
      this.enterGame.emit(gameDescription);
    } else {
      alert(gameDescription.description);
    }
  }

}
