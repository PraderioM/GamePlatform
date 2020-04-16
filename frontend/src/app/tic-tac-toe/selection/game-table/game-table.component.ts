import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription} from '../../services/models';

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.css']
})
export class GameTableComponent implements OnInit {
  @Output() enterGame = new EventEmitter<GameDescription>();
  @Input() token: string;
  showActive = true;

  constructor() { }

  ngOnInit() {
  }

  toggleShowed() {
    this.showActive = !this.showActive;
  }
}
