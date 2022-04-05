import { Component, OnInit, ElementRef } from '@angular/core';
import { UserService } from '../../services/auth.service';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navigationbar',
  templateUrl: './navigationbar.component.html',
  styleUrls: ['./navigationbar.component.scss'],
})
export class NavigationbarComponent implements OnInit {
  private element: any;

  constructor(private auth: UserService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  checkedValue: boolean = false;
  faMagnifyingGlass = faMagnifyingGlass;
  faAlignJustify = faAlignJustify;

  ngOnInit(): void {
    document.body.addEventListener('click', (el: any) => {
      if (el.target.className === 'button-text') {
        this.toggleMenu();
      }
    });
  }

  toggleMenu(): void {
    document
      .querySelectorAll('ul')
      .forEach((x) => x.classList.toggle('mobile-list'));
  }

  isLoggedOut() {
    return this.auth.isLoggedOut();
  }

  isLibrarian() {
    return this.auth.isLibrarian();
  }

  isAdmin() {
    return this.auth.isAdmin();
  }

  logOut() {
    this.auth.clearLocalStorage();
  }
}
