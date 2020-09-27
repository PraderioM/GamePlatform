import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MaterialsDeck} from '../../services/models';
import {assetsPath} from '../../services/constants';

@Component({
  selector: 'app-discard-cards-display',
  templateUrl: './discard-cards-display.component.html',
  styleUrls: ['./discard-cards-display.component.css', '../../../services/common.styles.css']
})
export class DiscardCardsDisplayComponent implements OnInit {
  @Input() materialsDeck: MaterialsDeck;

  @Output() discardCards = new EventEmitter<MaterialsDeck>();

  materialCardsPath = assetsPath.concat('/material_cards');
  woodImgPath = this.materialCardsPath.concat('/wood.png');
  brickImgPath = this.materialCardsPath.concat('/brick.png');
  sheepImgPath = this.materialCardsPath.concat('/sheep.png');
  wheatImgPath = this.materialCardsPath.concat('/wheat.png');
  stoneImgPath = this.materialCardsPath.concat('/stone.png');

  remainingDeck: MaterialsDeck;
  discardedDeck: MaterialsDeck;
  toDiscardCards: number;

  constructor() { }

  ngOnInit(): void {
    this.remainingDeck = new MaterialsDeck(this.materialsDeck.nWood, this.materialsDeck.nBrick, this.materialsDeck.nSheep,
      this.materialsDeck.nWheat, this.materialsDeck.nStone);
    this.discardedDeck = new MaterialsDeck();
    this.toDiscardCards = Math.floor((this.materialsDeck.nMaterials) / 2);
  }

  addToDiscardedDeck(material: string) {
    if (material === 'wood') {
      this.remainingDeck.nWood -= 1;
      this.discardedDeck.nWood += 1;
    } else if (material === 'brick') {
      this.remainingDeck.nBrick -= 1;
      this.discardedDeck.nBrick += 1;
    } else if (material === 'sheep') {
      this.remainingDeck.nSheep -= 1;
      this.discardedDeck.nSheep += 1;
    } else if (material === 'wheat') {
      this.remainingDeck.nWheat -= 1;
      this.discardedDeck.nWheat += 1;
    } else if (material === 'stone') {
      this.remainingDeck.nStone -= 1;
      this.discardedDeck.nStone += 1;
    }
  }

  removeFromDiscardedDeck(material: string) {
    if (material === 'wood') {
      this.remainingDeck.nWood += 1;
      this.discardedDeck.nWood -= 1;
    } else if (material === 'brick') {
      this.remainingDeck.nBrick += 1;
      this.discardedDeck.nBrick -= 1;
    } else if (material === 'sheep') {
      this.remainingDeck.nSheep += 1;
      this.discardedDeck.nSheep -= 1;
    } else if (material === 'wheat') {
      this.remainingDeck.nWheat += 1;
      this.discardedDeck.nWheat -= 1;
    } else if (material === 'stone') {
      this.remainingDeck.nStone += 1;
      this.discardedDeck.nStone -= 1;
    }
  }

  discard() {
    if (this.discardedDeck.getNMaterials() === this.toDiscardCards) {
      this.discardCards.emit(this.discardedDeck);
    }
  }

}
