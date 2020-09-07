import {Component, OnInit, EventEmitter, Output, Injectable, Input} from '@angular/core';
import {StateService} from './services/state.service';
import {HttpClient} from '@angular/common/http';
import {GameDescription} from './services/models';

@Component({
  selector: 'app-catan',
  templateUrl: './catan.component.html',
  styleUrls: ['./catan.component.css'],
  providers: [StateService, HttpClient],
})
export class CatanComponent implements OnInit {
  @Output() backToMenu = new EventEmitter<void>();
  @Input() token: string;
  @Input() name: string;

  selectionMode = true;
  description?: GameDescription;

  constructor() { }

  ngOnInit(): void {
  }

  enterSelectionMode() {
    this.selectionMode = true;
  }

  startGame(description: GameDescription) {
    this.description = description;
    this.selectionMode = false;
  }

}
