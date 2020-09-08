import {Injectable, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CatanComponent} from './catan.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {StateService} from '../services/state.service';
import { SelectionComponent } from './selection/selection.component';
import { BoardComponent } from './board/board.component';
import { NewGameDescriptionComponent } from './selection/new-game-description/new-game-description.component';
import { GameTableComponent } from './selection/game-table/game-table.component';
import { ActiveGamesBoardComponent } from './selection/game-table/active-games-board/active-games-board.component';
import { LeaderboardComponent } from './selection/game-table/leaderboard/leaderboard.component';
// tslint:disable-next-line:max-line-length
import {LeaderBoardRowDisplayComponent} from './selection/game-table/leaderboard/leader-board-row-display/leader-board-row-display.component';
import {BoardDisplayComponent} from './board/board-display/board-display.component';
import {RightSideDisplayComponent} from './board/right-side-display/right.side.display.component';
import {PlayersDisplayComponent} from './board/players-display/players-display.component';
import {PlayerDisplayComponent} from './board/players-display/player-display/player-display.component';
import {BuyComponent} from './board/buy/buy.component';
import {CommerceComponent} from './board/commerce/commerce.component';
import {MaterialsDeckComponent} from './board/materials-deck/materials-deck.component';
import {PlayerDevelopmentDeckComponent} from './board/player-development-deck/player-development-deck.component';
import {DiscardCardsDisplayComponent} from './board/discard-cards-display/discard-cards-display.component';
import {KnightPlayingComponent} from './board/player-development-deck/knight-playing/knight-playing.component';
import {MonopolyPlayingComponent} from './board/player-development-deck/monopoly-playing/monopoly-playing.component';
import {ResourcesPlayingComponent} from './board/player-development-deck/resources-playing/resources-playing.component';
import {RoadsPlayingComponent} from './board/player-development-deck/roads-playing/roads-playing.component';
import {StealPlayerComponent} from './board/steal-player/steal-player.component';
import {CommonComponentsModule} from '../services/common-components/common-components.module';


const DECLARATIONS: any[] = [
  CatanComponent,
  SelectionComponent,
  BoardComponent,
  NewGameDescriptionComponent,
  GameTableComponent,
  ActiveGamesBoardComponent,
  LeaderboardComponent,
  LeaderBoardRowDisplayComponent,
  BoardDisplayComponent,
  RightSideDisplayComponent,
  PlayersDisplayComponent,
  PlayerDisplayComponent,
  BuyComponent,
  CommerceComponent,
  MaterialsDeckComponent,
  PlayerDevelopmentDeckComponent,
  DiscardCardsDisplayComponent,
  KnightPlayingComponent,
  MonopolyPlayingComponent,
  ResourcesPlayingComponent,
  RoadsPlayingComponent,
  StealPlayerComponent,
];

const MODULES: any[] = [
  CommonModule,
  NgbModule,
  CommonComponentsModule,
];

@Injectable()
@NgModule({
  declarations: DECLARATIONS,
  exports: [
    CatanComponent,
  ],
  imports: MODULES,
  providers: [ HttpClientModule, StateService ],
})
export class CatanModule { }
