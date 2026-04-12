import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule, provideStorage } from '@ionic/storage-angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth/auth-interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    ModalController,
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: '__mydb',
      })
    ),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
