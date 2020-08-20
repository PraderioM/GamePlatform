import {Injectable, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CatanComponent} from './catan.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {StateService} from '../services/state.service';
import { SelectionComponent } from './selection/selection.component';
import { BoardComponent } from './board/board.component';
import { ExistingGameSearchComponent } from './selection/existing-game-search/existing-game-search.component';
import { GameOptionsComponent } from './selection/game-options/game-options.component';
import { NewGameDescriptionComponent } from './selection/new-game-description/new-game-description.component';
import { GameTableComponent } from './selection/game-table/game-table.component';
import { ActiveGamesBoardComponent } from './selection/game-table/active-games-board/active-games-board.component';
import { LeaderboardComponent } from './selection/game-table/leaderboard/leaderboard.component';
// tslint:disable-next-line:max-line-length
import {LeaderBoardRowDisplayComponent} from './selection/game-table/leaderboard/leader-board-row-display/leader-board-row-display.component';
import {BoardDisplayComponent} from './board/board-display/board-display.component';
import {GameResolutionDisplayComponent} from './board/game-resolution-display/game-resolution-display.component';
import {OptionsDisplayComponent} from './board/options-display/options-display.component';
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


const DECLARATIONS: any[] = [
  CatanComponent,
  SelectionComponent,
  BoardComponent,
  ExistingGameSearchComponent,
  GameOptionsComponent,
  NewGameDescriptionComponent,
  GameTableComponent,
  ActiveGamesBoardComponent,
  LeaderboardComponent,
  LeaderBoardRowDisplayComponent,
  BoardDisplayComponent,
  GameResolutionDisplayComponent,
  OptionsDisplayComponent,
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
];

const MODULES: any[] = [
  CommonModule,
  NgbModule,
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
