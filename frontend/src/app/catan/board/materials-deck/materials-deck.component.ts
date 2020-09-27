import {Component, Input, OnInit} from '@angular/core';
import {MaterialsDeck} from '../../services/models';
import {assetsPath} from '../../services/constants';

@Component({
  selector: 'app-materials-deck',
  templateUrl: './materials-deck.component.html',
  styleUrls: ['./materials-deck.component.css', '../../../services/common.styles.css']
})
export class MaterialsDeckComponent implements OnInit {
  @Input() materialsDeck: MaterialsDeck;

  materialCardsPath = assetsPath.concat('/material_cards');
  woodImgPath = this.materialCardsPath.concat('/wood.png');
  brickImgPath = this.materialCardsPath.concat('/brick.png');
  sheepImgPath = this.materialCardsPath.concat('/sheep.png');
  wheatImgPath = this.materialCardsPath.concat('/wheat.png');
  stoneImgPath = this.materialCardsPath.concat('/stone.png');

  constructor() { }

  ngOnInit(): void {
  }

}
