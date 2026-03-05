import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export default function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword');

    if (password !== confirmPassword?.value) {
        confirmPassword?.setErrors({ mismatch: true });
        return { mismatch: true };
    }
    return null;
}
