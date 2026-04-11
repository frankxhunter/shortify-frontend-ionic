import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { IonCard, IonCardContent, IonIcon, IonButton } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { UrlStorageService } from 'src/app/services/url-storage/url-storage-service';
import { AlertController } from '@ionic/angular/standalone';
import { CopyButtonComponent } from "../../buttons/copy-button/copy-button/copy-button.component";
import { RelativeTimeComponent } from "../../relative-time/relative-time/relative-time.component";

@Component({
  selector: 'app-link-component',
  templateUrl: './link-component.component.html',
  styleUrls: ['./link-component.component.scss'],
  imports: [IonButton, IonIcon, IonCardContent, IonCard, FormsModule, CopyButtonComponent, RelativeTimeComponent],
})
export class LinkComponentComponent {

  urlStorageService = inject(UrlStorageService)
  alertController = inject(AlertController);

  searchElement = signal('');

  links = this.urlStorageService.urls;

  constructor() {}
  
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
            this.urlStorageService.removeUrl(id);
          },
        },
      ],
    });

    await alert.present();
  }
}
