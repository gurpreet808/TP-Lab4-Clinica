import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { ConfirmationService, MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp({
      "projectId": "tpfinal-lab4-singh",
      "appId": "1:292522545303:web:dcb73dad82c9529270d9d2",
      "storageBucket": "tpfinal-lab4-singh.appspot.com",
      "apiKey": "AIzaSyBQFBqcKAi0T_n31pMmSp23FlWYaDZw2go",
      "authDomain": "tpfinal-lab4-singh.firebaseapp.com",
      "messagingSenderId": "292522545303",
      "measurementId": "G-XPQBDSJLYK"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    MessageService,
    ConfirmationService
  ]
};
