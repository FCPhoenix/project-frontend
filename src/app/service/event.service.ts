import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Event } from '../addevent/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
public _url = '';
  constructor(private _http: HttpClient ) { }

  addEvent(evnt: Event) {
    return this._http.post<any>(this._url, evnt)
  }
}
