import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StateService} from '../services/state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [StateService, HttpClient]
})
export class HomeComponent {
  @Output() loggedOut = new EventEmitter<void>();
  @Input() token: string;
  gameNames: string[] = ['tic-tac-toe'];
  gameSelections: boolean[];

  constructor(private stateService: StateService) {
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
}
