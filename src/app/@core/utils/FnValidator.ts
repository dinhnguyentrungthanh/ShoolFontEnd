import { AbstractControl } from '@angular/forms';

export const regexPhone = new RegExp(/^(84|0[3|5|7|8|9])+([0-9]{8})/);

export const regexEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

export const regexUrl = new RegExp(/^$|^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/);

export function ValidatePhone(control: AbstractControl): {[key: string]: any} | null  {
  if (control.value && !regexPhone.test(control.value)) {
    return {phoneNumberInvalid: true };
  }
  return null;
}

export function ValidateEmail(control: AbstractControl): {[key: string]: any} | null  {
  if (control.value && !regexEmail.test(control.value)) {
    return {emailInvalid: true };
  }
  return null;
}

export function ValidateUrl(control: AbstractControl): {[key: string]: any} | null  {
  if (control.value && !regexEmail.test(control.value)) {
    return {urlInvalid: true };
  }
  return null;
}
