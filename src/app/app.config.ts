import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

// This is Angular's app-wide setup file - it registers services 
// that should be available EVERYWHERE in the app, not just one component.
// provideHttpClient() is what makes HttpClient (our tool for calling 
// the backend API) usable in any component we build from here on
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient()
  ]
};
