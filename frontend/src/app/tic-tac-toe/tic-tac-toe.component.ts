import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent implements OnInit {
  @Output() backToMenu = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
