import { HttpClientModule } from '@angular/common/http';
import { APP_ID, Inject, NgModule, PLATFORM_ID, } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule,
        MatFormFieldModule, MatGridListModule,
        MatInputModule, MatOptionModule, MatSelectModule, MatToolbarModule,   } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { AppComponent } from './app.component';

import { EventService } from './service/event.service';
@NgModule({
  declarations: [
    AppComponent,
    RoutingComponents,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatFormFieldModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatOptionModule,
    MatGridListModule,
    MatSelectModule,
    MatButtonModule,
    InfiniteScrollModule,
  ],
  providers: [CookieService, EventService,  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
