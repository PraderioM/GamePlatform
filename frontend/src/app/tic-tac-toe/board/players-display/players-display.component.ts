import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Player} from '../../services/models';

@Component({
  selector: 'app-players-display',
  templateUrl: './players-display.component.html',
  styleUrls: ['./players-display.component.css']
})
export class PlayersDisplayComponent implements OnInit {
  @Input() players: Player[];
  @Input() currentPlayer: number;

  constructor() { }

  ngOnInit() {
  }

}
