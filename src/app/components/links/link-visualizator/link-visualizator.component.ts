import { Component, inject, OnInit } from '@angular/core';
import { IonCard, IonCardTitle, IonCardContent, IonIcon, IonCardSubtitle } from "@ionic/angular/standalone";
import { LinkComponentComponent } from "../link-component/link-component.component";
import { UrlStorageService } from 'src/app/services/url-storage/url-storage-service';

@Component({
  selector: 'app-link-visualizator',
  templateUrl: './link-visualizator.component.html',
  styleUrls: ['./link-visualizator.component.scss'],
  imports: [IonCardSubtitle, IonIcon, IonCardContent, IonCardTitle, IonCard, LinkComponentComponent],
})
export class LinkVisualizatorComponent  implements OnInit {
  
  urlStorageService = inject(UrlStorageService)

  constructor() { }
  
  ngOnInit() {}
  
  contentIsEmpty() {
    return this.urlStorageService.count() === 0;
  }

}
