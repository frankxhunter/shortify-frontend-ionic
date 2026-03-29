import { Component, OnInit } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonInput, IonButton, IonIcon } from "@ionic/angular/standalone";
import { ShortfyIconComponent } from "../../icons/shortfy-icon/shortfy-icon.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-short-creator',
  templateUrl: './short-creator.component.html',
  styleUrls: ['./short-creator.component.scss'],
  imports: [IonIcon, IonButton, IonInput, IonItem, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, ShortfyIconComponent, FormsModule],
})
export class ShortCreatorComponent implements OnInit {

  url: string = '';
  linkName: string = '';
  urlError: boolean = false;

  validateUrl() {
    const pattern = /^(https?:\/\/)/i;
    this.urlError = !pattern.test(this.url);
  }


  constructor() { }

  ngOnInit() { }

}
