import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {StateService, LoginResponse} from '../../services/state.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() login = new EventEmitter<LoginResponse>();
  @Output() goToRegister = new EventEmitter<void>();
  incorrectName = false;
  incorrectPassword = false;

  constructor(private stateService: StateService) { }

  ngOnInit() {
  }

  async tryLogIn(name: string, password: string) {

    const response = await this.stateService.login(name, password);

    if (response.token != null) {
      console.log('Successfully logged in.');
      this.login.emit(response);
    } else {
      this.incorrectName = response.incorrectName;
      this.incorrectPassword = response.incorrectPassword;
      alert(response.errorMessage);
    }
  }

}
