import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonCardContent, IonCard, IonButton, IonIcon, IonItem, IonInput } from "@ionic/angular/standalone";
import { ShortfyIconComponent } from "../icons/shortfy-icon/shortfy-icon.component";
import { GoogleIconComponent } from "../icons/google-icon/google-icon.component";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';


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
  imports: [IonInput, IonItem, IonIcon, IonButton, IonCard, IonCardContent, ShortfyIconComponent, GoogleIconComponent, ReactiveFormsModule, NgClass],
})
export class LogInComponent implements OnInit {

  typeOfLogin = LOGIN_TYPE.SIGNUP

  messages = messagesForLogin[this.typeOfLogin]

  form!: FormGroup;
  errorText = ''
  showPassword = false;

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

  changeLoginType() {
    this.typeOfLogin === LOGIN_TYPE.SIGNUP ? this.typeOfLogin = LOGIN_TYPE.LOGIN : this.typeOfLogin = LOGIN_TYPE.SIGNUP
    this.messages = messagesForLogin[this.typeOfLogin]
  }

  redirectToHome() {
    this.router.navigate([''])
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.updateErrorMessage();
      console.log('error');
      console.log(this.form.value)
    } else {
      console.log('send it');
      console.log(this.form.value)
    }
  }

  private updateErrorMessage() {
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

  isInvalidControl(field: string){
    return this.form.get(field)?.touched && this.form.get(field)?.invalid
  }

}
