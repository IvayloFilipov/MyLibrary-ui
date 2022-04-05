import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  //HTTP interceptor add an authorization header, so that all requests sent to the back-end API endpoints will have the access token for identity purposes.
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add JWT auth header if a user is logged in for API requests
    const accessToken = this.userService.getJwtToken();
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    
    if (accessToken && isApiUrl) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    }

    return next.handle(request);
  }
}
