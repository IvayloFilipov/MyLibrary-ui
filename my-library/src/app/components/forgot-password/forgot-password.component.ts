import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: [
    '../reset-password/reset-password.component.scss',
    './forgot-password.component.scss',
  ],
})
export class ForgotPasswordComponent implements OnInit {
  form: any = {
    email: null,
  };

  successMessage: string =
    'The reset password link has been sent to your email.';
  errorMessage: string = 'Server error';

  showSuccess: boolean = false;
  showError: boolean = false;

  constructor(private authService: UserService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.authService.requestReset(this.form).subscribe(
      () => {
        this.showSuccess = true;

        setTimeout(() => {
          this.router.navigateByUrl('home')
        }, 4000);
      },
      (err: any) => {
        this.showError = true;
      }
    );
  }
}
