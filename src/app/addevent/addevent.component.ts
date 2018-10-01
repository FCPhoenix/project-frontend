import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, } from '@angular/forms';
import { MyErrorStateMatcher } from '../error';
import { EventService } from '../service/event.service';
import { Event } from './event';



@Component({
  selector: 'app-addevent',
  templateUrl: './addevent.component.html',
  styleUrls: ['./addevent.component.css'],
})
//  interface country = [
//   'Albania',
//   'France',
//   'Russia',
//   'USA',
// ];
export class AddeventComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
    matcher = new MyErrorStateMatcher();
    eventContent = new Event('', '', '', '', '', '', '', '', '', '');
  constructor(private _eventService: EventService ) { }

  ngOnInit() {
  }


  onSubmit() {
    this._eventService.addEvent(this.eventContent).subscribe(
     data => console.log('Succesfull', data),
     error => console.log('Error', error)
   );
  }
}
