import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DevelopmentDeck, MaterialsDeck} from '../../services/models';
import {assetsPath} from '../../services/constants';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css', '../../../services/common.styles.css']
})
export class BuyComponent implements OnInit {
  @Input() materialsDeck: MaterialsDeck;
  @Input() developmentDeck: DevelopmentDeck;
  @Input() buildingElement: string;

  @Output() updateBuildingElement = new EventEmitter<string>();
  @Output() buyDevelopment = new EventEmitter<void>();


  dirPath = assetsPath.concat('/buy_images/');

  constructor() { }

  ngOnInit() {
  }

  canAffordRoad(): boolean {
    return this.materialsDeck.nWood >= 1 && this.materialsDeck.nBrick >= 1;
  }

  canAffordSettlement(): boolean {
    let canAfford = this.materialsDeck.nWood >= 1;
    canAfford = canAfford && this.materialsDeck.nBrick >= 1;
    canAfford = canAfford && this.materialsDeck.nSheep >= 1;
    canAfford = canAfford && this.materialsDeck.nWheat >= 1;
    return canAfford;
  }

  canAffordCity(): boolean {
    return this.materialsDeck.nWheat >= 2 && this.materialsDeck.nStone >= 3;
  }

  canAffordDevelopment(): boolean {
    let canAfford = this.materialsDeck.nSheep >= 1;
    canAfford = canAfford && this.materialsDeck.nWheat >= 1;
    canAfford = canAfford && this.materialsDeck.nStone >= 1;
    canAfford = canAfford && this.developmentDeck.getNDevelopments() >= 1;
    return canAfford;
  }


  getRoadImgPath(): string {
    if (this.canAffordRoad()) {
      return this.dirPath.concat('road.png');
    } else {
      return this.dirPath.concat('road_blocked.png');
    }
  }

  getSettlementImgPath(): string {
    if (this.canAffordSettlement()) {
      return this.dirPath.concat('settlement.png');
    } else {
      return this.dirPath.concat('settlement_blocked.png');
    }
  }

  getCityImgPath(): string {
    if (this.canAffordCity()) {
      return this.dirPath.concat('city.png');
    } else {
      return this.dirPath.concat('city_blocked.png');
    }
  }

  getDevelopmentImgPath(): string {
    if (this.canAffordDevelopment()) {
      return this.dirPath.concat('development.png');
    } else {
      return this.dirPath.concat('development_blocked.png');
    }
  }

  getNgClass(name: string): object {
    return {logo: true, selected: this.buildingElement === name};
  }

  onRoadClick() {
    console.log('can afford road ', this.canAffordRoad());
    if (this.canAffordRoad()) {
      this.updateBuildingElement.emit('road');
    }
    console.log(this.buildingElement);
  }

  onSettlementClick() {
    if (this.canAffordSettlement()) {
      this.updateBuildingElement.emit('settlement');
    }
  }

  onCityClick() {
    if (this.canAffordCity()) {
      this.updateBuildingElement.emit('city');
    }
  }

  onDevelopmentClick() {
    if (this.canAffordDevelopment()) {
      this.buyDevelopment.emit();
    }
  }
}
