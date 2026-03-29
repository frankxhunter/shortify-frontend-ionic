import { NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-google-icon',
  templateUrl: './google-icon.component.html',
  styleUrls: ['./google-icon.component.scss'],
  imports: [NgStyle]
})
export class GoogleIconComponent  implements OnInit {


  @Input() size = 16;

  constructor() { }

  ngOnInit() {}

  get style(){
    return{
      width: this.size + "px",
      height: this.size + "px"
    }
  }

}
