import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonButton, IonSpinner } from '@ionic/angular/standalone';
import { GoogleIconComponent } from '../../icons/google-icon/google-icon.component';
import { environment } from 'src/environments/environment';
import { Capacitor } from '@capacitor/core';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';

declare const google: any;

@Component({
  selector: 'app-google-login-button',
  templateUrl: './google-login-button.component.html',
  styleUrls: ['./google-login-button.component.scss'],
  standalone: true,
  imports: [TranslatePipe, IonSpinner, IonButton, GoogleIconComponent]
})
export class GoogleLoginButtonComponent {
  @Output() loginSuccess = new EventEmitter<string>();
  @Input() loading = false;

  clientId = environment.googleClientId;
  clientIdAndroid = environment.googleClientId;

  async ngOnInit() {
    if (Capacitor.isNativePlatform()) {
      await SocialLogin.initialize({
        google: {
          webClientId: this.clientIdAndroid,
        }
      });
    }
  }

  async login() {
    if (Capacitor.isNativePlatform()) {
      await this.loginNative();
    } else {
      this.loginWeb();
    }
  }

  private async loginNative() {
    try {
      const result = await SocialLogin.login({
        provider: 'google',
        options: {
        }
      });
      const googleResult = result.result;

      if (googleResult.responseType !== 'online') {
        throw new Error('Se esperaba modo online');
      }

      const token = googleResult.idToken;

      this.loginSuccess.emit(token ?? undefined);
    } catch (error) {
      console.error('Error en login nativo con Google:', error);
    }
  }

  private loginWeb() {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) => {
        this.loginSuccess.emit(response.credential);
      }
    });
    google.accounts.id.prompt();
  }
}