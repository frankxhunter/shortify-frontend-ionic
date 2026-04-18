import { Component, Input, OnInit } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';
import { IonCard, IonCardContent, IonIcon, IonButton } from "@ionic/angular/standalone";
import { TranslatePipe } from 'src/app/pipes/translate.pipe';

@Component({
  selector: 'app-copy-button',
  templateUrl: './copy-button.component.html',
  imports: [TranslatePipe, IonButton, IonIcon],
  styleUrls: ['./copy-button.component.scss'],
})
export class CopyButtonComponent {
  @Input() text: string = '';

  isCopied = false;
  private timeout: any;

  constructor() {
  }

  async copy() {
    if (!this.text) return;

    try {
      await Clipboard.write({ string: this.text });
      this.isCopied = true;
      console.log('Copied')

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.isCopied = false;
      }, 800);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  }
}