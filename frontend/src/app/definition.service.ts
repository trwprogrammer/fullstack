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
