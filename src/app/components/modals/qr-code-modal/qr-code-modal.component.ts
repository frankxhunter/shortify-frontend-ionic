import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as QRCode from 'qrcode';
import { IonContent, IonButton, IonIcon, IonSpinner, IonButtons, IonHeader, IonToolbar, IonTitle} from "@ionic/angular/standalone";

@Component({
  selector: 'app-qr-code-modal',
  templateUrl: './qr-code-modal.component.html',
  styleUrls: ['./qr-code-modal.component.scss'],
  imports: [IonContent, IonButton, IonIcon, IonSpinner, IonButtons, IonHeader, IonToolbar, IonTitle],
})
export class QrCodeModalComponent implements OnInit {
  @Input() shortUrl: string = '';
  qrDataUrl: string = '';
  isLoading: boolean = true;

  constructor(private modalCtrl: ModalController) {}

  async ngOnInit() {
    await this.generateQR();
  }

  async generateQR() {
    try {
      this.qrDataUrl = await QRCode.toDataURL(this.shortUrl, {
        width: 220,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      });
    } catch (err) {
      console.error('Error generando QR:', err);
    } finally {
      this.isLoading = false;
    }
  }

  async downloadQR() {
    const link = document.createElement('a');
    link.href = this.qrDataUrl;
    link.download = 'qr-code.png';
    link.click();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}