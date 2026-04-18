import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { IonCard, IonCardContent, IonIcon, IonButton } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular/standalone';
import { CopyButtonComponent } from "../../buttons/copy-button/copy-button/copy-button.component";
import { UrlManager } from 'src/app/services/url-manager/url-manager';
import { QrCodeButtonComponent } from "../../buttons/qr-code-button/qr-code-button.component";
import { RelativeTimePipe } from 'src/app/pipes/relative-time-pipe-pipe';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { I18nService } from 'src/app/services/i18n/i18n.service';

@Component({
  selector: 'app-link-component',
  templateUrl: './link-component.component.html',
  styleUrls: ['./link-component.component.scss'],
  imports: [TranslatePipe, RelativeTimePipe, IonButton, IonIcon, IonCardContent, IonCard, FormsModule, CopyButtonComponent, QrCodeButtonComponent],
})
export class LinkComponentComponent {

  urlService = inject(UrlManager)
  alertController = inject(AlertController);
  i18nService = inject(I18nService);
  searchElement = signal('');

  links = computed(() => {
    return this.urlService.urls().sort((a, b) =>
      new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
    );
  })

  constructor() { }

  filteredLinks = computed(() => {
    const search = this.searchElement().toLowerCase().trim();
    if (!search) return this.links();

    return this.links().filter(link =>
      Object.values(link).some(value =>
        String(value).toLowerCase().includes(search)
      )
    );
  });

  linksCreatedMessage = computed(() => {
    const count = this.links().length;

    if (count === 0) {
      return this.i18nService.translate('home.linksCreatedZero');
    }

    if (count === 1) {
      return this.i18nService.translate('home.linksCreatedOne');
    }

    return this.i18nService.translate('home.linksCreatedOther', { count });
  });

  clicksLabel(clicks: number): string {
    if (clicks === 0) {
      return this.i18nService.translate('home.clicksZero');
    }

    if (clicks === 1) {
      return this.i18nService.translate('home.clicksOne');
    }

    return this.i18nService.translate('home.clicksOther', { count: clicks });
  }

  async deleteLink(id: number) {
    const alert = await this.alertController.create({
      header: this.i18nService.translate('home.deleteConfirmTitle'),
      message: this.i18nService.translate('home.deleteConfirmMessage'),
      buttons: [
        {
          text: this.i18nService.translate('home.cancel'),
          role: 'cancel',
        },
        {
          text: this.i18nService.translate('home.delete'),
          role: 'destructive',
          handler: () => {
            this.urlService.remove(id);
          },
        },
      ],
    });

    await alert.present();
  }


  async developerAdvertance() {
  const alert = await this.alertController.create({
    header: this.i18nService.translate('home.inDevelopmentTitle'),
    message: this.i18nService.translate('home.inDevelopmentMessage'),
    buttons: [
      {
        text: this.i18nService.translate('home.understood'),
        role: 'cancel',
      },
    ],
  });

  await alert.present();
}
}
