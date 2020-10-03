import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {getImageURL} from '../../resolution.utils';
import { GameResolution } from '../../models';

@Component({
  selector: 'app-game-resolution-display',
  templateUrl: './game-resolution-display.component.html',
  styleUrls: ['./game-resolution-display.component.css']
})
export class GameResolutionDisplayComponent implements OnInit {
  @Output() backToMenu = new EventEmitter<void>();
  @Output() backToGame = new EventEmitter<void>();
  @Input() gameResolution: GameResolution;
  @Input() viewFinalGameState = false;


  constructor() { }

  ngOnInit() {
  }

  getImageUrl(): string {
    return getImageURL(this.gameResolution);
  }

}
