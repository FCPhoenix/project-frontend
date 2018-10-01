import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModuleMapNgFactoryLoader } from '@nguniversal/module-map-ngfactory-loader';
import { } from 'googlemaps';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs/operators';
import { Address, Description, Price, SelectedEvent, } from '../model/SelectedEvent';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


    pageNumber = 1;
    eventList = null;
    loading = true; // for first or whole loading
    loadingMore = false; // for auto loading loder
    showCookieBar = false;
    popUP = true;
    popUpModel: any;
    inHoverMode = false;
    popUPFilterMobile: boolean;
    // whole page ref for map render in every event background
    @ViewChild('eventpage') eventpage: any;
    @ViewChild('filters') filters: any;

    // for event detail pop up MAP
    @ViewChild('eventmap') gmapElement: any;
       map: google.maps.Map;

    /*
    * all filter variables for server
    */
    type;
    format;
    distance = 25;
    distance1;
    day;
    day1;
    subject = [];

    // note that without fetching current location and passing it to request distance filter will now work

    location = {
      lat: null,
      long: null
    }

    placesApi = {
      "url": "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      "key": "AIzaSyAeafIm7S7bfWiSs-u3gTr92vX7oG31k4A",
      "distance": 10 * 1000
    }
    /*
    * End of - all filter variables
    */

    api = 'https://ste-server.herokuapp.com/';

    public selectedEvent: SelectedEvent;

  constructor(private httpClient: HttpClient,
              private cookieService: CookieService,
              ) {
    this.selectedEvent = new SelectedEvent();
    this.selectedEvent.price = new Price();
    this.selectedEvent.address =  new Address();
    this.selectedEvent.description = new Description();
   }

  ngOnInit() {
    this.popUP = false;
    this.popUPFilterMobile = false;
    this.findMe();
    this.getevents();
    this.popUpModel = document.getElementById('eventDetailsPopWindow');

    // check gdpr status
    var status = this.cookieService.get('gdpr_status');
    console.log(status);
    if (status && status == 'hide') {
      this.showCookieBar = false;
    } else { this.showCookieBar = true;
            }
  }

  /*
  * Get users current location
  */
  findMe() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.location.lat = position.coords.latitude;
      this.location.long = position.coords.longitude;
    });
  }

  /*
  * get all events
  */
  getevents() {

    var q = {
      page: this.pageNumber,
      type: this.type == 'Any type' ? 'any' : this.type,
      format: this.format == 'Any format' ? 'any' : this.format,
      distance: this.distance1,
      day: this.day1,
      subject: this.subject,
      location: this.location
    };

    var url = this.api + 'event?query=' + JSON.stringify(q);

    this.httpClient.get(url)
      .subscribe((res) => {
        if (this.eventList == null) {
          this.eventList = res;
        } else {
          this.eventList = this.eventList.concat(res)
        }

        this.loadingMore = false;
        this.loading = false;
      },
        error => {
          this.loadingMore = false;
          this.loading = false;
        });
  }

  /*
  * methods to open/hide event detail popup
  */
  closePopUp() {
    this.popUP = false;
  }

  openPopUp(id) {
    this.popUP = true;
    var event = this.eventList.find(i => i.id === id);
    this.selectedEvent = event;
    this.selectedEvent.cstart = moment(event.start).format('YYYYMMDDThhmmss');
    this.selectedEvent.cend = moment(event.end).format('YYYYMMDDThhmmss');

    console.log(event);

    if (event.location && event.location.coordinates.length > 0) {
      var mapProp = {
        center: new google.maps.LatLng(event.location.coordinates[1], event.location.coordinates[0]),
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: true,
      };
      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
      let markerSimple = new google.maps.Marker({
        position: { lat: event.location.coordinates[1], lng: event.location.coordinates[0] },
        map: this.map,
      });

      if (event.mrt) {
        this.selectedEvent.nearestStation = event.mrt.name;
      } else {
        // this service will be used to fetch nearest metro station
        var result = null;
        this.httpClient.get(this.api + 'location?lat=' + event.location.coordinates[1] + '&long=' + event.location.coordinates[0])
          .subscribe((data) => {
            result = data;
            this.selectedEvent.nearestStation = result.name;
          },
            error => {
            });
      }
    }
  }

  /*
  * method to initiate auto loading of events
  */
  onScrollDown() {
    this.pageNumber++;
    this.loadingMore = true;
    this.getevents();
  }

  /*
  * method to hide cookie info bar
  */
  hidegdpr() {
    this.showCookieBar = false;
    this.cookieService.set('gdpr_status', 'hide');
  }

  /*
  * method to change filter
  */
  changeFilter(e) {

    // first show the loader
    this.loading = true;

    var type = $(e.target).data('type');
    var value = $(e.target).data('value');

    if (type == "type" || type == "format") {
      var val = e.target.innerText;
      this[type] = val;
      var el = this.filters.nativeElement.querySelector('.more.active');
      el.classList.remove('active');
    }

    if (type == 'distance') {
      var el = this.filters.nativeElement.querySelector('.more.active');
      el.classList.remove('active');
      this.distance1 = this.distance;
    }

    if (type == 'subject') {
      if (e.target.value == '*')
        this.subject = [];
      else {
        var _s = this.subject.findIndex((el) => {
          return el == e.target.value;
        });
        if (_s != -1)
          this.subject.splice(_s, 1);
        else
          this.subject.push(e.target.value);
      }
    }

    var ref = this;
    if (type == 'day') {
      switch (value) {
        case 'today':
          this.day = "Today";
          ref.day1 = {
            start: parseInt(moment().format('YYYYMMDD')),
            end: parseInt(moment().format('YYYYMMDD'))
          };
          break;
        case 'thisweek':
          this.day = "This Week";
          ref.day1 = {
            start: parseInt(moment().startOf('isoWeek').format('YYYYMMDD')),
            end: parseInt(moment().format('YYYYMMDD'))
          };
          break;
        case 'thismonth':
          this.day = "This Month";
          ref.day1 = {
            start: parseInt(moment().format('YYYYMM01')),
            end: parseInt(moment().format('YYYYMM31'))
          };
          break;
        case 'any':
          this.day = "All Time";
          ref.day1 = {
            start: null,
            end: null
          };
          break;
      }
      var el = this.filters.nativeElement.querySelector('.more.active');
      el.classList.remove('active');
    }

    this.pageNumber = 1;
    this.eventList = null;
    this.getevents();
  }

  /*
  * method to remove all selected filters
  */
  removeFilter(type, data) {
    console.log(this.distance);
    this[type] = undefined;
    if (type == 'day') {
      this.day1 = undefined;
    }

    if (type == 'distance') {
      this.distance1 = undefined;
      this.distance = 25;
    }

    this.loading = true;
    this.pageNumber = 1;
    this.eventList = null;
    this.getevents();
  }


  removeAllFilter() {
    this.type = "Any type";
    this.format = "Any format";
    this.day = "Today";
    this.distance = 25;

    this.day1 = {
      start: parseInt(moment().format('YYYYMMDD')),
      end: parseInt(moment().format('YYYYMMDD'))
    };

    this.subject = [];

    this.loading = true;
    this.pageNumber = 1;
    this.eventList = null;
    this.getevents();
  }


  opneFilterPopUp() {
    this.popUPFilterMobile = true;
  }

  closeFilterPopUp() {
    this.popUPFilterMobile = false;
  }

  /*
  * mouse hover event
  */
  eventHover(e, id) {
    var event = this.eventList.find(i => i.id === id);

    if (!this.inHoverMode && event.format == 'offline') {
      this.inHoverMode = true;
      console.log(id);
      var mapProp = {
        center: new google.maps.LatLng(event.location.coordinates[1], event.location.coordinates[0]),
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: true,
      };
      var el = this.eventpage.nativeElement.querySelector('#map' + id);
      this.map = new google.maps.Map(el, mapProp);
      let markerSimple = new google.maps.Marker({
        position: { lat: event.location.coordinates[1], lng: event.location.coordinates[0] },
        map: this.map,
      });
      el.classList.add('active');
    }
  }

  eventHoverStop(e, id) {
    this.inHoverMode = false;
    var el = this.eventpage.nativeElement.querySelector('#map' + id);
    el.classList.remove('active');
  }

  appleCalender(e) {
    var cc = `
    BEGIN:VCALENDAR
    VERSION:2.0
    BEGIN:VEVENT
    URL:https:/ste-web.herokuapp.com/
    DTSTART:{{cstart}}
    DTEND:{{cend}}
    SUMMARY:{{title}}
    DESCRIPTION:{{desc}}
    LOCATION:{{city}}, {{country}}
    END:VEVENT
    END:VCALENDAR
    `;

    let cc1 = cc.replace('{{cstart}}', this.selectedEvent.cstart)
      .replace('{{cend}}', this.selectedEvent.cend)
      .replace('{{title}}', this.selectedEvent.title)
      .replace('{{desc}}', this.selectedEvent.description.text)
      .replace('{{city}}', this.selectedEvent.address.city)
      .replace('{{country}}', this.selectedEvent.address.country);

    let filename = "download.ics";
    let blob = new Blob([cc1], { type: "text/calendar;charset=utf-8" });
    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
