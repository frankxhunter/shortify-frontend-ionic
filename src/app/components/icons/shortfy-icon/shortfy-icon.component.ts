import { NgClass } from '@angular/common';
import { Component, input, Input, OnInit } from '@angular/core';
import { IonIcon, IonActionSheet } from "@ionic/angular/standalone";

@Component({
  selector: 'app-shortfy-icon',
  templateUrl: './shortfy-icon.component.html',
  styleUrls: ['./shortfy-icon.component.scss'],
  imports: [IonIcon, NgClass],
})
export class ShortfyIconComponent  implements OnInit {


  @Input() isInvertColor = false;

  constructor() { }

  ngOnInit() {}

}
