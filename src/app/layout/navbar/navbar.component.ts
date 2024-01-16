import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @Output() notifyViewPdf: EventEmitter<any> = new EventEmitter<any>();
  @Output() notifyDownloadPdf: EventEmitter<any> = new EventEmitter<any>();
  @Output() notifyLoadMockCV: EventEmitter<any> = new EventEmitter<any>();

  viewPdf() {
    this.notifyViewPdf.emit();
  }

  downloadPdf() {
    this.notifyDownloadPdf.emit();
  }
  
  loadMockCV() {
    this.notifyLoadMockCV.emit();
  }
}
