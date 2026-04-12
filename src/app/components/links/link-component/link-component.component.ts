import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { IonCard, IonCardContent, IonIcon, IonButton } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { UrlStorageService } from 'src/app/services/url-manager/url-strategy/url-storage/url-storage-service';
import { AlertController } from '@ionic/angular/standalone';
import { CopyButtonComponent } from "../../buttons/copy-button/copy-button/copy-button.component";
import { RelativeTimeComponent } from "../../relative-time/relative-time/relative-time.component";
import { UrlManager } from 'src/app/services/url-manager/url-manager';

@Component({
  selector: 'app-link-component',
  templateUrl: './link-component.component.html',
  styleUrls: ['./link-component.component.scss'],
  imports: [IonButton, IonIcon, IonCardContent, IonCard, FormsModule, CopyButtonComponent, RelativeTimeComponent],
})
export class LinkComponentComponent {

  urlService = inject(UrlManager)
  alertController = inject(AlertController);
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

  async deleteLink(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres eliminar este enlace?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.urlService.remove(id);
          },
        },
      ],
    });

    await alert.present();
  }
}
