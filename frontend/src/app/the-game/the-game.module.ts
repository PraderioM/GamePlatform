import {Injectable, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TheGameComponent } from './the-game.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonComponentsModule} from '../services/common-components/common-components.module';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {StateService} from './services/state.service';
import {BoardComponent} from './board/board.component';
import {BoardDisplayComponent} from './board/board-display/board-display.component';
import {DeckComponent} from './board/board-display/deck/deck.component';
import {TableComponent} from './board/board-display/table/table.component';
import {PlayersDisplayComponent} from './board/players-display/players-display.component';
import {PlayerDisplayComponent} from './board/players-display/player-display/player-display.component';
import {SelectionComponent} from './selection/selection.component';
import {GameTableComponent} from './selection/game-table/game-table.component';
import {NewGameDescriptionComponent} from './selection/new-game-description/new-game-description.component';
import {ActiveGamesBoardComponent} from './selection/game-table/active-games-board/active-games-board.component';
import {CardComponent} from './board/board-display/card/card.component';
import {PileComponent} from './board/board-display/table/pile/pile.component';

const DECLARATIONS: any[] = [
  BoardComponent,
  BoardDisplayComponent,
  CardComponent,
  DeckComponent,
  TableComponent,
  PileComponent,
  PlayersDisplayComponent,
  PlayerDisplayComponent,
  SelectionComponent,
  GameTableComponent,
  ActiveGamesBoardComponent,
  NewGameDescriptionComponent,
  TheGameComponent,
];

const MODULES: any[] = [
  CommonModule,
  NgbModule,
  CommonComponentsModule,
  ReactiveFormsModule,
];

@Injectable()
@NgModule({
  declarations: DECLARATIONS,
  exports: [
    TheGameComponent
  ],
  imports: MODULES,
  providers: [ HttpClientModule, StateService ],
})
export class TheGameModule { }
