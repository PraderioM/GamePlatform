import {Component, OnInit, EventEmitter, Output, Injectable, Input} from '@angular/core';
import {StateService} from '../services/state.service';
import {HttpClient} from '@angular/common/http';
import {GameDescription} from './services/models';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css'],
  providers: [StateService, HttpClient],
})
export class TicTacToeComponent implements OnInit {
  @Output() backToMenu = new EventEmitter<void>();
  @Input() token: string;

  selectionMode = true;
  description?: GameDescription;

  constructor() { }

  ngOnInit(): void {
  }

  toggleSelectionMode() {
    this.selectionMode = !this.selectionMode;
  }

  startGame(description: GameDescription) {
    this.description = description;
    this.toggleSelectionMode();
  }

}
