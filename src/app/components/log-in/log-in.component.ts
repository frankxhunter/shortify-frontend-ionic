import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonCardContent, IonCard, IonButton, IonIcon, IonItem, IonInput } from "@ionic/angular/standalone";
import { ShortfyIconComponent } from "../icons/shortfy-icon/shortfy-icon.component";
import { GoogleIconComponent } from "../icons/google-icon/google-icon.component";
import { Router } from '@angular/router';


const messagesForLogin = {
  login:{
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

const enum LOGIN_TYPE {LOGIN = "login", SIGNUP= "signup"} 



@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
  imports: [IonInput, IonItem, IonIcon, IonButton, IonCard, IonCardContent, ShortfyIconComponent, GoogleIconComponent],
})
export class LogInComponent implements OnInit {

  typeOfLogin = LOGIN_TYPE.SIGNUP

  messages = messagesForLogin[this.typeOfLogin]

  @Input() isNewUser: any = {}

  constructor(private router: Router) { }

  ngOnInit() { }

  changeLoginType(){
    this.typeOfLogin === LOGIN_TYPE.SIGNUP ? this.typeOfLogin = LOGIN_TYPE.LOGIN : this.typeOfLogin = LOGIN_TYPE.SIGNUP
    this.messages = messagesForLogin[this.typeOfLogin]
  }

  redirectToHome(){
    this.router.navigate([''])
  }

}
