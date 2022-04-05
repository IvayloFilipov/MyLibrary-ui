import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoggedInGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.userService.isLoggedOut()) {
      return true;
    } else {
      this.router.navigate(['home']);
      return false;
    }
  }
}
