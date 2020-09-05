import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription} from '../../services/models';
import {StateService} from '../../services/state.service';

@Component({
  selector: 'app-new-game-description',
  templateUrl: './new-game-description.component.html',
  styleUrls: ['./new-game-description.component.css']
})
export class NewGameDescriptionComponent implements OnInit {
  @Output() enterGame = new EventEmitter<GameDescription>();
  @Output() back = new EventEmitter<void>();
  @Input() token: string;

  constructor(private stateService: StateService) { }

  ngOnInit() {
  }

  async tryCreateGame(npc: number, pc: number, expansion: boolean) {
    const gameDescription = await this.stateService.createGame(this.token, npc, pc, expansion);
    console.log(gameDescription.id);
    if (gameDescription.id != null) {
      console.log('new game: enter game success');
      this.enterGame.emit(gameDescription);
    } else {
      console.log('new game: enter game failed');
      alert(gameDescription.description);
    }
  }
}
