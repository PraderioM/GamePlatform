import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PlayRoads} from '../../../services/plays/development';

@Component({
  selector: 'app-roads-playing',
  templateUrl: './roads-playing.component.html',
  styleUrls: ['./roads-playing.component.css']
})
export class RoadsPlayingComponent implements OnInit {
  @Output() back = new EventEmitter<void>();
  @Output() makePlay = new EventEmitter<PlayRoads>();

  constructor() { }

  ngOnInit(): void {
  }

  goBack() {
    this.back.emit();
  }

  submit() {
    this.makePlay.emit(new PlayRoads());
  }

}
