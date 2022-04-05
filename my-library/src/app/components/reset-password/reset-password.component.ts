import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  form: any = {
    password: null,
    confirmPassword: null,
    email: null,
    token: null,
  };

  errorMessage: string = '';
  successMessage: string = 'Your password has been changed.';
  showSuccess: boolean = false;
  showError: boolean = false;
  paramsObject: any;

  constructor(
    private authService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.paramsObject = { ...params.keys, ...params };
    });

    let urlEmail = this.paramsObject.params.email;
    let urlToken = this.paramsObject.params.token;

    if (
      urlEmail == null ||
      urlEmail.length == 0 ||
      urlToken == null ||
      urlToken.length == 0
    ) {
      this.router.navigateByUrl('home');
    } else {
      this.form.email = urlEmail.replace(' ', '+');
      this.form.token = urlToken;
    }
  }

  onSubmit(): void {
    this.authService.newPassword(this.form).subscribe(
      () => {
        this.showSuccess = true;

        setTimeout(() => {
          this.router.navigateByUrl('login');
        }, 4000);
      },
      (err: any) => {
        this.showError = true;
        if (err.status == 400) {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Server error';
        }
      }
    );
  }
}
