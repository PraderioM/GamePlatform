import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameDescription} from '../../services/models';
import { GameResolution } from '../../../services/models';
import {assetsPath} from '../../../services/constants';

@Component({
  selector: 'app-game-resolution-display',
  templateUrl: './game-resolution-display.component.html',
  styleUrls: ['./game-resolution-display.component.css']
})
export class GameResolutionDisplayComponent implements OnInit {
  @Output() backToMenu = new EventEmitter<void>();
  @Input() gameDescription: GameDescription;
  @Input() gameResolution: GameResolution;

  constructor() { }

  ngOnInit() {
  }

  getImageUrl() {
    let scope: string;
    let imageArray: string[];
    if (this.gameResolution.isLoser) {
      scope = '/loss-images';
      imageArray = ['img_1.png', 'img_2.png', 'img_3.png', 'img_4.png', 'img_5.png', 'img_6.png', 'img_7.png'];
    } else if (this.gameResolution.isTie) {
      scope = '/tie-images';
      imageArray = ['img_1.png'];
    } else if (this.gameResolution.isVictorious) {
      scope = '/win-images';
      imageArray = ['img_1.png'];
    } else if (this.gameResolution.isObserver) {
      scope = '/observing-images';
      imageArray = ['img_1.png'];
    } else {
      scope = '/wtf-images';
      imageArray = ['wtf.png'];
    }
    return assetsPath.concat(scope).concat('/').concat(imageArray[Math.floor(Math.random() * imageArray.length)]);

  }

}
