import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription} from '../../../services/models';
import {StateService} from '../../../services/state.service';

@Component({
  selector: 'app-new-game-description',
  templateUrl: './new-game-description.component.html',
  styleUrls: ['./new-game-description.component.css']
})
export class NewGameDescriptionComponent implements OnInit {
  @Output() enterGame = new EventEmitter<GameDescription>();
  @Output() closeComponent = new EventEmitter<void>();
  @Input() token: string;

  constructor(private stateService: StateService) { }

  ngOnInit() {
  }

  async tryCreateGame(rows: number, cols: number, npc: number, pc: number, gravity: boolean) {
    const gameDescription = await this.stateService.createGame(this.token, rows, cols, npc, pc, gravity);
    if (gameDescription.id != null) {
      this.enterGame.emit(gameDescription);
    } else {
      alert(gameDescription.description);
    }
  }
}
