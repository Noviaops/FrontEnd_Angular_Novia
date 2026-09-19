import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  validationForm: FormGroup;
  dynamicForm: FormGroup;
  crossFieldForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    // FormBuilder membantu membuat FormGroup dan FormControl secara ringkas.
    this.validationForm = this.fb.group({
      nama: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      umur: ['', [Validators.required, Validators.min(17), Validators.max(60)]]
    });

    // FormArray digunakan karena jumlah skill dapat bertambah atau berkurang.
    this.dynamicForm = this.fb.group({
      skills: this.fb.array([this.fb.control('', Validators.required)])
    });

    // Custom validator membandingkan dua FormControl dalam satu FormGroup.
    this.crossFieldForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  get validationControls() { return this.validationForm.controls; }
  get skills(): FormArray { return this.dynamicForm.get('skills') as FormArray; }
  get crossFieldControls() { return this.crossFieldForm.controls; }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmation = group.get('password_confirmation')?.value;
    if (!password || !confirmation) return null;
    return password === confirmation ? null : { passwordMismatch: true };
  }

  addSkill(): void {
    this.skills.push(new FormControl('', Validators.required));
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  submitValidation(): void {
    if (this.validationForm.invalid) {
      // markAllAsTouched() membuka semua pesan error setelah submit.
      this.validationForm.markAllAsTouched();
      alert('Form masih memiliki kesalahan.');
      return;
    }
    alert('Form validation berhasil.');
  }

  submitDynamicForm(): void {
    if (this.dynamicForm.invalid) {
      this.dynamicForm.markAllAsTouched();
      alert('Skill tidak boleh kosong.');
      return;
    }
    alert('Dynamic Form berhasil.');
  }

  submitCrossField(): void {
    if (this.crossFieldForm.invalid) {
      this.crossFieldForm.markAllAsTouched();
      alert('Password belum valid atau belum cocok.');
      return;
    }
    alert('Cross Field Validation berhasil.');
  }
}
