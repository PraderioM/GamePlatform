import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MaterialsDeck} from '../../services/models';
import {assetsPath} from '../../services/constants';

@Component({
  selector: 'app-discard-cards-display',
  templateUrl: './discard-cards-display.component.html',
  styleUrls: ['./discard-cards-display.component.css']
})
export class DiscardCardsDisplayComponent implements OnInit {
  @Input() materialsDeck: MaterialsDeck;

  @Output() discardCards = new EventEmitter<MaterialsDeck>();

  materialCardsPath = assetsPath.concat('/material_cards');
  woodImgPath = this.materialCardsPath.concat('wood.png');
  brickImgPath = this.materialCardsPath.concat('brick.png');
  sheepImgPath = this.materialCardsPath.concat('sheep.png');
  wheatImgPath = this.materialCardsPath.concat('wheat.png');
  stoneImgPath = this.materialCardsPath.concat('stone.png');

  remainingDeck = new MaterialsDeck(this.materialsDeck.nWood, this.materialsDeck.nBrick, this.materialsDeck.nSheep,
                                    this.materialsDeck.nWheat, this.materialsDeck.nStone);
  discardedDeck = new MaterialsDeck();
  toDiscardCards = Math.floor((this.materialsDeck.nMaterials + 1) / 2);

  constructor() { }

  ngOnInit(): void {
  }

  addToDiscardedDeck(material: string) {
    if (material === 'wood') {
      this.materialsDeck.nWood -= 1;
      this.discardedDeck.nWood += 1;
    } else if (material === 'brick') {
      this.materialsDeck.nBrick -= 1;
      this.discardedDeck.nBrick += 1;
    } else if (material === 'sheep') {
      this.materialsDeck.nSheep -= 1;
      this.discardedDeck.nSheep += 1;
    } else if (material === 'wheat') {
      this.materialsDeck.nWheat -= 1;
      this.discardedDeck.nWheat += 1;
    } else if (material === 'stone') {
      this.materialsDeck.nStone -= 1;
      this.discardedDeck.nStone += 1;
    }
  }

  removeFromDiscardedDeck(material: string) {
    if (material === 'wood') {
      this.materialsDeck.nWood += 1;
      this.discardedDeck.nWood -= 1;
    } else if (material === 'brick') {
      this.materialsDeck.nBrick += 1;
      this.discardedDeck.nBrick -= 1;
    } else if (material === 'sheep') {
      this.materialsDeck.nSheep += 1;
      this.discardedDeck.nSheep -= 1;
    } else if (material === 'wheat') {
      this.materialsDeck.nWheat += 1;
      this.discardedDeck.nWheat -= 1;
    } else if (material === 'stone') {
      this.materialsDeck.nStone += 1;
      this.discardedDeck.nStone -= 1;
    }
  }

  discard() {
    if (this.discardedDeck.getNMaterials() === this.toDiscardCards) {
      this.discardCards.emit(this.discardedDeck);
    }
  }

}
