import { Component, OnInit } from '@angular/core';
import { IonCard, IonCardTitle, IonCardContent, IonIcon, IonCardSubtitle } from "@ionic/angular/standalone";
import { LinkComponentComponent } from "../link-component/link-component.component";

@Component({
  selector: 'app-link-visualizator',
  templateUrl: './link-visualizator.component.html',
  styleUrls: ['./link-visualizator.component.scss'],
  imports: [IonCardSubtitle, IonIcon, IonCardContent, IonCardTitle, IonCard, LinkComponentComponent],
})
export class LinkVisualizatorComponent  implements OnInit {
  
  constructor() { }
  
  ngOnInit() {}
  
  contentIsEmpty() {
    return false;
  }

}
