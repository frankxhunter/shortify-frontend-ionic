import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IonCardContent, IonCard, IonButton, IonIcon, IonItem, IonInput, IonSpinner } from "@ionic/angular/standalone";
import { ShortfyIconComponent } from "../icons/shortfy-icon/shortfy-icon.component";
import { GoogleIconComponent } from "../icons/google-icon/google-icon.component";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ApiService } from 'src/app/services/api-service/api-service';
import { User } from 'src/app/Dtos/interfaces';
import { AuthService } from 'src/app/services/auth-service/auth-service';
import { GoogleLoginButtonComponent } from "../buttons/google-login-button/google-login-button.component";


const messagesForLogin = {
  login: {
    iconMessage: 'Welcome back',
    titleMessage: 'Log in',
    buttonMessage: 'Log in',
    changeButton: 'Don\'t have an account? Sign up'
  },
  signup: {
    iconMessage: 'Create your account to get started',
    titleMessage: 'Sign up',
    buttonMessage: 'Create account',
    changeButton: 'Already have an account? Log in'
  }
}

const enum LOGIN_TYPE { LOGIN = "login", SIGNUP = "signup" }



@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
  imports: [IonSpinner, IonInput, IonItem, IonIcon, IonButton, IonCard, IonCardContent, ShortfyIconComponent, GoogleIconComponent, ReactiveFormsModule, NgClass, GoogleLoginButtonComponent],
})
export class LogInComponent implements OnInit {

  typeOfLogin = LOGIN_TYPE.SIGNUP
  messages = messagesForLogin[this.typeOfLogin]

  apiService = inject(ApiService)
  authService = inject(AuthService)
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
        this.errorText = "Google login failed";
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
        this.errorText = 'Email is required';
        return;
      }
      else {
        this.errorText = 'Invalid email format';
        return;
      }
    }

    if (password?.touched && password.invalid) {
      if (password.errors?.['required']) {
        this.errorText = 'Password is required';
        return;
      }
      else {
        this.errorText = 'Password must contain uppercase, lowercase, number and symbol (8-16 chars)';
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
