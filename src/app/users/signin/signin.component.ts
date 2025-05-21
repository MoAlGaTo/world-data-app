import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormTemplateComponent } from '../form-template/form-template.component';
import { Router } from '@angular/router';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, User } from '../../core/services/auth/auth.service';

enum SignInFormKeyName {
  email = "email",
  password = "password",
  showPassword = "showPassword",
}

interface SignInForm {
  [SignInFormKeyName.email]: FormControl<string>,
  [SignInFormKeyName.password]: FormControl<string>
  [SignInFormKeyName.showPassword]: FormControl<boolean>
}

@Component({
  selector: 'app-signin',
  imports: [
    ReactiveFormsModule,
    FormTemplateComponent,
    NgbAlertModule,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent implements OnInit {
  protected signInForm: FormGroup<SignInForm>;
  protected SignInFormKeyName: typeof SignInFormKeyName = SignInFormKeyName;

  protected displayEmailError: WritableSignal<boolean> = signal(false);
  protected displayPasswordError: WritableSignal<boolean> = signal(false);

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  protected showNotValidAccountMessage = false;

  ngOnInit(): void {
    this.signInForm = new FormGroup<SignInForm>({
      [SignInFormKeyName.email]: new FormControl("", {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.email
        ]
      }),
      [SignInFormKeyName.password]: new FormControl("", {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50)
        ]
      }),
      [SignInFormKeyName.showPassword]: new FormControl(false, {
        nonNullable: true,
      })
    })

    this.signInForm.valueChanges.subscribe(() => this.showNotValidAccountMessage = false)
  }

  private updateErrorsDisplay(
    signInFormKeyName: SignInFormKeyName,
    signal: WritableSignal<boolean>
  ): void {
    const formField: AbstractControl<string | boolean, string | boolean> | null = this.signInForm.get(signInFormKeyName);
    const displayError = !!((formField?.dirty || formField?.touched) && formField?.errors)
    signal.set(displayError);
  }

  protected submitForm() {
    if (!this.signInForm.valid) {
      this.signInForm.markAllAsTouched();
      this.updateErrorsDisplay(SignInFormKeyName.email, this.displayEmailError);
      this.updateErrorsDisplay(SignInFormKeyName.password, this.displayPasswordError);
      return;
    }


    const user: Pick<User, "email" | "password"> = {
      email:  this.signInForm.value[SignInFormKeyName.email] || "",
      password:  this.signInForm.value[SignInFormKeyName.password] || "",
    }

    this.authService.signin(user).subscribe({
      next: () => {
        this.router.navigate(['/map']);
      },
      error: () => {
        this.showNotValidAccountMessage = true;
      }
    })
  }
}
