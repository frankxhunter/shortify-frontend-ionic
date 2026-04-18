import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import * as QRCode from 'qrcode';
import { IonContent, IonButton, IonIcon, IonSpinner, IonButtons, IonHeader, IonToolbar, IonTitle } from "@ionic/angular/standalone";
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { I18nService } from 'src/app/services/i18n/i18n.service';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';

@Component({
  selector: 'app-qr-code-modal',
  templateUrl: './qr-code-modal.component.html',
  styleUrls: ['./qr-code-modal.component.scss'],
  standalone: true,
  imports: [TranslatePipe, IonButton, IonIcon, IonSpinner],
})
export class QrCodeModalComponent implements OnInit {
  @Input() shortUrl: string = '';
  @Output() dismissed = new EventEmitter<void>();

  qrDataUrl: string = '';
  isLoading: boolean = true;

  constructor(private readonly i18nService: I18nService) {}

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
    if (!Capacitor.isNativePlatform()) {
      const link = document.createElement('a');
      link.href = this.qrDataUrl;
      link.download = 'qr-code.png';
      link.click();
      return;
    }

    try {
      const base64Data = this.qrDataUrl.split(',')[1];

      const fileName = `qr-code-${Date.now()}.png`;
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      await Share.share({
        title: this.i18nService.translate('home.qrShareTitle'),
        text: this.i18nService.translate('home.qrShareText'),
        url: savedFile.uri,
        dialogTitle: this.i18nService.translate('home.qrShareDialog'),
      });
    } catch (err) {
      console.error('Error al guardar/compartir QR:', err);
    }
  }

  dismiss() {
    this.dismissed.emit();
  }
}
