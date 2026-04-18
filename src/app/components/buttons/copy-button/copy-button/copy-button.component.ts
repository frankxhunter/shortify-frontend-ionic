import { Component, inject, Input, OnInit } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';
import { Capacitor } from '@capacitor/core';
import { IonIcon, IonButton, IonToast, ToastController } from "@ionic/angular/standalone";
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { I18nService } from 'src/app/services/i18n/i18n.service';

@Component({
  selector: 'app-copy-button',
  templateUrl: './copy-button.component.html',
  imports: [TranslatePipe, IonButton, IonIcon, IonToast],
  styleUrls: ['./copy-button.component.scss'],
})
export class CopyButtonComponent {
  @Input() text: string = '';

  toastController = inject(ToastController)
  i18nService = inject(I18nService);
  toast: HTMLIonToastElement | null = null

  isCopied = false;
  private timeout: any;

  constructor() {
  }

  async copy() {
    if (!this.text) return;

    try {
      await Clipboard.write({ string: this.text });
      if (Capacitor.getPlatform() === 'web') {
        this.copyToast()
      }
      this.isCopied = true;
      console.log('Copied')

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.isCopied = false;
      }, 1700);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  }

  async copyToast() {
    if (this.toast) {
      await this.toast.dismiss();
      this.toast = null;
    }

    this.toast = await this.toastController.create({
      message: this.i18nService.translate('home.copied'),
      duration: 1200,
      position: 'bottom',
      icon: 'checkmark-circle-outline',
      cssClass: 'custom-toast',
      swipeGesture: "vertical",
      positionAnchor: "middle"
    });

    await this.toast.present();
  }
}