import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LoginResponse, StateService} from '../../services/state.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() login = new EventEmitter<LoginResponse>();
  @Output() goToLogin = new EventEmitter<void>();
  nameFailed = false;
  passwordFailed = false;
  passwordConfirmFailed = false;

  constructor(private stateService: StateService) { }

  ngOnInit() {
  }

  async tryRegister(name: string, password: string, confirmPassword: string) {
    const response = await this.stateService.register(name, password, confirmPassword);
    if (response.token != null) {
      this.login.emit(response);
      console.log('Successfully logged out');
    } else {
      this.nameFailed = response.incorrectName;
      this.passwordFailed = response.incorrectPassword;
      this.passwordConfirmFailed = response.incorrectPasswordConfirm;
      alert(response.errorMessage);
    }
  }
}
