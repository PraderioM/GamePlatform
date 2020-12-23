import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription} from '../dixit/services/models';

@Component({
  selector: 'app-the-game',
  templateUrl: './the-game.component.html',
  styleUrls: ['./the-game.component.css']
})
export class TheGameComponent implements OnInit {
  @Output() backToMenu = new EventEmitter<void>();
  @Input() token: string;
  @Input() name: string;

  selectionMode = true;
  description?: GameDescription;

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
