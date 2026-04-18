import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonAvatar, IonIcon, IonButton, IonList, IonItem, IonPopover } from "@ionic/angular/standalone";
import { AuthService } from 'src/app/services/auth-service/auth-service';
import { AlertController } from '@ionic/angular/standalone';
import { I18nService } from 'src/app/services/i18n/i18n.service';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';

@Component({
  selector: 'app-menu-profile-options',
  templateUrl: './menu-profile-options.component.html',
  styleUrls: ['./menu-profile-options.component.scss'],
  imports: [TranslatePipe, IonPopover, IonItem, IonList, IonButton, IonIcon, IonAvatar],
})
export class MenuProfileOptionsComponent {

  authService = inject(AuthService)
  alertController = inject(AlertController)
  i18nService = inject(I18nService)

  userAuth = this.authService.userAuth;

  isPopoverOpen = false;


  @ViewChild('popover', { static: true }) popover: any;

  constructor(private router: Router) { }

  redirectToLogin() {
    this.router.navigate(["/login"])
  }

  async openPopover(event: Event) {
    if (!this.popover) return
    this.popover.event = event;
    this.isPopoverOpen = true;
  }

  logout() {
    console.log('logout button pressed');
    setTimeout(()=>{
      this.authService.logout().subscribe({
      next: () => {
        console.log('Successfully logout');
      },
      error: (error)=> {
        console.log('Error logout');
        console.log(error);
      }
    })
    }, 150)
  }

  private closePopover() {
    this.isPopoverOpen = false;

  }


  async logoutAlert() {
  console.log('logout button pressed');
  this.isPopoverOpen = false;

  await new Promise(resolve => setTimeout(resolve, 300));

  const alert = await this.alertController.create({
    header: this.i18nService.translate('profile.logoutConfirmTitle'),
    message: this.i18nService.translate('profile.logoutConfirmMessage'),
    buttons: [
      {
        text: this.i18nService.translate('home.cancel'),
        role: 'cancel',
      },
      {
        text: this.i18nService.translate('profile.confirm'),
        role: 'destructive',
        handler: () => {
          this.logout();
        },
      },
    ],
  });

  await alert.present();
}

  extractUsername(email: string){
    return email.split('@')[0];
  }
}
