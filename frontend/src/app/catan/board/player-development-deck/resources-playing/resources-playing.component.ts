import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PlayMonopoly, PlayResources} from '../../../services/plays/development';
import {assetsPath} from '../../../services/constants';

@Component({
  selector: 'app-resources-playing',
  templateUrl: './resources-playing.component.html',
  styleUrls: ['./resources-playing.component.css']
})
export class ResourcesPlayingComponent implements OnInit {
  @Output() back = new EventEmitter<void>();
  @Output() makePlay = new EventEmitter<PlayResources>();

  materialCardsPath = assetsPath.concat('/material_cards');
  woodImgPath = this.materialCardsPath.concat('wood.png');
  brickImgPath = this.materialCardsPath.concat('brick.png');
  sheepImgPath = this.materialCardsPath.concat('sheep.png');
  wheatImgPath = this.materialCardsPath.concat('wheat.png');
  stoneImgPath = this.materialCardsPath.concat('stone.png');

  resource1?: string;
  resource2?: string;

  constructor() { }

  ngOnInit(): void {
  }

  updateResources(newResource: string) {
    this.resource1 = this.resource2;
    this.resource2 = newResource;
  }

  goBack() {
    this.back.emit();
  }

  submit() {
    if (this.resource1 != null && this.resource2 != null) {
      this.makePlay.emit(new PlayResources(this.resource1, this.resource2));
    }
  }

}
