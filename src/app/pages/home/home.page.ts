import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar} from '@ionic/angular/standalone';
import { ShortfyIconComponent } from "../../components/icons/shortfy-icon/shortfy-icon.component";
import { MenuProfileOptionsComponent } from "src/app/components/menu-bar/menu-profile-options/menu-profile-options.component";
import { ShortCreatorComponent } from "src/app/components/links/short-creator/short-creator.component";
import { LinkVisualizatorComponent } from "src/app/components/links/link-visualizator/link-visualizator.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [ IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, ShortfyIconComponent, MenuProfileOptionsComponent, ShortCreatorComponent, LinkVisualizatorComponent]
})
export class HomePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
