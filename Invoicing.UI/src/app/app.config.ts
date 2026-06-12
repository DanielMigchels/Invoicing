import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../interceptors/auth-interceptor';
import { provideIcons } from '@ng-icons/core';
import { heroArrowsRightLeft, heroBarsArrowDown, heroBookOpen, heroCheckCircle, heroChevronLeft, heroPencil, heroPlus, heroTrash, heroXCircle, heroXMark } from '@ng-icons/heroicons/outline';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideIcons({ heroChevronLeft, heroPlus, heroXMark, heroTrash, heroPencil, heroCheckCircle, heroXCircle, heroBarsArrowDown, heroBookOpen, heroArrowsRightLeft}),
  ]
};
