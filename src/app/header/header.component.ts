import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  @ViewChild('searchBar') searchBar: any;
  searchBarStatus = 0;
  searchList = null;
  result = null;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }
  // hide login box
  hideLoginBox(e) {}

 socialLogin(type) {
   console.log(type);
 }

 showSearchBar() {
   this.searchBarStatus = 1;
 }

 hideSearchBar() {
   const el = this.searchBar.nativeElement.querySelector('.more');
   el.classList.remove('active');
   this.searchBarStatus = 0;
 }
 search(e) {
   const el = this.searchBar.nativeElement.querySelector('.form-control');
   console.log(el.value);
   if (el.value !== '') {
     var url =  'https://ste-server.herokuapp.com/search?keyword=' + el.value;
     this.result = null;
     this.searchList = [];

     this.httpClient.get(url)
       .subscribe((res) => {
         console.log(res);
         this.result = res;
         var ref = this;
         this.result.events.forEach(function (el) {
           ref.searchList.push({
             display: el.title,
             id: el.id
           });
         });

         var el = this.searchBar.nativeElement.querySelector('.more');
         el.classList.add('active');
       },
         error => {
           console.log(error);
         });
   }
 }

 onKey(e) {
   console.log(e.target.value);
 }

 openResult(e) {
   console.log(e.target.innerText);
   var type;

   var search = this.searchList.find((el) => {
     return el.display == e.target.innerText;
   });

   var r = this.result.events.find((el) => {
     return el.id == search.id;
   });

   console.log(r);
   var el = this.searchBar.nativeElement.querySelector('.more');
   el.classList.remove('active');

   var el = this.searchBar.nativeElement.querySelector('.form-control');
   console.log(el.value);

   el.value = e.target.innerText;
   // this.searchBarStatus = 0;

   // this.homeComponent.pageNumber = 0;
   // this.homeComponent.eventList = [r];
 }
}
