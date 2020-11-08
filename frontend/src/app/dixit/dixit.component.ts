import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription, Player} from './services/models';

@Component({
  selector: 'app-dixit',
  templateUrl: './dixit.component.html',
  styleUrls: ['./dixit.component.css']
})
export class DixitComponent implements OnInit {
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
