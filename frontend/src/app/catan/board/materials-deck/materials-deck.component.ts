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

  materialCardsPath = assetsPath.concat('/material_cards');
  woodImgPath = this.materialCardsPath.concat('/wood.png');
  brickImgPath = this.materialCardsPath.concat('/brick.png');
  sheepImgPath = this.materialCardsPath.concat('/sheep.png');
  wheatImgPath = this.materialCardsPath.concat('/wheat.png');
  stoneImgPath = this.materialCardsPath.concat('/stone.png');

  hasChanged = {wood: false, brick: false, sheep: false, wheat: false, stone: false};

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
      this.hasChanged = {
        wood: currentDeck.nWood !== previousDeck.nWood,
        brick: currentDeck.nBrick !== previousDeck.nBrick,
        sheep: currentDeck.nSheep !== previousDeck.nSheep,
        wheat: currentDeck.nWheat !== previousDeck.nWheat,
        stone: currentDeck.nStone !== previousDeck.nStone
      };
    }
  }

  getNgClass(material: string) {
    return {
      'card-label': true,
      tooltip: true,
      'changed-number': this.hasChanged[material]
    };
  }

}
