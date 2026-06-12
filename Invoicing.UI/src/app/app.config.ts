import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../interceptors/auth-interceptor';
import { provideIcons } from '@ng-icons/core';
import { heroArrowLeftOnRectangle, heroArrowPath, heroArrowsRightLeft, heroBars3, heroBarsArrowDown, heroBookOpen, heroBuildingOffice2, heroCheckCircle, heroChevronLeft, heroCircleStack, heroDocumentText, heroFolderOpen, heroPencil, heroPlus, heroReceiptPercent, heroRectangleGroup, heroTrash, heroUserGroup, heroXCircle, heroXMark } from '@ng-icons/heroicons/outline';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideIcons({ heroChevronLeft, heroPlus, heroXMark, heroTrash, heroPencil, heroCheckCircle, heroXCircle, heroBarsArrowDown, heroBookOpen, heroArrowsRightLeft, heroRectangleGroup, heroFolderOpen, heroArrowPath, heroCircleStack, heroBars3, heroDocumentText, heroUserGroup, heroBuildingOffice2, heroReceiptPercent, heroArrowLeftOnRectangle }),
  ]
};
