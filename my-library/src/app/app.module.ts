import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { NavigationbarComponent } from './components/navigationbar/navigationbar.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LibrarianGuard } from './services/librarian.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ValidateEqualModule } from 'ng-validate-equal';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoggedOutGuard } from './services/logged-out.guard';
import { LoggedInGuard } from './services/logged-in.guard';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { GenresComponent } from './components/genres/genres.component';
import { AddgenreComponent } from './components/genres/addgenre/addgenre.component';
import { GenredetailsComponent } from './components/genres/genredetails/genredetails.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { BooksComponent } from './components/books/books.component';
import { AddbookComponent } from './components/books/addbook/addbook.component';
import { MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { BookdetailsComponent } from './components/books/bookdetails/bookdetails.component';
import { AuthorsComponent } from './components/authors/authors.component';
import { AddAuthorComponent } from './components/authors/addauthor/addauthor.component';
import { AuthorDetailsComponent } from './components/authors/authordetails/authordetails.component';
import { SearchComponent } from './components/books/search/search.component';
import { ReaderBookDetailsComponent } from './components/books/readerbookdetails/readerbookdetails.component';
import { ModalComponent } from './components/modal/modal.component';
import { BookReservationRequestsComponent } from './components/bookreservationrequests/bookreservationrequests.component';
import { BookReservationDetailsComponent } from './components/bookreservationrequests/bookreservationdetails/bookreservationdetails.component';
import { JwtInterceptor } from './services/jwt.interceptor';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [LoggedOutGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedOutGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [LoggedOutGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [LoggedOutGuard],
  },
  {
    path: 'admin-menu',
    component: AdminMenuComponent,
    canActivate: [LibrarianGuard],
  },
  {
    path: 'genres',
    component: GenresComponent,
    canActivate: [LibrarianGuard],
  },
  {
    path: 'genres/add-genre',
    component: AddgenreComponent,
    canActivate: [LibrarianGuard],
  },
  {
    path: 'genres/details/:genreId',
    component: GenredetailsComponent,
    canActivate: [LibrarianGuard],
  },
  {
    path: 'authors',
    component: AuthorsComponent,
    canActivate: [LibrarianGuard],
  },
  {
    path: 'authors/add-author',
    component: AddAuthorComponent,
    canActivate: [LibrarianGuard],
  },
  {
    path: 'authors/details/:authorId',
    component: AuthorDetailsComponent,
    canActivate: [LibrarianGuard],
  },
  {
    path: 'books',
    component: BooksComponent,
    canActivate: [LibrarianGuard],
  },
  {
    path: 'bookreservationrequests',
    component: BookReservationRequestsComponent,
    canActivate: [LibrarianGuard],
  },
  {
    path: 'books/add-book',
    component: AddbookComponent,
    canActivate: [LibrarianGuard],
  },
  {
    path: 'books/update/:bookId',
    component: BookdetailsComponent,
    canActivate: [LibrarianGuard],
  },
  {
    path: 'books/:bookId',
    component: ReaderBookDetailsComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'search',
    component: SearchComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'bookreservationrequests/details/:bookReservationId',
    component: BookReservationDetailsComponent,
    canActivate: [LibrarianGuard],
  },

  { path: '**', redirectTo: '' },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavigationbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AdminMenuComponent,
    GenresComponent,
    AddgenreComponent,
    GenredetailsComponent,
    PaginationComponent,
    BooksComponent,
    AddbookComponent,
    BookdetailsComponent,
    AuthorsComponent,
    AddAuthorComponent,
    AuthorDetailsComponent,
    SearchComponent,
    ReaderBookDetailsComponent,
    ModalComponent,
    BookReservationRequestsComponent,
    BookReservationDetailsComponent,
  ],

  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ValidateEqualModule,
    FontAwesomeModule,
    MultiSelectAllModule,
  ],
  providers: [
    LibrarianGuard, 
    JwtInterceptor,
    { provide: HTTP_INTERCEPTORS, 
      useClass: JwtInterceptor, 
      multi: true },
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
