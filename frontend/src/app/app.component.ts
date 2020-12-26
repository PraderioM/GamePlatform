import { Component } from '@angular/core';
import {LoginResponse, StateService} from './services/state.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [StateService, HttpClient]
})
export class AppComponent {
  // todo uncomment.
  token?: string;
  name?: string;
  loggedIn = false;
  // token = 'token';
  // name = 'userName';
  // loggedIn = true;

  logIn(loginResponse: LoginResponse) {
    this.token = loginResponse.token;
    this.name = loginResponse.name;
    this.loggedIn = true;
  }

  logOut() {
    this.loggedIn = false;
  }
}
