import { Routes } from '@angular/router';
import { DefinitionComponent } from "./definition/definition.component";

export const routes: Routes = [
  { path: '', redirectTo: 'definition', pathMatch: 'full'},
  { path: 'definition',  component: DefinitionComponent},
  // Component to show for invalid url
  { path: '**', component: DefinitionComponent}
];
