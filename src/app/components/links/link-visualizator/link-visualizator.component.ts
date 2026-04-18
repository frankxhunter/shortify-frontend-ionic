import { Component, inject, OnInit } from '@angular/core';
import { IonCard, IonCardTitle, IonCardContent, IonIcon, IonCardSubtitle } from "@ionic/angular/standalone";
import { LinkComponentComponent } from "../link-component/link-component.component";
import { UrlStorageService } from 'src/app/services/url-manager/url-strategy/url-storage/url-storage-service';
import { UrlManager } from 'src/app/services/url-manager/url-manager';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';

@Component({
  selector: 'app-link-visualizator',
  templateUrl: './link-visualizator.component.html',
  styleUrls: ['./link-visualizator.component.scss'],
  imports: [TranslatePipe, IonCardSubtitle, IonIcon, IonCardContent, IonCardTitle, IonCard, LinkComponentComponent],
})
export class LinkVisualizatorComponent implements OnInit {

  urlService = inject(UrlManager)
  urls = this.urlService.urls

  constructor() { }

  ngOnInit() { }

  contentIsEmpty() {
    return this.urls().length === 0;
  }

}
