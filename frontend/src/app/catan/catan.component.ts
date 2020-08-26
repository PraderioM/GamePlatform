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

  // Todo change back.
  // selectionMode = true;
  // description?: GameDescription;
  selectionMode = false;
  description: GameDescription = GameDescription.fromJSON({
    "players": [
      {
        "points":0,
        "name":"PraderioM",
        "color":"red",
        "materialsDeck":{"nWood":0,"nBrick":0,"nSheep":0,"nWheat":0,"nStone":0,"nMaterials":0},
        "developmentDeck":{"nKnight":0,"nMonopoly":0,"nResources":0,"nRoads":0,"nPoint":0},
        "diceThrown":false,
        "cardsDiscarded":true
      },
      {
        "points":0,
        "name":'enemy',
        "color":"blue",
        "materialsDeck":{"nWood":0,"nBrick":0,"nSheep":0,"nWheat":0,"nStone":0,"nMaterials":0},
        "developmentDeck":{"nKnight":0,"nMonopoly":0,"nResources":0,"nRoads":0,"nPoint":0},
        "diceThrown":false,
        "cardsDiscarded":true
      },
      {
        "points":0,
        "name": 'ally',
        "color": "green",
        "materialsDeck":{"nWood":0,"nBrick":0,"nSheep":0,"nWheat":0,"nStone":0,"nMaterials":0},
        "developmentDeck":{"nKnight":0,"nMonopoly":0,"nResources":0,"nRoads":0,"nPoint":0},
        "diceThrown":false,
        "cardsDiscarded":true
      }
  ],
    "currentPlayer":0,
    "description":"successfully obtained game.",
    "id":"143d0a1f-fa9e-4565-be8a-7a1a19664df4",
    "plays":[],
    "turn":0,
    "developmentDeck":{"nKnight":0,"nMonopoly":0,"nResources":0,"nRoads":0,"nPoint":0},
    materialsDeck:{"nWood":0,"nBrick":0,"nSheep":0,"nWheat":0,"nStone":0,"nMaterials":0},
    "landList":[
      {"landType":"wheat","value":6},
      {"landType":"wood","value":3},
      {"landType":"sheep","value":8},
      {"landType":"brick","value":4},
      {"landType":"desert","value":7},
      {"landType":"wood","value":8},
      {"landType":"stone","value":10},
      {"landType":"wheat","value":11},
      {"landType":"brick","value":12},
      {"landType":"sheep","value":10},
      {"landType":"wood","value":5},
      {"landType":"wood","value":4},
      {"landType":"wood","value":9},
      {"landType":"wood","value":5},
      {"landType":"stone","value":9},
      {"landType":"wheat","value":12},
      {"landType":"brick","value":3},
      {"landType":"brick","value":12},
      {"landType":"wheat","value":6},
      {"landType":"sheep","value":2},
      {"landType":"stone","value":5},
      {"landType":"brick","value":4},
      {"landType":"wheat","value":6},
      {"landType":"wheat","value":3},
      {"landType":"stone","value":9},
      {"landType":"desert","value":7},
      {"landType":"sheep","value":8},
      {"landType":"sheep","value":11},
      {"landType":"stone","value":11},
      {"landType":"sheep","value":10}
      ],
    "extended":true,
    "thiefPosition":4,
    "knightPlayer":null,
    "longRoadPlayer":null,
    "discardCards":false,
    "thiefMoved":true,
    "toBuildRoads":0,
    "lastDiceResult":7,
    "hasEnded":false,
    "offer":null
  });

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
