import { Component, inject, OnInit } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonInput, IonButton, IonIcon, IonSpinner } from "@ionic/angular/standalone";
import { ShortfyIconComponent } from "../../icons/shortfy-icon/shortfy-icon.component";
import { FormsModule } from '@angular/forms';
import { UrlStorageService } from 'src/app/services/url-manager/url-strategy/url-storage/url-storage-service';
import { ApiService } from 'src/app/services/url-manager/url-strategy/api-service/api-service';
import { UrlManager } from 'src/app/services/url-manager/url-manager';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';

@Component({
  selector: 'app-short-creator',
  templateUrl: './short-creator.component.html',
  styleUrls: ['./short-creator.component.scss'],
  imports: [TranslatePipe, IonSpinner, IonIcon, IonButton, IonInput, IonItem, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, ShortfyIconComponent, FormsModule],
})
export class ShortCreatorComponent implements OnInit {

  url: string = '';
  linkName: string = '';
  urlError: boolean = false;
  loading: boolean = false

  urlService = inject(UrlManager)

  validateUrl() {
    const pattern = /^(https?:\/\/)/i;
    this.urlError = !pattern.test(this.url);
  }

  createUrl(){
    this.loading = true;

    this.urlService.add({url: this.url, name: this.linkName}).subscribe({
      next: (urlCreated)=>{
        console.log('Url create successfully');
        console.log(urlCreated);
        this.loading = false;
        this.url = '';
        this.linkName = ''
      },
      error: (error)=>{
        this.loading = false;
        console.log(error)
      }
    })
  }


  constructor() { }

  ngOnInit() { }

}
