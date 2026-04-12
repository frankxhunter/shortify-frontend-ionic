import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IonButton, IonIcon, IonCard, IonCardContent, IonSpinner } from "@ionic/angular/standalone";
import { ShortfyIconComponent } from "../icons/shortfy-icon/shortfy-icon.component";
import { AlertController } from '@ionic/angular/standalone';
import { User } from 'src/app/Dtos/interfaces';
import { ApiService } from 'src/app/services/url-manager/url-strategy/api-service/api-service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth-service';

@Component({
  selector: 'app-verification-email',
  templateUrl: './verification-email.component.html',
  styleUrls: ['./verification-email.component.scss'],
  imports: [IonSpinner, IonCardContent, IonCard, IonIcon, IonButton, ShortfyIconComponent],
})
export class VerificationEmailComponent implements OnInit {

  apiService = inject(ApiService);
  authService = inject(AuthService);
  alertController = inject(AlertController);

  @Input() user!: User;
  @Output() changeToLoginPageEvent = new EventEmitter();

  continueButtonLoading = false
  resendButtonLoading = false

  errorMessage = ''

  constructor(private router: Router) { }
  ngOnInit() { }

  resendEmail() {
    this.cleanErrorMessage();
    this.resendButtonLoading = true;
    this.authService.register(this.user).subscribe({
      next: () => {
        this.resendButtonLoading = false;
        this.confirmResendEmail(this.user.email)
      },
      error: (error) => {
        this.resendButtonLoading = false;
        console.log('An error ocurred');
        console.log(error);
      }
    })
  }

  async confirmResendEmail(email: string) {
    const alert = await this.alertController.create({
      header: 'Email reenviado',
      message: `Se ha enviado un nuevo enlace de verificación a ${email}`,
      buttons: [
        {
          text: 'Aceptar',
          role: 'confirm',
        },
      ],
    });
    await alert.present();
  }

  goBackToLogin() {
    this.cleanErrorMessage();
    this.changeToLoginPageEvent.emit();
  }

  continueToHome() {
    this.cleanErrorMessage()
    this.continueButtonLoading = true;
    this.authService.login(this.user).subscribe({
      next: () => {
        this.continueButtonLoading = false;
        this.redirectToHome();
      },
      error: (error) => {
        console.log(error);
        this.continueButtonLoading = false;
        if (error.error == 'An error ocurred: El usuario está deshabilitado') {
          this.errorMessage = 'The email was not confirmed'
        } else {
          this.errorMessage = error.error
        }
      }
    })
  }

  private cleanErrorMessage() {
    this.errorMessage = ''
  }

  redirectToHome() {
    this.changeToLoginPageEvent.emit();
    this.router.navigate([''])
  }


}
