import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  loading: boolean = false;
  url_logo: string = "assets/logos/main_logo.png";
  messages: { [key: string]: string } = {};

  constructor() {
  }

  show() {
    this.loading = true;
  }

  hide() {
    this.loading = false;
  }

  showWithMessage(key: string, message: string) {
    this.messages[key] = message;
    this.show();
  }

  hideWithMessage(key: string) {
    if (!(key in this.messages)) {
      console.error(`No se encuentra la key: "${key}".`);
      return;
    }
    delete this.messages[key];
    this.hide();
  }

  get getMessagesArray(): string[] {
    return Object.values(this.messages) || [];
  }
}
