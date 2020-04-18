import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription} from '../../services/models';

@Component({
  selector: 'app-game-options',
  templateUrl: './game-options.component.html',
  styleUrls: ['./game-options.component.css']
})
export class GameOptionsComponent implements OnInit {
  @Output() enterGameCreation = new EventEmitter<void>();
  @Output() enterGameFinding = new EventEmitter<void>();
  @Output() backToGameSelection = new EventEmitter<void>();
  @Input() token: string;

  constructor() { }

  ngOnInit() {
  }

}
