import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { AddeventComponent } from './addevent/addevent.component';
import { ArticleComponent } from './article/article.component';
import { BlogComponent } from './blog/blog.component';
import { CookieComponent } from './cookie/cookie.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PostComponent } from './post/post.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TosComponent } from './tos/tos.component';

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'cookie', component: CookieComponent },
  { path: 'addevent', component: AddeventComponent },
  { path: '**', component: PageNotFoundComponent },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class AppRoutingModule { }
export const RoutingComponents = [
  AboutComponent,
  AddeventComponent,
  ArticleComponent,
  BlogComponent,
  CookieComponent,
  FooterComponent,
  HeaderComponent,
  HomeComponent,
  PageNotFoundComponent,
  PostComponent,
  PrivacyComponent,
  TosComponent
]
