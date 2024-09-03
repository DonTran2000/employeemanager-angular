import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { Provider } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { adminRoutes } from './components/admin/admin-routes';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const tokenInterceptorProvider: Provider =
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true };

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        importProvidersFrom(RouterModule.forChild(adminRoutes)),
        importProvidersFrom(HttpClientModule),
        importProvidersFrom(BrowserAnimationsModule),  // import BrowserAnimationsModule đúng cách
        importProvidersFrom(ToastrModule.forRoot()),   // import ToastrModule đúng cách
        provideHttpClient(withFetch()),
        tokenInterceptorProvider,
        provideClientHydration(),
    ]
};
