import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [IonContent, IonTitle, IonToolbar, IonHeader, CommonModule],
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage {
}