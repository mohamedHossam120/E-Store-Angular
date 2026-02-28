import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations'; // 1. استيراد الأنميشن
import { provideToastr } from 'ngx-toastr'; // 2. استيراد التوستر

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withFetch()), 
    provideClientHydration(),
    
    provideAnimations(), 
    provideToastr({
      timeOut: 3000,           
      positionClass: 'toast-top-right', 
      preventDuplicates: true, 
      progressBar: true,       
      closeButton: true        
    })
  ]
};