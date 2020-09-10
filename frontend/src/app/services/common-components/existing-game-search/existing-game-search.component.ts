import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-existing-game-search',
  templateUrl: './existing-game-search.component.html',
  styleUrls: ['./existing-game-search.component.css']
})
export class ExistingGameSearchComponent implements OnInit {
  @Output() enterGame = new EventEmitter<any>();
  @Output() back = new EventEmitter<void>();
  @Input() token: string;
  @Input() stateService: any;

  constructor() { }

  ngOnInit() {
  }
  async tryEnterGame(gameId: string) {
    const gameDescription = await this.stateService.enterGame(this.token, gameId);
    if (gameDescription.id != null) {
      this.enterGame.emit(gameDescription);
    } else {
      alert(gameDescription.description);
    }
  }

}
