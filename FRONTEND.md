# Fullstack Frontend - The Real World Programmer

### Frontend
Install [Node.js](https://nodejs.org/) (outside the scope of this project)
#### Create Angular Frontend
See [Angular](https://angular.io/) for more info

Install Angular CLI
```bash
npm install -g @angular/cli
```

Create new project (pick defaults when prompted)
```bash
ng new frontend
```

Go into directory to:
* Add additional dependencies
* Create service
* Create component

Generate liff service:
```bash
ng generate service liff
```

Generate liff component:
```bash
ng generate component liff
```

Add [Angular Material](https://material.angular.io/) library:
```bash
ng add @angular/material
```

Update main `styles.css` file to import angular material stylesheet. Also import the Google Font [Marck Script](https://fonts.google.com/specimen/Marck+Script)
```css
@import "@angular/material/prebuilt-themes/deeppurple-amber.css";
@import url('https://fonts.googleapis.com/css2?family=Marck+Script&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

html {
    height: 100%;
    background: #555;
}
```

Update `package.json` start script to `ng serve --host 0.0.0.0` and startup service using npm
```bash
npm start
```
The frontend now be accessible at http://localhost:4200

Add modules to `app.config.js` to enable `HttpClient` and relevant `Angular Material` components

```javascript
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
```

Create custom `Liff` domain object in file `liff.ts`
```typescript
export interface Liff {
  id: string;
  title: string;
  lexicalCategories: string;
  definition: string;
}
```

Inject Angular `HttpClient` service into `LiffService` to communicate to backend

```typescript
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Liff} from "./liff";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LiffService {

  constructor(private httpClient:HttpClient) {}

  getLiff():Observable<Liff> {
    return this.httpClient.get<Liff>(`/api/liff`);
  }
}
```

Inject `LiffService` service into `LiffComponent` to get liffs. Also add `Angular Material` modules to enable tags in `liff.component.ts` file

```typescript
import { Component } from '@angular/core';
import {LiffService} from "../liff.service";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {Liff} from "../liff";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-liff',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, NgIf],
  templateUrl: './liff.component.html',
  styleUrl: './liff.component.css'
})
export class LiffComponent {

  liff:Liff | null = null;

  constructor(private liffService:LiffService) {
    this.getLiff();
  }

  getLiff() {
    this.liffService.getLiff()
      .subscribe({
        next: (data) => {
          this.liff = data;
        },
        error: (error) => {
          console.error("Failed to get liff", error);
          this.liff = {
            id: 'error',
            title: 'Something went wrong :/',
            lexicalCategories: 'na',
            definition: error.message
          }
        }
      });
  }
}
```

Update `liff.component.html` to render liff as a `Angular Material Card`

```html
<mat-card *ngIf="liff" class="liff-card">
  <mat-card-header>
    <div mat-card-avatar class="liff-card-header-image"></div>
    <mat-card-title>{{liff.title}}</mat-card-title>
    <mat-card-subtitle><strong>{{liff.lexicalCategories}}</strong></mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>
    <p>{{liff.definition}}</p>
  </mat-card-content>
  <mat-card-actions>
    <button  mat-flat-button color="primary" (click)="getLiff()">Random</button>
    <a mat-button href="https://en.wikipedia.org/wiki/The_Meaning_of_Liff" target="_blank"><mat-icon fontIcon="open_in_new"></mat-icon>Wikipedia - The Meaning of Liff</a>
  </mat-card-actions>
</mat-card>
```

Update `liff.component.css` to render the card with custom format. The `/assets/img/book_image.png` needs to be added to the project manually later
```css
.liff-card {
  max-width: 400px;
  margin: auto;
  width: 50%;
}

.liff-card mat-card-subtitle {
  font-family: "Marck Script", cursive;
  font-size: large;
}

.liff-card p {
  font-family: "Marck Script", cursive;
  font-weight: 400;
  font-style: normal;
  font-size: xx-large;
  padding-bottom: 30px;
}

.liff-card mat-card-content {
  background-color: #e5e5e5;
}

.liff-card-header-image {
  background-image: url('/assets/img/book_image.png');
  background-size: cover;
}
```

index.htlm?????????????

Remove everything from `app.component.html`, except for `<router-outlet />`. The file should look like this:
```html
<router-outlet />
```

Next setup routes to connect `/liff` to the `LiffComponent` in the `app.routes.ts` file. Homework is to add an invalid URL component
```javascript
import { Routes } from '@angular/router';
import {LiffComponent} from "./liff/liff.component";

export const routes: Routes = [
    { path: '', redirectTo: 'liff', pathMatch: 'full'},
    { path: 'liff',  component: LiffComponent},
    // Component to show for invalid url
    { path: '**', component: LiffComponent}
];
```
