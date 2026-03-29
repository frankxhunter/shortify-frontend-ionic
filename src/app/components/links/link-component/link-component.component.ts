import { Component, OnInit } from '@angular/core';
import { IonCard, IonCardContent, IonIcon, IonButton} from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-link-component',
  templateUrl: './link-component.component.html',
  styleUrls: ['./link-component.component.scss'],
  imports: [IonButton, IonIcon, IonCardContent, IonCard, FormsModule],
})
export class LinkComponentComponent  implements OnInit {


  links: any = [
    {
      shortLink: "https://short.link/m36U8V",
      originalLink: "https://www.figma.com/make/zlR6Xgyr74NuUYmDk7EfEh/Link-Shortening-App-UI?p=f&t=JwSAaSmX0r50Km60-0",
      name: "Figma",
      dateCreation: 20260314,
      clickCounter: 10
    },
    {
      shortLink: "https://short.link/m36U8V",
      originalLink: "https://www.figma.com/make/zlR6Xgyr74NuUYmDk7EfEh/Link-Shortening-App-UI?p=f&t=JwSAaSmX0r50Km60-0",
      name: "Franksf asdf sjadlkfj asd",
      dateCreation: 20260314,
      clickCounter: 10
    },
    {
      shortLink: "https://short.link/m36U8V",
      originalLink: "https://www.figma.com/make/zlR6Xgyr74NuUYmDk7EfEh/Link-Shortening-App-UI?p=f&t=JwSAaSmX0r50Km60-0",
      name: null,
      dateCreation: 20260314,
      clickCounter: 10
    },
    {
      shortLink: "https://short.link/m36U8V",
      originalLink: "https://www.figma.com/make/zlR6Xgyr74NuUYmDk7EfEh/Link-Shortening-App-UI?p=f&t=JwSAaSmX0r50Km60-0",
      name: "Figma",
      dateCreation: 20260314,
      clickCounter: 10
    },
    {
      shortLink: "https://short.link/m36U8V",
      originalLink: "https://www.figma.com/make/zlR6Xgyr74NuUYmDk7EfEh/Link-Shortening-App-UI?p=f&t=JwSAaSmX0r50Km60-0",
      name: "Figma",
      dateCreation: 20260314,
      clickCounter: 10
    },
  ]

  searchElement: string = ""
  url: string = '';


  constructor() { }

  ngOnInit() {}

}
