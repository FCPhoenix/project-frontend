import { Injectable } from '@angular/core';
import { Configuration } from '../model/configuration';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
   config = ConfigService;

  constructor() { }

    getConfig() {
      return this.config;
    }
}
