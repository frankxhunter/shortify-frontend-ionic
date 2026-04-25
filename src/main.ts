import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { Platform } from '@ionic/angular';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/interceptors/auth/auth-interceptor';
import { AuthService } from './app/services/auth-service/auth-service';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.init();
    }),
    provideIonicAngular(),
    Platform,
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
