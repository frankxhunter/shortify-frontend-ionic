import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IonCardContent, IonCard, IonButton, IonIcon, IonItem, IonInput, IonSpinner } from "@ionic/angular/standalone";
import { ShortfyIconComponent } from "../icons/shortfy-icon/shortfy-icon.component";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ApiService } from 'src/app/services/url-manager/url-strategy/api-service/api-service';
import { User } from 'src/app/Dtos/interfaces';
import { AuthService } from 'src/app/services/auth-service/auth-service';
import { GoogleLoginButtonComponent } from "../buttons/google-login-button/google-login-button.component";
import { I18nService } from 'src/app/services/i18n/i18n.service';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';


const messagesForLogin = {
  login: {
    iconMessage: 'auth.login.iconMessage',
    titleMessage: 'auth.login.titleMessage',
    buttonMessage: 'auth.login.buttonMessage',
    changeButton: 'auth.login.changeButton'
  },
  signup: {
    iconMessage: 'auth.signup.iconMessage',
    titleMessage: 'auth.signup.titleMessage',
    buttonMessage: 'auth.signup.buttonMessage',
    changeButton: 'auth.signup.changeButton'
  }
}

const enum LOGIN_TYPE { LOGIN = "login", SIGNUP = "signup" }



@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
  imports: [TranslatePipe, IonSpinner, IonInput, IonItem, IonIcon, IonButton, IonCard, IonCardContent, ShortfyIconComponent, ReactiveFormsModule, NgClass, GoogleLoginButtonComponent],
})
export class LogInComponent implements OnInit {

  typeOfLogin = LOGIN_TYPE.SIGNUP
  messages = messagesForLogin[this.typeOfLogin]

  apiService = inject(ApiService)
  authService = inject(AuthService)
  i18nService = inject(I18nService)
  @Output() changeToVerificationEmailEvent = new EventEmitter<User>();

  form!: FormGroup;
  errorText = ''
  showPassword = false;
  loading = false;
  loadingGoogleButton = false;

  constructor(private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)(?!.*\s).{8,16}$/)]],
    })

    this.form.valueChanges.subscribe(() => {
      this.updateErrorMessage()
    })
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.updateErrorMessage();
    } else {
      this.loading = true;
      if (this.typeOfLogin == LOGIN_TYPE.SIGNUP) {
        this.registerUser();
      } else {
        this.loginUser();
      }
    }
  }
  loginUser() {
    this.authService.login(this.getValueForm()).subscribe({
      next: () => {
        console.log('Login succesfully');
        this.clearErrorText()
        this.loading = false;
        this.redirectToHome();
      },
      error: (error) => {
        console.log('Login error');
        console.log(error);
        this.errorText = error.error
        this.loading = false;
      },
    })
  }

  registerUser() {
    this.authService.register(this.getValueForm()).subscribe({
      next: () => {
        console.log('Register successfully')
        this.clearErrorText()
        this.checkLogin()
        this.loading = false;
        this.changeToVerificationEmailEvent.emit(this.form.value)
      },
      error: (error) => {
        this.errorText = error.error
        this.loading = false;
      }
    })
  }
  checkLogin() {
    this.authService.checkSession().subscribe({
      next: (response) => {
        console.log('Check login succesfully');
        console.log(response);
      },
      error: (error) => {
        console.log(error);
        this.errorText = error
      }
    })
  }

  loginWithGoogle(token: string) {
    this.loadingGoogleButton = true;
    
    this.authService.googleAuth(token).subscribe({
      next: () => {
        console.log('Google login success');
        this.clearErrorText()
        this.loadingGoogleButton = false;
        this.redirectToHome();
      },
      error: (err) => {
        console.log(err);
        this.errorText = this.i18nService.translate('auth.googleLoginFailed');
        this.loadingGoogleButton = false;
      }
    })

  }

  changeLoginType() {
    this.typeOfLogin === LOGIN_TYPE.SIGNUP ? this.typeOfLogin = LOGIN_TYPE.LOGIN : this.typeOfLogin = LOGIN_TYPE.SIGNUP
    this.messages = messagesForLogin[this.typeOfLogin]
  }

  redirectToHome() {
    this.router.navigate([''])
  }

  updateErrorMessage() {
    const email = this.form.get('email');
    const password = this.form.get('password');

    if (email?.touched && email.invalid) {
      if (email.errors?.['required']) {
        this.errorText = this.i18nService.translate('auth.emailRequired');
        return;
      }
      else {
        this.errorText = this.i18nService.translate('auth.invalidEmail');
        return;
      }
    }

    if (password?.touched && password.invalid) {
      if (password.errors?.['required']) {
        this.errorText = this.i18nService.translate('auth.passwordRequired');
        return;
      }
      else {
        this.errorText = this.i18nService.translate('auth.invalidPassword');
        return;
      }
    }
    this.errorText = '';
  }

  isInvalidControl(field: string) {
    return this.form.get(field)?.touched && this.form.get(field)?.invalid
  }

  getValueForm(): User {
    return {
      ...this.form.value
    }
  }
  clearErrorText() {
    this.errorText = ''
  }

}
