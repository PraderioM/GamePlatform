import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StateService} from '../services/state.service';
import {TicTacToeModule} from '../tic-tac-toe/tic-tac-toe.module';
import {SudokuModule} from '../sudoku/sudoku.module';
import {CatanModule} from '../catan/catan.module';
import {DixitModule} from '../dixit/dixit.module';
import {TheGameModule} from '../the-game/the-game.module';
import {RockPaperScissorsModule} from '../rock-paper-scissors/rock-paper-scissors.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [StateService, HttpClient, TicTacToeModule, SudokuModule, CatanModule, DixitModule, TheGameModule, RockPaperScissorsModule]
})
export class HomeComponent {
  @Output() loggedOut = new EventEmitter<void>();
  @Input() token: string;
  @Input() name: string;
  gameNames: string[] = ['tic-tac-toe', 'SuDoKu', 'CATAN', 'DiXiT', 'the GAME', 'rock-paper-scissors'];
  gameSelections: boolean[];

  constructor(private stateService: StateService) {
    // todo uncomment.
    // this.gameSelections = [false, false, false, false, true, false];
    this.gameSelections = [];
    for (const name of this.gameNames) {
      this.gameSelections.push(false);
    }
  }

  async logOut() {
    this.loggedOut.emit();
    await this.stateService.setToken(this.token);
    await this.stateService.logout();
  }

  selectGame(name: string) {
    for (let i = 0; i < this.gameNames.length; i++) {
      if (this.gameNames[i] === name) {
        this.gameSelections[i] = true;
      }
    }
  }

  isAnyGameSelected() {
    let anySelected = false;
    for (const selected of this.gameSelections) {
      anySelected = anySelected || selected;
    }
    return anySelected;
  }

  deSelectGames() {
    for (let i = 0; i < this.gameSelections.length; i++) {
      this.gameSelections[i] = false;
    }
  }

  isSelected(name: string) {
    for (let i = 0; i < this.gameNames.length; i++) {
      if (this.gameNames[i] === name) {
        return this.gameSelections[i];
      }
    }
    return false;
  }

  getClass() {
    return {
      'vaso-container': this.name === 'Vaso',
    };
  }
}
