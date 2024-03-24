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

Go into `frontend` directory to:
* Add additional dependencies
* Create service
* Create component

```bash
cd frontend
```

Generate definition service:
```bash
ng generate service definition
```

Generate definition component:
```bash
ng generate component definition
```

Add [Angular Material](https://material.angular.io/) library and select all default options:
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

Create custom `Definition` domain object in file `definition.ts`
```typescript
export interface Definition {
  id: string;
  title: string;
  lexicalCategories: string;
  definition: string;
}
```

Inject Angular `HttpClient` service into `DefinitionService` to communicate to backend

```typescript
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Definition} from "./definition";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DefinitionService {

    constructor(private httpClient:HttpClient) {}

    getDefinition():Observable<Definition> {
        return this.httpClient.get<Definition>(`/api/definition`);
    }
}
```

Inject `DefinitionService` service into `DefinitionComponent` to get dictionary definitions. Also add `Angular Material` modules to enable tags in `definition.component.ts` file

```typescript
import { Component } from '@angular/core';
import {DefinitionService} from "../definition.service";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {Definition} from "../definition";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-definition',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, NgIf],
  templateUrl: './definition.component.html',
  styleUrl: './definition.component.css'
})
export class DefinitionComponent {
    
  definition:Definition | null = null;

  constructor(private definitionService:DefinitionService) {
    this.getDefinition();
  }

  getDefinition() {
    this.definitionService.getDefinition()
      .subscribe({
        next: (data) => {
          this.definition = data;
        },
        error: (error) => {
          console.error("Failed to get definition", error);
          this.definition = {
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

Update `definition.component.html` to render definition as a `Angular Material Card`

```html
<mat-card *ngIf="definition" class="definition-card">
  <mat-card-header>
    <div mat-card-avatar class="definition-card-header-image"></div>
    <mat-card-title>{{definition.title}}</mat-card-title>
    <mat-card-subtitle><strong>{{definition.lexicalCategories}}</strong></mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>
    <p>{{definition.definition}}</p>
  </mat-card-content>
  <mat-card-actions>
    <button  mat-flat-button color="primary" (click)="getDefinition()">Random</button>
    <a mat-button href="https://en.wikipedia.org/wiki/The_Meaning_of_Liff" target="_blank"><mat-icon fontIcon="open_in_new"></mat-icon>Wikipedia - The Meaning of Liff</a>
  </mat-card-actions>
</mat-card>
```

Update `definition.component.css` to render the card with custom format. The `/assets/img/book_image.png` needs to be added to the project manually later
```css
.definition-card {
  max-width: 400px;
  margin: auto;
  width: 50%;
}

.definition-card mat-card-subtitle {
  font-family: "Marck Script", cursive;
  font-size: large;
}

.definition-card p {
  font-family: "Marck Script", cursive;
  font-weight: 400;
  font-style: normal;
  font-size: xx-large;
  padding-bottom: 30px;
}

.definition-card mat-card-content {
  background-color: #e5e5e5;
}

.definition-card-header-image {
  background-image: url('/assets/img/book_image.png');
  background-size: cover;
}
```

Remove everything from `app.component.html`, except for `<router-outlet />`. The file should look like this:
```html
<router-outlet />
```

Next setup routes to connect `/definition` to the `DefinitionComponent` in the `app.routes.ts` file. Homework is to add an invalid URL component
```javascript
import { Routes } from '@angular/router';
import { DefinitionComponent } from "./definition/definition.component";

export const routes: Routes = [
    { path: '', redirectTo: 'definition', pathMatch: 'full'},
    { path: 'definition',  component: DefinitionComponent},
    // Component to show for invalid url
    { path: '**', component: DefinitionComponent}
];
```

Update the main `index.html` file:
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Fullstack Tutorial - The Real World Programmer</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```
