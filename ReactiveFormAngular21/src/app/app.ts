import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
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
export class App implements OnInit {
  registrationForm!: FormGroup;
  submittedData: Record<string, unknown> | null = null;
  readonly kecamatanList = ['Batam Kota', 'Batu Aji', 'Bengkong', 'Lubuk Baja', 'Sekupang'];
  readonly kelurahanData: Record<string, string[]> = {
    'Batam Kota': ['Baloi Permai', 'Belian', 'Teluk Tering'],
    'Batu Aji': ['Buliang', 'Bukit Tempayan', 'Kibing'],
    Bengkong: ['Bengkong Laut', 'Sadai', 'Tanjung Buntung'],
    'Lubuk Baja': ['Baloi Indah', 'Kampung Pelita', 'Lubuk Baja Kota'],
    Sekupang: ['Patam Lestari', 'Sungai Harapan', 'Tanjung Riau']
  };
  kelurahanList: string[] = [];

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(3)]],
      last_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      rt: ['', [Validators.required, Validators.pattern(/^[0-9]{1,3}$/)]],
      rw: ['', [Validators.required, Validators.pattern(/^[0-9]{1,3}$/)]],
      kecamatan: ['', Validators.required],
      kelurahan: [{ value: '', disabled: true }, Validators.required],
      gender: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required],
      reason_join: ['', [Validators.required, Validators.minLength(10)]],
      hobbies: this.fb.array([])
    }, { validators: this.passwordMatchValidator });

    // valueChanges adalah Observable yang mengeluarkan nilai saat control berubah.
    this.registrationForm.get('kecamatan')?.valueChanges.subscribe((kecamatan: string) => {
      this.kelurahanList = this.kelurahanData[kecamatan] || [];
      const kelurahan = this.registrationForm.get('kelurahan');
      kelurahan?.reset('');
      if (this.kelurahanList.length > 0) kelurahan?.enable();
      else kelurahan?.disable();
    });
  }

  get f() { return this.registrationForm.controls; }
  get hobbies(): FormArray { return this.registrationForm.get('hobbies') as FormArray; }
  formatHobbies(value: unknown): string {
    return Array.isArray(value) && value.length > 0 ? value.join(', ') : '-';
  }
  addHobby(): void { this.hobbies.push(this.fb.control('', Validators.required)); }
  removeHobby(index: number): void { this.hobbies.removeAt(index); }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmation = group.get('password_confirmation')?.value;
    if (!password || !confirmation) return null;
    return password === confirmation ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      alert('Data belum lengkap atau masih terdapat kesalahan.');
      return;
    }
    this.submittedData = this.registrationForm.getRawValue();
    alert('Data berhasil disubmit!');
  }

  onReset(): void {
    this.registrationForm.reset();
    this.kelurahanList = [];
    this.registrationForm.get('kelurahan')?.disable();
    this.hobbies.clear();
    this.submittedData = null;
  }
}
