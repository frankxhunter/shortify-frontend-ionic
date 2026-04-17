import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonButton, IonIcon, IonModal } from "@ionic/angular/standalone";
import { QrCodeModalComponent } from '../../modals/qr-code-modal/qr-code-modal.component';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-qr-code-button',
  templateUrl: './qr-code-button.component.html',
  styleUrls: ['./qr-code-button.component.scss'],
  imports: [IonButton, IonIcon, IonModal, QrCodeModalComponent],
})
export class QrCodeButtonComponent {
  @Input() url = '';
  @ViewChild('modal') modal!: IonModal;

  async openQrModal() {
    await this.modal.present();
  }

  async onModalPresent(event: any) {
    if (!Capacitor.isNativePlatform()) return;

    setTimeout(async () => {
      const modalEl = event.target as HTMLElement;
      const content = modalEl.querySelector('.modal-body') as HTMLElement;
      if (content) {
        const contentHeight = content.scrollHeight + 56; // +56 por el header
        const breakpoint = Math.min(contentHeight / window.innerHeight, 1);
        await this.modal.setCurrentBreakpoint(breakpoint);
      }
    }, 300);
  }

  async closeModal() {
    await this.modal.dismiss();
  }

  get breakpoints() {
    return Capacitor.isNativePlatform() ? [0, 0.65] : undefined;
  }

  get initialBreakpoint() {
    return Capacitor.isNativePlatform() ? 0.65 : undefined;
  }
}