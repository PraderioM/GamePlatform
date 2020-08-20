import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PlayKnight} from '../../../services/plays/development';

@Component({
  selector: 'app-knight-playing',
  templateUrl: './knight-playing.component.html',
  styleUrls: ['./knight-playing.component.css']
})
export class KnightPlayingComponent implements OnInit {
  @Output() back = new EventEmitter<void>();
  @Output() makePlay = new EventEmitter<PlayKnight>();

  constructor() { }

  ngOnInit(): void {
  }

  goBack() {
    this.back.emit();
  }

  submit() {
    this.makePlay.emit(new PlayKnight());
  }

}
