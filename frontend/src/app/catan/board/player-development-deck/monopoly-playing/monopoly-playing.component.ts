import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PlayMonopoly} from '../../../services/plays/development';
import {assetsPath} from '../../../services/constants';

@Component({
  selector: 'app-monopoly-playing',
  templateUrl: './monopoly-playing.component.html',
  styleUrls: ['./monopoly-playing.component.css']
})
export class MonopolyPlayingComponent implements OnInit {
  @Output() back = new EventEmitter<void>();
  @Output() makePlay = new EventEmitter<PlayMonopoly>();

  materialCardsPath = assetsPath.concat('/material_cards');
  woodImgPath = this.materialCardsPath.concat('wood.png');
  brickImgPath = this.materialCardsPath.concat('brick.png');
  sheepImgPath = this.materialCardsPath.concat('sheep.png');
  wheatImgPath = this.materialCardsPath.concat('wheat.png');
  stoneImgPath = this.materialCardsPath.concat('stone.png');

  constructor() { }

  ngOnInit(): void {
  }

  goBack() {
    this.back.emit();
  }

  submit(material: string) {
    this.makePlay.emit(new PlayMonopoly(material));
  }

}
