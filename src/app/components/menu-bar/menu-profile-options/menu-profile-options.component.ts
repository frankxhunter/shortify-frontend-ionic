import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonAvatar, IonIcon, IonButton, IonList, IonItem, IonPopover } from "@ionic/angular/standalone";

@Component({
  selector: 'app-menu-profile-options',
  templateUrl: './menu-profile-options.component.html',
  styleUrls: ['./menu-profile-options.component.scss'],
  imports: [IonPopover, IonItem, IonList, IonButton, IonIcon, IonAvatar],
})
export class MenuProfileOptionsComponent {
  
  isLogin = false;


  @ViewChild('popoverContent', { static: true }) popoverContent: any;

  constructor(private router: Router) { }

  redirectToLogin(){
    this.router.navigate(["/login"])
  }



}
