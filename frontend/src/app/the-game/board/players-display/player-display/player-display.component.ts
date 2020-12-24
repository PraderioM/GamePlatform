import {Component, Input, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-player-display',
  templateUrl: './player-display.component.html',
  styleUrls: ['./player-display.component.css']
})
export class PlayerDisplayComponent implements OnInit {
  @Input() name: string;
  @Input() nCards: number;
  @Input() gameStarted: boolean;
  @Input() isCurrent: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
