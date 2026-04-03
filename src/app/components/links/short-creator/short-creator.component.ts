import { Component, inject, OnInit } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonInput, IonButton, IonIcon, IonSpinner } from "@ionic/angular/standalone";
import { ShortfyIconComponent } from "../../icons/shortfy-icon/shortfy-icon.component";
import { FormsModule } from '@angular/forms';
import { UrlStorageService } from 'src/app/services/url-storage/url-storage-service';
import { ApiService } from 'src/app/services/api-service/api-service';

@Component({
  selector: 'app-short-creator',
  templateUrl: './short-creator.component.html',
  styleUrls: ['./short-creator.component.scss'],
  imports: [IonSpinner, IonIcon, IonButton, IonInput, IonItem, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, ShortfyIconComponent, FormsModule],
})
export class ShortCreatorComponent implements OnInit {

  url: string = '';
  linkName: string = '';
  urlError: boolean = false;
  loading: boolean = false

  urlStorageService = inject(UrlStorageService)
  apiService = inject(ApiService)

  validateUrl() {
    const pattern = /^(https?:\/\/)/i;
    this.urlError = !pattern.test(this.url);
  }

  createUrl(){
    this.loading = true;
    this.apiService.createUrl({url: this.url, name: this.linkName}).subscribe({
      next: (urlCreated)=>{
        console.log('Url create successfully');
        console.log(urlCreated);
        this.loading = false;
        this.urlStorageService.addUrl(urlCreated);
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
