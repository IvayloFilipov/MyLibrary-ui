import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', './login-and-register.scss'],
})
export class LoginComponent implements OnInit {
  ngOnInit(): void {}

  busy = false;
  loginError = false;
  loginErrorMsg = '';
  email = '';
  password = '';
  showPassword = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private http: HttpClient
  ) {}

  form: any = {
    email: null,
    password: null,
  };

  onSubmit(): void {
    const { email, password } = this.form;
    this.login(email, password);
  }

  login(inputEmail: string, inputPassword: string) {
    if (!inputEmail || !inputPassword) {
      return;
    }
    this.busy = true;
    this.userService
      .login(inputEmail, inputPassword)
      //.pipe(finalize(() => (this.busy = false)))
      .subscribe({
        next: (data) => {
          this.router.navigate(['home']);
        },
        error: (err) => {
          this.loginError = true;
          if (err.status == 400) {
            this.loginErrorMsg = 'Invalid email or password';
          } else {
            this.loginErrorMsg = 'Server error';
          }
        },
      });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
