import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

toTop(e) {
  window.scrollTo( {
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}
}
