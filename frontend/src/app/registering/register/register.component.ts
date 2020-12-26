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
  nameConfirmFailed = false;

  constructor(private stateService: StateService) { }

  ngOnInit() {
  }

  async tryRegister(name: string, confirmName: string) {
    const response = await this.stateService.register(name, confirmName);
    if (response.token != null) {
      const loginResponse = new LoginResponse();
      loginResponse.name = name;
      loginResponse.token = response.token;
      this.login.emit(loginResponse);
      console.log('Successfully logged out');
    } else {
      this.nameFailed = response.incorrectName;
      this.nameConfirmFailed = response.incorrectNameConfirm;
      alert(response.errorMessage);
    }
  }
}
