import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { FormTemplateComponent } from '../form-template/form-template.component';
import { NgbAlertModule, NgbCalendar, NgbDate, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService, User } from '../../core/services/auth/auth.service';

enum SignUpFormKeyName {
  firstName = "firstName",
  lastName = "lastName",
  email = "email",
  birthDate = "birthDate",
  password = "password",
  showPassword = "showPassword",
}

interface SignUpForm {
  [SignUpFormKeyName.firstName]: FormControl<string>,
  [SignUpFormKeyName.lastName]: FormControl<string>,
  [SignUpFormKeyName.email]: FormControl<string>,
  [SignUpFormKeyName.birthDate]: FormControl<NgbDate>
  [SignUpFormKeyName.password]: FormControl<string>
  [SignUpFormKeyName.showPassword]: FormControl<boolean>
}

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    FormTemplateComponent,
    NgbDatepickerModule,
    NgbAlertModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
    protected signUpForm: FormGroup<SignUpForm>;
  protected SignUpFormKeyName: typeof SignUpFormKeyName = SignUpFormKeyName;

  protected displayFirstNameError: WritableSignal<boolean> = signal(false);
  protected displayLastNameError: WritableSignal<boolean> = signal(false);
  protected displayEmailError: WritableSignal<boolean> = signal(false);
  protected displayPasswordError: WritableSignal<boolean> = signal(false);

  private ngbCalendar: NgbCalendar = inject(NgbCalendar)
  protected today: NgbDate = this.ngbCalendar.getToday();
  protected showSuccessMessage = false;

  private authService: AuthService = inject(AuthService)
  private router: Router = inject(Router)

  ngOnInit(): void {
    this.signUpForm = new FormGroup<SignUpForm>({
        [SignUpFormKeyName.firstName]: new FormControl("", {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(100)
          ]
        }),
        [SignUpFormKeyName.lastName]: new FormControl("", {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(100)
          ]
        }),
        [SignUpFormKeyName.email]: new FormControl("", {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.email
          ]
        }),
        [SignUpFormKeyName.password]: new FormControl("", {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(50)
          ]
        }),
        [SignUpFormKeyName.birthDate]: new FormControl(this.today, {
          nonNullable: true,
          validators: [
            Validators.required,
          ]
        }),
        [SignUpFormKeyName.showPassword]: new FormControl(false, {
          nonNullable: true,
        }),
    })

    this.signUpForm.valueChanges.subscribe(() => {
      this.updateErrorsDisplay(SignUpFormKeyName.firstName, this.displayFirstNameError);
      this.updateErrorsDisplay(SignUpFormKeyName.lastName, this.displayLastNameError);
      this.updateErrorsDisplay(SignUpFormKeyName.email, this.displayEmailError);
      this.updateErrorsDisplay(SignUpFormKeyName.password, this.displayPasswordError);
    })
  }

  private updateErrorsDisplay(
    signUpFormKeyName: SignUpFormKeyName,
    signal: WritableSignal<boolean>
  ): void {
    const formField: AbstractControl<string | boolean | NgbDate, string | boolean | NgbDate> | null = this.signUpForm.get(signUpFormKeyName);
    const displayError = !!((formField?.dirty || formField?.touched) && formField?.errors)
    signal.set(displayError);
  }

  protected submitForm() {
    if (!this.signUpForm.valid) {
      this.signUpForm.markAllAsTouched();
      this.signUpForm.patchValue({});
      return;
    }

    const birthDate: NgbDate = this.signUpForm.value[SignUpFormKeyName.birthDate] || this.ngbCalendar.getToday();
    const user: User = {
      [SignUpFormKeyName.firstName]:  this.signUpForm.value[SignUpFormKeyName.firstName] || "",
      [SignUpFormKeyName.lastName]:  this.signUpForm.value[SignUpFormKeyName.lastName] || "",
      [SignUpFormKeyName.email]:  this.signUpForm.value[SignUpFormKeyName.email] || "",
      [SignUpFormKeyName.password]:  this.signUpForm.value[SignUpFormKeyName.password] || "",
      [SignUpFormKeyName.birthDate]:  new Date(birthDate.year, birthDate.month - 1, birthDate.day),
    };

    this.authService.signup(user).subscribe({
      next: () => {
        this.signUpForm.reset();
        this.showSuccessMessage = true;
        timer(4000).subscribe(() => {
          this.showSuccessMessage = false;
          this.router.navigate(['/signin']);
        });
      },
    })
  }
}
