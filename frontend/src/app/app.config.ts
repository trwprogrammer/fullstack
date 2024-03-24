import { HttpClientModule } from '@angular/common/http';
import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from "@angular/material/button";

import {MatIconModule} from '@angular/material/icon'
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {

  providers: [
    importProvidersFrom(HttpClientModule, MatCardModule, MatIconModule, MatButtonModule),
    provideRouter(routes)
  ]
};
