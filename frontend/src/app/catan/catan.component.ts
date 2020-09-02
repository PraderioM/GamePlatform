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
  // selectionMode = false;
  // description: GameDescription = GameDescription.fromJSON({
  //   "players":[
  //     {
  //       "points":0,
  //       "name":"PraderioM",
  //       "color":"red",
  //       "materialsDeck":{0:1,3:2,1:3,2:4,4:1},
  //       "developmentDeck":{0:1,1:1,2:1,3:1,4:1},
  //       "diceThrown":false,
  //       "cardsDiscarded":true
  //     },
  //     {
  //       "points":0,
  //       "name":"enemy",
  //       "color":"blue",
  //       "materialsDeck":{0:0,3:0,1:0,2:0,4:0},
  //       "developmentDeck":{0:0,1:0,2:0,3:0,4:0},
  //       "diceThrown":false,
  //       "cardsDiscarded":true
  //     },
  //     {
  //       "points":0,
  //       "name":"ally",
  //       "color":"green",
  //       "materialsDeck":{0:0,3:0,1:0,2:0,4:0},
  //       "developmentDeck":{0:0,1:0,2:0,3:0,4:0},
  //       "diceThrown":false,
  //       "cardsDiscarded":true
  //     },
  //   ],
  //   "currentPlayer":0,
  //   "description":"successfully obtained game.",
  //   "id":"30531a1a-15d1-4020-82e9-9ed2332359b7",
  //   "plays":[
  //     {
  //       'color': 'red',
  //       'playName': 'build_settlement',
  //       'position': [2, 3, 17]
  //     },
  //     {
  //       'color': 'red',
  //       'playName': 'build_road',
  //       'position': [2, 3]
  //     },
  //     {
  //       'color': 'blue',
  //       'playName': 'build_road',
  //       'position': [2, -19]
  //     },
  //     {
  //       'color': 'red',
  //       'playName': 'build_settlement',
  //       'position': [24, 25, 29]
  //     },
  //     {
  //       'color': 'red',
  //       'playName': 'build_city',
  //       'position': [24, 25, 29]
  //     },
  //     {
  //       'color': 'red',
  //       'playName': 'build_road',
  //       'position': [24, 25]
  //     },
  //     {
  //       'color': 'blue',
  //       'playName': 'build_settlement',
  //       'position': [6, 7, 20]
  //     }
  //   ],
  //   "turn":0,
  //   "developmentDeck":{0:20,1:3,2:3,3:3,4:5},
  //   "materialsDeck":{0:0,3:0,1:0,2:0,4:0},
  //   "landList":[
  //     {"landType":"wood","value":4},
  //     {"landType":"desert","value":7},
  //     {"landType":"wheat","value":8},
  //     {"landType":"stone","value":10},
  //     {"landType":"wheat","value":11},
  //     {"landType":"stone","value":12},
  //     {"landType":"brick","value":10},
  //     {"landType":"wheat","value":5},
  //     {"landType":"stone","value":4},
  //     {"landType":"brick","value":9},
  //     {"landType":"wood","value":5},
  //     {"landType":"sheep","value":9},
  //     {"landType":"wood","value":12},
  //     {"landType":"wheat","value":3},
  //     {"landType":"sheep","value":12},
  //     {"landType":"desert","value":7},
  //     {"landType":"wheat","value":6},
  //     {"landType":"sheep","value":2},
  //     {"landType":"wood","value":5},
  //     {"landType":"wheat","value":4},
  //     {"landType":"brick","value":6},
  //     {"landType":"brick","value":3},
  //     {"landType":"wood","value":9},
  //     {"landType":"stone","value":8},
  //     {"landType":"wood","value":11},
  //     {"landType":"stone","value":11},
  //     {"landType":"sheep","value":10},
  //     {"landType":"brick","value":6},
  //     {"landType":"sheep","value":3},
  //     {"landType":"sheep","value":8}
  //     ],
  //   "extended":true,
  //   "thiefPosition":1,
  //   "knightPlayer":null,
  //   "longRoadPlayer":null,
  //   "discardCards":false,
  //   "thiefMoved":true,
  //   "toBuildRoads":0,
  //   "lastDiceResult":7,
  //   "hasEnded":false,
  //   "offer":null
  // });

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
