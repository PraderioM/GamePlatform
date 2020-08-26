import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DevelopmentDeck, MaterialsDeck} from '../../services/models';
import {assetsPath} from '../../services/constants';

@Component({
  selector: 'app-options-display',
  templateUrl: './options-display.component.html',
  styleUrls: ['./options-display.component.css']
})
export class OptionsDisplayComponent implements OnInit {
  @Output() backToMenu = new EventEmitter<void>();
  @Input() gameId: string;
  @Input() materialsDeck: MaterialsDeck;
  @Input() developmentDeck: DevelopmentDeck;

  showInstructions = false;

  materialCardsPath = assetsPath.concat('/material_cards');
  woodImgPath = this.materialCardsPath.concat('/wood.png');
  brickImgPath = this.materialCardsPath.concat('/brick.png');
  sheepImgPath = this.materialCardsPath.concat('/sheep.png');
  wheatImgPath = this.materialCardsPath.concat('/wheat.png');
  stoneImgPath = this.materialCardsPath.concat('/stone.png');

  developmentImgPath = assetsPath.concat('/development_cards/deck.png');

  constructor() { }

  ngOnInit() {
  }

  toggleShowInstructions() {
    this.showInstructions = !this.showInstructions;
  }

  getInstructionsHeader() {
    if (this.showInstructions) {
      return 'Hide instructions';
    } else {
      return 'Show instructions';
    }
  }

}
