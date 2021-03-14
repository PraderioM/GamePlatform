import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MaterialsDeck} from '../../services/models';
import {assetsPath} from '../../services/constants';

@Component({
  selector: 'app-materials-deck',
  templateUrl: './materials-deck.component.html',
  styleUrls: ['./materials-deck.component.css', '../../../services/common.styles.css']
})
export class MaterialsDeckComponent implements OnInit, OnChanges {
  @Input() materialsDeck: MaterialsDeck;
  @Input() nActions = -1;

  materialCardsPath = assetsPath.concat('/material_cards');
  woodImgPath = this.materialCardsPath.concat('/wood.png');
  brickImgPath = this.materialCardsPath.concat('/brick.png');
  sheepImgPath = this.materialCardsPath.concat('/sheep.png');
  wheatImgPath = this.materialCardsPath.concat('/wheat.png');
  stoneImgPath = this.materialCardsPath.concat('/stone.png');

  lastUpdatedAction = {wood: -2, brick: -2, sheep: -2, wheat: -2, stone: -2};

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.materialsDeck.firstChange) {
      return;
    }

    const currentDeck: MaterialsDeck = changes.materialsDeck.currentValue;
    const previousDeck: MaterialsDeck = changes.materialsDeck.previousValue;

    // If draw differently values that have changed.
    if (previousDeck != null) {
      this.lastUpdatedAction = {
        wood: (currentDeck.nWood !== previousDeck.nWood) ? this.nActions : this.lastUpdatedAction.wood,
        brick: (currentDeck.nBrick !== previousDeck.nBrick) ? this.nActions : this.lastUpdatedAction.brick,
        sheep: (currentDeck.nSheep !== previousDeck.nSheep) ? this.nActions : this.lastUpdatedAction.sheep,
        wheat: (currentDeck.nWheat !== previousDeck.nWheat) ? this.nActions : this.lastUpdatedAction.wheat,
        stone: (currentDeck.nStone !== previousDeck.nStone) ? this.nActions : this.lastUpdatedAction.stone,
      };
    }
  }

  getNgClass(material: string) {
    return {
      'card-label': true,
      tooltip: true,
      'changed-number': this.lastUpdatedAction[material] === this.nActions
    };
  }

}
