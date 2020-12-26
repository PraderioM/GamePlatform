import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription, Pile} from './services/models';
import {Player} from './services/models';

@Component({
  selector: 'app-the-game',
  templateUrl: './the-game.component.html',
  styleUrls: ['./the-game.component.css']
})
export class TheGameComponent implements OnInit {
  @Output() backToMenu = new EventEmitter<void>();
  @Input() token: string;
  @Input() name: string;

  // todo uncomment.
  // selectionMode = true;
  // description?: GameDescription;
  selectionMode = false;
  description = new GameDescription([new Player([2, 3, 5, 6, 7, 23, 78, 45], false, [], [], 6)],
    [new Pile(true, 0, 22), new Pile(true, 1), new Pile(false, 2), new Pile(false, 3)],
    [4, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22], null, true, 0, 8, 2);

  constructor() { }

  ngOnInit(): void {
  }

  enterSelectionMode() {
    this.selectionMode = true;
  }

  startGame(description: GameDescription) {
    this.description = description;
    this.selectionMode = false;
  }

}
