import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MaterialsDeck} from '../../services/models';
import {assetsPath} from '../../services/constants';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  @Input() materialsDeck: MaterialsDeck;
  @Input() buildingElement: string;

  @Output() updateBuildingElement = new EventEmitter<string>();
  @Output() buyDevelopment = new EventEmitter<void>();



  canAffordRoad = this.materialsDeck.nWood >= 1 && this.materialsDeck.nBrick >= 1;
  canAffordSettlement = this.materialsDeck.nWood * this.materialsDeck.nBrick * this.materialsDeck.nSheep * this.materialsDeck.nWheat >= 1;
  canAffordCity = this.materialsDeck.nWheat >= 2 && this.materialsDeck.nStone >= 3;
  canAffordDevelopment = this.materialsDeck.nSheep >= 1 && this.materialsDeck.nWheat >= 1 && this.materialsDeck.nStone >= 1;

  dirPath = assetsPath.concat('/buy_images');
  roadImgPath = this.canAffordRoad ? this.dirPath.concat('road.png') : this.dirPath.concat('road_blocked.png');
  settlementImgPath = this.canAffordSettlement ? this.dirPath.concat('settlement.png') : this.dirPath.concat('settlement_blocked.png');
  cityImgPath = this.canAffordCity ? this.dirPath.concat('city.png') : this.dirPath.concat('city_blocked.png');
  developmentImgPath = this.canAffordDevelopment ? this.dirPath.concat('development.png') : this.dirPath.concat('development_blocked.png');

  constructor() { }

  ngOnInit(): void {
  }

  onRoadClick() {
    if (this.canAffordRoad) {
      this.updateBuildingElement.emit('road');
    }
  }

  onSettlementClick() {
    if (this.canAffordSettlement) {
      this.updateBuildingElement.emit('settlement');
    }
  }

  onCityClick() {
    if (this.canAffordCity) {
      this.updateBuildingElement.emit('city');
    }
  }

  onDevelopmentClick() {
    if (this.canAffordDevelopment) {
      this.buyDevelopment.emit();
    }
  }

}
