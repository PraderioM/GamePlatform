import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LoginResponse} from '../services/state.service';


@Component({
  selector: 'app-registering',
  templateUrl: './registering.component.html',
  styleUrls: ['./registering.component.css']
})
export class RegisteringComponent implements OnInit {
  @Output() loggedIn = new EventEmitter<LoginResponse>();
  registering = false;

  ngOnInit() {
  }

  logIn(loginResponse: LoginResponse) {
    this.loggedIn.emit(loginResponse);
  }

  toggleRegistering() {
    this.registering = !this.registering;
  }

}
