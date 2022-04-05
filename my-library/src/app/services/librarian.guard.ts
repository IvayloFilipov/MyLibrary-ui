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

//LibrarianGuard controls the access of desired routes.
export class LibrarianGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.userService.isLibrarian()) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
