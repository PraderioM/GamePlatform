import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DevelopmentDeck, MaterialsDeck} from '../../services/models';
import {assetsPath} from '../../services/constants';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  @Input() materialsDeck: MaterialsDeck;
  @Input() developmentDeck: DevelopmentDeck;
  @Input() buildingElement: string;

  @Output() updateBuildingElement = new EventEmitter<string>();
  @Output() buyDevelopment = new EventEmitter<void>();

  canAffordRoad: boolean;
  canAffordSettlement: boolean;
  canAffordCity: boolean;
  canAffordDevelopment: boolean;

  dirPath = assetsPath.concat('/buy_images/');
  roadImgPath: string;
  settlementImgPath: string;
  cityImgPath: string;
  developmentImgPath: string;

  constructor() { }

  ngOnInit() {
    this.canAffordRoad = this.materialsDeck.nWood >= 1 && this.materialsDeck.nBrick >= 1;
    this.roadImgPath = this.canAffordRoad ? this.dirPath.concat('road.png') : this.dirPath.concat('road_blocked.png');

    this.canAffordSettlement = this.materialsDeck.nWood >= 1;
    this.canAffordSettlement = this.canAffordSettlement && this.materialsDeck.nBrick >= 1;
    this.canAffordSettlement = this.canAffordSettlement && this.materialsDeck.nSheep >= 1;
    this.canAffordSettlement = this.canAffordSettlement && this.materialsDeck.nWheat >= 1;
    if (this.canAffordSettlement) {
      this.settlementImgPath = this.dirPath.concat('settlement.png');
    } else {
      this.settlementImgPath = this.dirPath.concat('settlement_blocked.png');
    }

    this.canAffordCity = this.materialsDeck.nWheat >= 2 && this.materialsDeck.nStone >= 3;
    if (this.canAffordCity) {
      this.cityImgPath = this.dirPath.concat('city.png');
    } else {
      this.cityImgPath = this.dirPath.concat('city_blocked.png');
    }

    this.canAffordDevelopment = this.materialsDeck.nSheep >= 1;
    this.canAffordDevelopment = this.canAffordDevelopment && this.materialsDeck.nWheat >= 1;
    this.canAffordDevelopment = this.canAffordDevelopment && this.materialsDeck.nStone >= 1;
    this.canAffordDevelopment = this.canAffordDevelopment && this.developmentDeck.getNDevelopments() >= 1;
    if (this.canAffordDevelopment) {
      this.developmentImgPath = this.dirPath.concat('development.png');
    } else {
      this.developmentImgPath = this.dirPath.concat('development_blocked.png');
    }
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
