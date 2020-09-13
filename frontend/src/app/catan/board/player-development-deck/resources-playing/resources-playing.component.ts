import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PlayResources} from '../../../services/plays/development';
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
  imgPaths = {
    wood: this.materialCardsPath.concat('/wood.png'),
    brick: this.materialCardsPath.concat('/brick.png'),
    sheep: this.materialCardsPath.concat('/sheep.png'),
    wheat: this.materialCardsPath.concat('/wheat.png'),
    stone: this.materialCardsPath.concat('/stone.png'),
  };

  resource1?: string;
  resource2?: string;

  constructor() { }

  ngOnInit(): void {
  }

  updateResource1(newResource: string) {
    if (newResource === this.resource1) {
      this.resource1 = null;
    } else {
      this.resource1 = newResource;
    }
  }

  updateResource2(newResource: string) {
    if (newResource === this.resource2) {
      this.resource2 = null;
    } else {
      this.resource2 = newResource;
    }
  }

  goBack() {
    this.back.emit();
  }

  submit() {
    if (this.resource1 != null && this.resource2 != null) {
      this.makePlay.emit(new PlayResources(this.resource1, this.resource2));
      this.back.emit();
    }
  }

  getNgClass1(material: string) {
    return {card: true,
      'selected-card': this.resource1 === material,
    };
  }

  getNgClass2(material: string) {
    return {card: true,
      'selected-card': this.resource2 === material,
    };
  }

  getMaterials(): string[] {
    return ['wood', 'brick', 'sheep', 'wheat', 'stone'];
  }

}
