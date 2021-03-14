import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DevelopmentDeck, MaterialsDeck} from '../../services/models';
import {assetsPath} from '../../services/constants';

@Component({
  selector: 'app-right-side-display',
  templateUrl: './right.side.display.component.html',
  styleUrls: ['./right.side.display.component.css', '../../../services/common.styles.css']
})
export class RightSideDisplayComponent implements OnInit, OnChanges {
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

  hasChanged = {wood: false, brick: false, sheep: false, wheat: false, stone: false, development: false};

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.materialsDeck.firstChange && changes.developmentDeck.firstChange) {
      return;
    }

    const currentMaterialsDeck: MaterialsDeck = changes.materialsDeck.currentValue;
    const previousMaterialsDeck: MaterialsDeck = changes.materialsDeck.previousValue;
    const currentDevelopmentDeck: DevelopmentDeck = changes.developmentDeck.currentValue;
    const previousDevelopmentDeck: DevelopmentDeck = changes.developmentDeck.previousValue;

    // If draw differently values that have changed.
    if (previousMaterialsDeck != null) {
      this.hasChanged.wood = currentMaterialsDeck.nWood !== previousMaterialsDeck.nWood;
      this.hasChanged.brick = currentMaterialsDeck.nBrick !== previousMaterialsDeck.nBrick;
      this.hasChanged.sheep = currentMaterialsDeck.nSheep !== previousMaterialsDeck.nSheep;
      this.hasChanged.wheat = currentMaterialsDeck.nWheat !== previousMaterialsDeck.nWheat;
      this.hasChanged.stone = currentMaterialsDeck.nStone !== previousMaterialsDeck.nStone;
    }
    if (previousDevelopmentDeck != null) {
      this.hasChanged.development = currentDevelopmentDeck.getNDevelopments() !== previousDevelopmentDeck.getNDevelopments();
    }
  }

  getNgClass(resource: string): object {
    return {
      'card-label': true,
      tooltip: true,
      'changed-number': this.hasChanged[resource]
    };
  }

  toggleShowInstructions(): void {
    this.showInstructions = !this.showInstructions;
  }

  getInstructionsHeader(): string {
    if (this.showInstructions) {
      return 'Hide instructions';
    } else {
      return 'Show instructions';
    }
  }

}
