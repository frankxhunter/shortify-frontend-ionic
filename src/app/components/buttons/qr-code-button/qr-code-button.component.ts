import { Component, Input, OnInit } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { Platform } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { QrCodeModalComponent } from '../../modals/qr-code-modal/qr-code-modal.component';

@Component({
  selector: 'app-qr-code-button',
  templateUrl: './qr-code-button.component.html',
  styleUrls: ['./qr-code-button.component.scss'],
  providers: [Platform],
  imports: [IonButton, IonIcon],
})
export class QrCodeButtonComponent implements OnInit {

  @Input() url = ''

  constructor(
    private modalCtrl: ModalController,
    private platform: Platform) { }

  ngOnInit() { }

  async openQrModal() {
    const isMobile = this.platform.width() < 768;

    console.log(this.platform.is('mobile'));

    const modal = await this.modalCtrl.create({
      component: QrCodeModalComponent,
      componentProps: {
        shortUrl: this.url
      },
      backdropDismiss: true,
      cssClass: 'qr-modal',

      ...(isMobile ? {
        breakpoints: [0, 0.65],
        initialBreakpoint: 0.65,
      } : {}),
    });

    await modal.present();

  }

}
