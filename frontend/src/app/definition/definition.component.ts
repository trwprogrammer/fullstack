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
