import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  alertMessage: string = "";
  alertType: string = "";
  showAlert: boolean = false;

  constructor() { }

  async showMessageAlert(message: string, delay: number) {
    this.alertMessage = message;
    this.showAlert = true;

    setTimeout(() => {
      this.alertMessage = "";
      this.showAlert = false;
    }, delay * 1000);
  }

}
