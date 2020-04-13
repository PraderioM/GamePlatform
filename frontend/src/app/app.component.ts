import { Component } from '@angular/core';
import {StateService} from './services/state.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [StateService, HttpClient]
})
export class AppComponent {
  token?: string;
  loggedIn = false;

  logIn(token: string) {
    this.token = token;
    this.loggedIn = true;
  }

  logOut() {
    this.loggedIn = false;
  }
}
