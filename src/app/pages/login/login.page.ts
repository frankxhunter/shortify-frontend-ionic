import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogInComponent } from "src/app/components/log-in/log-in.component";
import { VerificationEmailComponent } from "src/app/components/verification-email/verification-email.component";
import { User } from 'src/app/Dtos/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, LogInComponent, VerificationEmailComponent]
})
export class LoginPage implements OnInit {

  constructor() { }

  isVerificationEmail = false;

  user: User = {} as User;

  ngOnInit() { }

  changeToVerificationEmailPage(user: User) {
    this.isVerificationEmail = true;
    this.user = user
  }

  changeToLoginPage() {
    this.isVerificationEmail = false;
  }

  changeToLogi() {
    this.isVerificationEmail = false;
  }

}
