import { Component, OnInit } from '@angular/core';
import { countries } from 'src/app/models/country/country-data-store';
import { UserService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../login/login-and-register.scss'],
})
export class RegisterComponent implements OnInit {
  public countries: any = countries;

  form: any = {
    firstName: null,
    lastName: null,
    email: null,
    phoneCode: null,
    phoneNumberNoCode: null,
    password: null,
    confirmPassword: null,
    country: null,
    city: null,
    street: null,
    streetNumber: null,
    buildingNumber: null,
    apartmentNumber: null,
    additionalInfo: null,
  };
  public isSuccessful = false;
  public isSignUpFailed = false;
  public isEmailTaken = false;

  errorMessage = '';

  constructor(private userService: UserService) {}
  ngOnInit(): void {}
  onSubmit(): void {
    const {
      firstName,
      lastName,
      email,
      phoneCode,
      phoneNumberNoCode,
      password,
      confirmPassword,
      country,
      city,
      street,
      streetNumber,
      buildingNumber,
      apartmentNumber,
      additionalInfo,
    } = this.form;

    const phoneNumber = phoneCode + phoneNumberNoCode;

    this.userService
      .register(
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        confirmPassword,
        country,
        city,
        street,
        streetNumber,
        buildingNumber,
        apartmentNumber,
        additionalInfo
      )
      .subscribe({
        next: (data) => {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          this.isEmailTaken = false;
          document
            .querySelector('.form-wrapper')!
            .classList.add('form-success');
        },
        error: (err) => {
          try {
            err.error.errors.forEach((currentError: any) => {
              if (currentError.code === 'DuplicateUserName') {
                this.isEmailTaken = true;
              }
            });
          } catch (error) {
            alert('Server Error');
          }
          this.isSignUpFailed = true;
        },
      });
  }
}
